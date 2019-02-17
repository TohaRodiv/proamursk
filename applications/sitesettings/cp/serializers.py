# -*-coding: utf-8 -*-
import os

from django.conf import settings
from django.template.loader import render_to_string
from rest_framework import serializers
from cp_vue.api.serializers import ModelSerializer
from ..models import Settings


class SettingsSerializer(ModelSerializer):
    copyright = serializers.CharField(required=True)

    class Meta:
        model = Settings
        fields = ('mailer_lite_api_key', 'instagram', 'odnoklassniki', 'show_banner_on_main_page', 'copyright',
                  'yandex_count', 'google_count', 'meta_tags', 'robots', 'disable_site', 'disable_title',
                  'disable_text', 'create_date', 'edit_date')

    def update(self, instance, validated_data):
        instance = super(SettingsSerializer, self).update(instance, validated_data)
        self.save_template_to_file(self.context['request'])
        return instance

    def save_template_to_file(self, request):
        context = {
            'new_settings': {
                'disable_title': request.data.get('disable_title'),
                'disable_text': request.data.get('disable_text')
            }
        }
        content = render_to_string('sitesettings/maintenance-mode.html', context, request=request)
        static_path = settings.STATIC_ROOT if settings.STATIC_ROOT else os.path.join(settings.BASE_DIR, 'static')
        template_file = os.path.join(static_path, 'maintenance_mode.html')
        fl = open(template_file, 'w')
        fl.write(content)
        fl.close()



