# -*- coding: utf-8 -*-
from __future__ import unicode_literals


from cp_vue.api.core import cp_api
from cp_vue.api.views import CpViewSet

from rest_framework import status
from django.conf.urls import url
from django.http import HttpResponseNotAllowed
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from PIL import Image
from django.db.models import Sum, Count
from cp_vue.api.utils import get_deleted_objects, get_values
from .serializers import (PageSettingListSerializer, PageSettingDetailSerializer, StaticPagesListSerializer,
                          StaticPagesDetailSerializer)
from .filters import PageFilter
from ..models import Page


class SetupStaticPageCpViewSet(CpViewSet):
    path = 'static-page-settings'
    model = Page
    list_serializer_class = PageSettingListSerializer
    serializer_class = PageSettingDetailSerializer
    queryset = Page.objects.all().order_by('name')
    filter_class = PageFilter
    ordering_fields = ('id', 'name', 'codename', 'create_date', 'edit_date')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        delete_objects, protected = get_deleted_objects(self.model.objects.filter(id=instance.id))

        del_objects_list = []
        for d in delete_objects:
            if isinstance(d, dict):
                del_objects_list.append(d)
            else:
                del_objects_list += get_values(d)

        related_objects = [k for k in del_objects_list if k['object']._meta.object_name not in ['Page',
                                                                                                'ContentBlock',
                                                                                                ]]
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
                                'Page',
                                'ContentBlock',]]
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


class StaticPageCpViewSet(CpViewSet):
    path = 'static-pages'
    model = Page
    list_http_method_names = ['get', 'head', 'options', 'trace']
    detail_http_method_names = ['get', 'put', 'head', 'options', 'trace']
    list_serializer_class = StaticPagesListSerializer
    serializer_class = StaticPagesDetailSerializer
    queryset = Page.objects.all().prefetch_related('blocks').order_by('name')
    filter_class = PageFilter
    ordering_fields = ('id', 'name', 'create_date', 'edit_date')


cp_api.register(SetupStaticPageCpViewSet)
cp_api.register(StaticPageCpViewSet)
