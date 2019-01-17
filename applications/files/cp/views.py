# -*- coding: utf-8 -*-
from __future__ import unicode_literals


from cp_vue.api.core import cp_api
from cp_vue.api.views import CpViewSet

from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from django.conf.urls import url
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseNotAllowed
from django import forms
from cp_vue.api.permissions import SapPermissions
from cp_vue.api.utils import get_deleted_objects, get_values
from .serializers import (UserFileNestedSerializer, UserFileListSerializer,
                          UserFileDetailSerializer, FileExtensionSerializer)
from .filters import UserFileFilter
from ..models import UserFile, FileTag, FileExtension


class UploadForm(forms.ModelForm):

    class Meta:
        model = UserFile
        exclude = ()


class FileTagCpViewSet(CpViewSet):
    path = 'files-tags'
    model = FileTag
    available_actions = dict()
    available_views = ['select']
    queryset = FileTag.objects.all().order_by('name')
    ordering_fields = ('id', 'name',)


class FileExtensionCpViewSet(CpViewSet):
    path = 'files-extensions'
    model = FileExtension
    available_actions = dict()
    available_views = ['select']
    serializer_class = FileExtensionSerializer
    queryset = FileExtension.objects.all().order_by('name')
    ordering_fields = ('id', 'name',)


class FilePopUpCpViewSet(CpViewSet):
    path = 'files-pop-up'
    model = UserFile
    name = u'Поп-ап выбора файла'
    list_serializer_class = UserFileListSerializer
    serializer_class = UserFileDetailSerializer
    queryset = UserFile.objects.all().select_related('extension').order_by('id')
    filter_class = UserFileFilter
    available_views = ['list', 'detail']
    permission_classes = (SapPermissions,)
    exclude_permissions = dict(list=['get', 'post', 'put', 'delete', 'patch'])
    ordering_fields = ('id', 'name', 'file_size', 'create_date',)


class FileCpViewSet(CpViewSet):
    path = 'files'
    model = UserFile
    name = u'Файлы'
    list_serializer_class = UserFileListSerializer
    serializer_class = UserFileDetailSerializer
    queryset = UserFile.objects.all().select_related('extension').order_by('id')
    filter_class = UserFileFilter
    ordering_fields = ('id', 'name', 'file_size', 'create_date',)
    exclude_permissions = dict(list=['post'])
    parser_classes = (MultiPartParser,)

    def get_tags_id(self, request):
        tags = request.POST.get('tags', '')
        tags = tags.split(',')
        tags_id = []
        if tags:
            for tag_name in tags:
                if tag_name:
                    try:
                        tag = FileTag.objects.get(name=tag_name)
                    except ObjectDoesNotExist:
                        tag = FileTag.objects.create(name=tag_name)
                    except:
                        tag = None

                    if tag:
                        tags_id.append(tag.id)

        return tags_id

    def get_file_data(self, fl):
        file_size_kb = int(round(float(fl.size) / 1024, 0))
        file_name = fl.name

        return {'name': file_name,
                'file_size': file_size_kb
                }

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES['file']

        if file_obj.size == 0:
            return Response(dict(file=[u'Файл пустой']), status=400,)

        data = self.get_file_data(file_obj)
        data['tags'] = self.get_tags_id(request)
        form = UploadForm(data, request.FILES)
        if form.is_valid():
            form.save()
            obj = form.instance
            result = UserFileNestedSerializer(instance=obj).data

            return Response(result, status=200)
        else:
            return Response(status=400)

    def put(self, request, *args, **kwargs):
        return HttpResponseNotAllowed(['GET', 'POST'])

    def patch(self, request, *args, **kwargs):
        if not self.is_detail_view(kwargs):
            return super(FileCpViewSet, self).patch(request, *args, **kwargs)
        else:
            return HttpResponseNotAllowed(['GET', 'POST'])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        delete_objects, protected = get_deleted_objects(self.model.objects.filter(id=instance.id))

        del_objects_list = []
        for d in delete_objects:
            if isinstance(d, dict):
                del_objects_list.append(d)
            else:
                del_objects_list += get_values(d)
        related_objects = [k for k in del_objects_list if k['object']._meta.object_name not in ['UserFile',
                                                                                                'UserFile_tags']]
        if not related_objects:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=400)

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
                                'UserFile',
                                'UserFile_tags']]
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
            return Response(status=400, data=dict(objects_with_related_data=[k.id for k in objects_with_related_data.keys()]))


cp_api.register(FilePopUpCpViewSet)
cp_api.register(FileCpViewSet)
cp_api.register(FileExtensionCpViewSet)
cp_api.register(FileTagCpViewSet)