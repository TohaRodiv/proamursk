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
from ..models import News, Event, Report, History, Person, CityGuide, Place, Special


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


class ReportsNestedSerializer(ModelSerializer):
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Report
        fields = ('id', 'title', 'site_link')


class EventsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()
    report = ObjectRelatedField(queryset=Report.objects.all(), serializer_class=ReportsNestedSerializer)

    class Meta:
        model = Event
        fields = ('id', 'cover', 'title', 'place', 'event_date_text', 'start_event_date', 'site_link', 'comment',
                  'report', 'cover_format', 'cover_format_name', 'publication_date', 'create_date', 'edit_date',
                  'is_active')

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


class EventsNestedSerializer(ModelSerializer):
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'site_link')


class ReportsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()
    event = ObjectRelatedField(queryset=Event.objects.all(), serializer_class=EventsNestedSerializer, allow_null=True)

    class Meta:
        model = Report
        fields = ('id', 'cover', 'title', 'place', 'event_date_text', 'start_event_date', 'site_link', 'comment',
                  'event', 'cover_format', 'cover_format_name', 'publication_date', 'create_date', 'edit_date',
                  'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class ReportsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()
    event = ObjectRelatedField(queryset=Event.objects.all(), serializer_class=EventsNestedSerializer, allow_null=True)

    class Meta:
        model = Report
        fields = ('id', 'cover', 'title', 'lead', 'place', 'coordinates', 'event_date_text', 'start_event_date',
                  'cover_format', 'cover_format_name', 'site_link', 'comment', 'content', 'publication_date', 'event',
                  'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class HistoryListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'site_link', 'comment',
                  'publication_date', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class HistoryDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'site_link')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class PersonsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'site_link', 'comment',
                  'publication_date', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class PersonsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'site_link')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class CityGuidesListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = CityGuide
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'site_link', 'comment',
                  'publication_date', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class CityGuidesDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = CityGuide
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'site_link')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class PlacesListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'address', 'site_link', 'comment',
                  'publication_date', 'create_date', 'edit_date', 'is_active', 'reviews_count')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)
    
    def get_reviews_count(self, instance):
        return instance.reviews_count if hasattr(instance, 'reviews_count') else 0


class PlacesDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'address', 'coordinates', 'comment', 'publication_date', 'create_date', 'edit_date', 'is_active',
                  'site_link')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class SpecialsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Special
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'site_link', 'comment',
                  'publication_date', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class SpecialsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Special
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'descriptor', 'codename',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'site_link')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)
