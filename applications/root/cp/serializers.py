# -*-coding: utf-8 -*-

from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import serializers

from applications.mediafiles.cp.serializers import ImageNestedSerializer
from applications.mediafiles.models import MediaFile
from cp_vue.api.fields import ObjectRelatedField
from cp_vue.api.serializers import ModelSerializer
from cp_vue.cp.serializers import CpRoleNestedSerializer
# from applications.tools.utils import filter_number
from cp_vue.models import CpRole
from ..models import News, Event


class NewsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)

    class Meta:
        model = News
        fields = ('id', 'cover', 'title', 'site_link', 'comment', 'publication_date', 'create_date', 'edit_date',
                  'is_active')


class NewsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)

    class Meta:
        model = News
        fields = ('id', 'cover', 'title', 'lead', 'content', 'comment', 'publication_date', 'create_date', 'edit_date',
                  'is_active', 'site_link')


class EventsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ('id', 'cover', 'title', 'place', 'event_date_text', 'start_event_date', 'site_link', 'comment',
                  'cover_format', 'cover_format_name', 'publication_date', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class EventsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ('id', 'cover', 'title', 'lead', 'place', 'coordinates', 'event_date_text', 'start_event_date',
                  'cover_format', 'cover_format_name', 'site_link', 'comment', 'content', 'publication_date',
                  'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)

