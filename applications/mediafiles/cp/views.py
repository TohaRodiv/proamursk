# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from PIL import Image
from django import forms
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum
from django.http import HttpResponseNotAllowed
from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

from cp_vue.api.core import cp_api
from cp_vue.api.permissions import SapPermissions
from cp_vue.api.utils import get_deleted_objects, get_values
from cp_vue.api.views import CpViewSet
from .filters import ImageFilter
from .serializers import (ImageNestedSerializer, ImageListSerializer, ImageDetailSerializer, ExtensionSerializer)
from ..models import MediaFile, MediaTag, Extension


def get_file_data(fl):
    file_size_kb = int(round(float(fl.size) / 1024, 0))
    width, height = get_image_resolution(fl)
    file_name = fl.name

    return {'name': file_name,
            'file_size': file_size_kb,
            'width': width,
            'height': height}


def get_image_resolution(file_data):
    resolution = (None, None)
    file_data.seek(0)
    try:
        im = Image.open(file_data)
    except Exception as e:
        im = None

    if im is not None:
        resolution = im.size
    file_data.seek(0)

    return resolution


class UploadForm(forms.ModelForm):

    class Meta:
        model = MediaFile
        exclude = ()

    def clean_file(self):
        medialib_ext = ('jpg', 'jpeg', 'png', 'gif') if not hasattr(settings, 'MEDIALIB_EXT') else settings.MEDIALIB_EXT
        file_ext = self.cleaned_data['file'].name.split('.')[-1]
        if file_ext.lower() in medialib_ext:
            return self.cleaned_data['file']
        else:
            raise forms.ValidationError(u'Доступные форматы файла %s' % ', '.join(medialib_ext), code='invalid')


class MediaTagCpViewSet(CpViewSet):
    path = 'mediafiles-tags'
    model = MediaTag
    queryset = MediaTag.objects.all().order_by('name')
    ordering_fields = ('id', 'name',)
    available_actions = dict()
    available_views = ['select']


class ExtensionCpViewSet(CpViewSet):
    path = 'mediafiles-extensions'
    model = Extension
    serializer_class = ExtensionSerializer
    queryset = Extension.objects.all().order_by('name')
    ordering_fields = ('id', 'name',)
    available_actions = dict()
    available_views = ['select']


class ImageCpViewSet(CpViewSet):
    path = 'mediafiles'
    name = u'Галерея'
    model = MediaFile
    list_serializer_class = ImageListSerializer
    serializer_class = ImageDetailSerializer
    queryset = MediaFile.objects.all().select_related('extension').annotate(thumbnails_size=Sum('thumbnail__file_size')).order_by('id')
    filter_class = ImageFilter
    exclude_permissions = dict(list=['post'])
    ordering_fields = ('id', 'name', 'width', 'height', 'file_size', 'thumbnails_size', 'create_date',)
    # parser_classes = (MultiPartParser,)

    def get_tags_id(self, request):
        tags = request.POST.get('tags', '')
        tags = tags.split(',')
        tags_id = []
        for tag_name in tags:
            try:
                tag = MediaTag.objects.get(name=tag_name)
            except ObjectDoesNotExist:
                tag = MediaTag.objects.create(name=tag_name)
            except:
                tag = None

            if tag:
                tags_id.append(tag.id)

        return tags_id

    def post(self, request, *args, **kwargs):
        self.parser_classes = (MultiPartParser,)
        file_obj = request.FILES['file']
        is_image = True
        try:
            Image.open(file_obj).load()
        except:
            is_image = False

        if not is_image:
            return Response(status=400)

        file_obj.seek(0)
        data = get_file_data(file_obj)
        data['is_active'] = True
        data['tags'] = self.get_tags_id(request)
        form = UploadForm(data, request.FILES)
        if form.is_valid():
            form.save()
            obj = form.instance
            try:
                width = int(request.POST.get('width'))
            except:
                width = None
            try:
                height = int(request.POST.get('height'))
            except:
                height = None

            if width and height:
                thumbnail_url = obj.get_thumbnail_url_by_size((width, height))
            else:
                thumbnail_url = ''

            result = ImageNestedSerializer(instance=obj).data

            return Response(result, status=200)
        else:
            return Response(status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        delete_objects, protected = get_deleted_objects(self.model.objects.filter(id=instance.id))
        is_clear_thumbnails = request._request.GET.get('thumbnails', '') == 'true'
        del_objects_list = []
        for d in delete_objects:
            if isinstance(d, dict):
                del_objects_list.append(d)
            else:
                del_objects_list += get_values(d)
        if is_clear_thumbnails:
            instance.thumbnail_set.all().delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            related_objects = [k for k in del_objects_list if k['object']._meta.object_name not in ['MediaFile',
                                                                                                    'Thumbnail',
                                                                                                    'MediaFile_tags']]
            if not related_objects:
                self.perform_destroy(instance)
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response(status=400)

    def perform_destroy(self, instance):
        instance.delete()

    def delete_action(self, qs, data):
        delete_objects, protected = get_deleted_objects(qs)
        objects_with_related_data = {}

        def get_related_objects(obj_list):

            i = 0
            while i < len(delete_objects):
                try:
                    item = delete_objects[i]
                except:
                    pass
                else:
                    if isinstance(item, dict):
                        try:
                            next_item = delete_objects[i+1]
                        except:
                            next_item = None

                        if isinstance(next_item, list):
                            related_objects = [k for k in next_item if not isinstance(k, list) and k['object']._meta.object_name not in [
                                'MediaFile',
                                'Thumbnail',
                                'MediaFile_tags']]
                            if related_objects:
                                objects_with_related_data[item['object']] = related_objects
                            i = i + 2
                        else:
                            i = i + 1

        get_related_objects(delete_objects)

        if not objects_with_related_data:
            qs.delete()
            return Response(status=200)
        else:
            return Response(status=400,
                            data=dict([(k.id,
                                        u'Удаление невозможно, запись связана в БД с другими записями') for k in
                                       objects_with_related_data.keys()]))

    def put(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(['GET', 'POST'])

    def patch(self, request, *args, **kwargs):
        if not self.is_detail_view(kwargs):
            return super(ImageCpViewSet, self).patch(request, *args, **kwargs)
        else:
            return HttpResponseNotAllowed(['GET', 'POST'])


class ImagePopUpCpViewSet(CpViewSet):
    path = 'mediafiles-pop-up'
    name = 'Поп-ап галерея'
    model = MediaFile
    list_serializer_class = ImageListSerializer
    serializer_class = ImageDetailSerializer
    queryset = MediaFile.objects.all().select_related('extension').annotate(thumbnails_size=Sum('thumbnail__file_size')).order_by('id')
    filter_class = ImageFilter
    available_actions = dict()
    available_views = ['list',]
    permission_classes = (SapPermissions,)
    ordering_fields = ('id', 'name', 'width', 'height', 'file_size', 'thumbnails_size', 'create_date',)
    exclude_permissions = dict(list=['get', 'post', 'put', 'delete', 'patch'])


cp_api.register(ImagePopUpCpViewSet)
cp_api.register(ImageCpViewSet)
cp_api.register(ExtensionCpViewSet)
cp_api.register(MediaTagCpViewSet)