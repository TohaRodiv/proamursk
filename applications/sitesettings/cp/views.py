# -*- coding: utf-8 -*-

from django.db.models import Count, ObjectDoesNotExist
from rest_framework import generics, permissions
from cp_vue.api.core import cp_api
from cp_vue.api.views import CpViewSet
from rest_framework.response import Response
from .serializers import SettingsSerializer
from ..models import Settings
from ..views import get_site_settings


class SettingsCpViewSet(CpViewSet):
    path = 'settings'
    model = Settings
    name = 'Общие настройки сайта'
    detail_http_method_names = ['get', 'put', 'patch', 'head', 'options', 'trace']
    serializer_class = SettingsSerializer
    queryset = Settings.objects.all()
    available_actions = dict()
    available_views = ['detail']

    def get_object(self):
        try:
            obj = Settings.objects.get(id=1)
        except ObjectDoesNotExist:
            obj = Settings.objects.create(id=1)
        self.check_object_permissions(self.request, obj)

        return obj


cp_api.register(SettingsCpViewSet)