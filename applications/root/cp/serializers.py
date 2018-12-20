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
from ..models import News, Event, Report, History, Person, CityGuide, Place, Special, Film, FilmSession, SidebarBanner, \
    WideBanner


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


class FilmsSessionsSerializer(ModelSerializer):
    class Meta:
        model = FilmSession
        fields = ('id', 'session_time', 'price')


class FilmsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)

    class Meta:
        model = Film
        fields = ('id', 'cover', 'title', 'site_link', 'comment', 'create_date', 'edit_date', 'is_active')


class FilmsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    site_link = serializers.URLField(source='get_absolute_url', read_only=True)
    sessions = FilmsSessionsSerializer(many=True, required=False)

    class Meta:
        model = Film
        fields = ('id', 'cover', 'title', 'description', 'release_year', 'country', 'genre', 'director', 'starring',
                  'duration', 'age_restriction', 'is_3d', 'trailer', 'purchase_link', 'comment',
                  'create_date', 'edit_date', 'is_active', 'site_link', 'sessions')

    def create(self, validated_data):
        sessions_data = validated_data.pop('sessions') if 'sessions' in validated_data else []
        instance = super(FilmsDetailSerializer, self).create(validated_data)
        self.create_child_objects(sessions_data, FilmSession, dict(film=instance))
        return instance

    def update(self, instance, validated_data):
        sessions_data = validated_data.pop('sessions') if 'sessions' in validated_data else []
        instance = super(FilmsDetailSerializer, self).update(instance, validated_data)
        self.update_child_objects(sessions_data, FilmSession, dict(film=instance))
        return instance


class SidebarBannerSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)

    class Meta:
        model = SidebarBanner
        fields = ('id', 'cover', 'title', 'link', 'start_publication_date', 'end_publication_date', 'comment',
                  'create_date', 'edit_date', 'is_active')


class WideBannerSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)

    class Meta:
        model = WideBanner
        fields = ('id', 'cover', 'title', 'link', 'start_publication_date', 'end_publication_date', 'comment',
                  'create_date', 'edit_date', 'is_active')
