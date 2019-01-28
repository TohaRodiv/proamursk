# -*-coding: utf-8 -*-
import os

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
    WideBanner, PlaceReview, SliderItem, Slider, Feedback


class NewsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)

    class Meta:
        model = News
        fields = ('id', 'cover', 'title', 'comment', 'publication_date', 'create_date', 'edit_date', 'is_active')


class NewsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = News
        fields = ('id', 'cover', 'title', 'lead', 'content', 'comment', 'publication_date', 'create_date', 'edit_date',
                  'meta_title', 'meta_description', 'meta_keywords', 'og_image', 'is_active', )


class ReportsNestedSerializer(ModelSerializer):

    class Meta:
        model = Report
        fields = ('id', 'title',)


class EventsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    report = ObjectRelatedField(serializer_class=ReportsNestedSerializer, read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'cover', 'title', 'place', 'event_date_text', 'start_event_date', 'comment',  'report',
                  'cover_format', 'cover_format_name', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class EventsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    report = ObjectRelatedField(queryset=Report.objects.all(), serializer_class=ReportsNestedSerializer,
                                allow_null=True, required=False)
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = Event
        fields = ('id', 'cover', 'title', 'lead', 'place', 'coordinates', 'event_date_text', 'start_event_date',
                  'cover_format', 'cover_format_name', 'comment', 'content', 'create_date',
                  'report', 'edit_date', 'is_active', 'meta_title', 'meta_description',
                  'meta_keywords', 'og_image', )

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class EventsNestedSerializer(ModelSerializer):

    class Meta:
        model = Event
        fields = ('id', 'title', )


class ReportsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    event = ObjectRelatedField(serializer_class=EventsNestedSerializer, read_only=True)

    class Meta:
        model = Report
        fields = ('id', 'cover', 'title', 'place', 'event_date_text', 'start_event_date', 'comment', 'event',
                  'cover_format', 'cover_format_name', 'publication_date', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class ReportsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    event = ObjectRelatedField(queryset=Event.objects.all(), serializer_class=EventsNestedSerializer, allow_null=True,
                               required=False)
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = Report
        fields = ('id', 'cover', 'title', 'lead', 'place', 'coordinates', 'event_date_text', 'start_event_date',
                  'cover_format', 'cover_format_name', 'comment', 'content', 'publication_date', 'event',
                  'create_date', 'edit_date', 'is_active', 'meta_title', 'meta_description',
                  'meta_keywords', 'og_image')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class HistoryListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'comment', 'publication_date',
                  'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class HistoryDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = History
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'meta_title',
                  'meta_description', 'meta_keywords', 'og_image')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class PersonsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'comment',
                  'publication_date', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class PersonsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = Person
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'meta_title',
                  'meta_description', 'meta_keywords', 'og_image')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class CityGuidesListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = CityGuide
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'comment', 'publication_date',
                  'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class CityGuidesDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = CityGuide
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'meta_title',
                  'meta_description', 'meta_keywords', 'og_image')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class PlacesListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'address', 'comment',
                  'publication_date', 'create_date', 'edit_date', 'is_active', 'reviews_count')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)
    
    def get_reviews_count(self, instance):
        return instance.reviews_count if hasattr(instance, 'reviews_count') else 0


class PlacesDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = Place
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'address', 'coordinates', 'schedule', 'comment', 'publication_date', 'meta_title', 'meta_description',
                  'meta_keywords', 'og_image', 'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class SpecialsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = Special
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'comment', 'publication_date',
                  'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class SpecialsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = Special
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'descriptor', 'codename',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'meta_title',
                  'meta_description', 'meta_keywords', 'og_image')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class FilmsSessionsSerializer(ModelSerializer):
    class Meta:
        model = FilmSession
        fields = ('id', 'session_time', 'price')


class FilmsListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)

    class Meta:
        model = Film
        fields = ('id', 'cover', 'title', 'comment', 'create_date', 'edit_date', 'is_active')


class FilmsDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    sessions = FilmsSessionsSerializer(many=True, required=False)
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = Film
        fields = ('id', 'cover', 'title', 'description', 'release_year', 'country', 'genre', 'director', 'starring',
                  'duration', 'age_restriction', 'is_3d', 'trailer', 'purchase_link', 'comment',
                  'create_date', 'edit_date', 'is_active', 'sessions', 'meta_title',
                  'meta_description', 'meta_keywords', 'og_image')

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


class PlaceReviewsListSerializer(ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = PlaceReview
        fields = ('id', 'place', 'title', 'name', 'email', 'phone', 'comment', 'create_date', 'edit_date',
                  'is_active')

    def get_title(self, instance):
        return instance.title if hasattr(instance, 'title') else ''


class PlaceReviewsDetailSerializer(ModelSerializer):
    title = serializers.SerializerMethodField()

    class Meta:
        model = PlaceReview
        fields = ('id', 'place', 'title', 'name', 'email', 'phone', 'text', 'comment', 'create_date',
                  'edit_date', 'is_active')

    def get_title(self, instance):
        return instance.title if hasattr(instance, 'title') else ''


class SlidersItemSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)

    class Meta:
        model = SliderItem
        fields = ('id', 'cover', 'description', 'is_active')


class SlidersListSerializer(ModelSerializer):
    slides_count = serializers.SerializerMethodField()
    format_name = serializers.SerializerMethodField()

    class Meta:
        model = Slider
        fields = ('id', 'title', 'format', 'format_name', 'comment', 'slides_count', 'create_date', 'edit_date',
                  'is_active')

    def get_slides_count(self, instance):
        return instance.slides_count if hasattr(instance, 'slides_count') else 0

    def get_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.format)


class SlidersDetailSerializer(ModelSerializer):
    slides = SlidersItemSerializer(many=True, required=False)
    format_name = serializers.SerializerMethodField()

    class Meta:
        model = Slider
        fields = ('id', 'title', 'format', 'format_name', 'comment', 'start_publication_date', 'end_publication_date',
                  'create_date', 'edit_date', 'is_active', 'slides')

    def get_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.format)

    def create(self, validated_data):
        sessions_data = validated_data.pop('slides') if 'slides' in validated_data else []
        instance = super(SlidersDetailSerializer, self).create(validated_data)
        self.create_child_objects(sessions_data, SliderItem, dict(slider=instance))
        return instance

    def update(self, instance, validated_data):
        sessions_data = validated_data.pop('slides') if 'slides' in validated_data else []
        instance = super(SlidersDetailSerializer, self).update(instance, validated_data)
        self.update_child_objects(sessions_data, SliderItem, dict(slider=instance))
        return instance


class FeedbackListSerializer(ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    attachment = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ('id', 'subject', 'subject_name', 'name', 'email', 'phone', 'attachment', 'create_date')

    def get_subject_name(self, instance):
        return dict(instance.SUBJECTS).get(instance.subject)

    def get_attachment(self, instance):
        return {'name': os.path.basename(instance.attachment.name),
                'url': instance.attachment.url} if instance.attachment else None


class FeedbackDetailSerializer(ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    attachment = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ('id', 'subject', 'subject_name', 'name', 'email', 'phone', 'text', 'attachment', 'create_date')

    def get_subject_name(self, instance):
        return dict(instance.SUBJECTS).get(instance.subject)

    def get_attachment(self, instance):
        return {'name': os.path.basename(instance.attachment.name),
                'url': instance.attachment.url} if instance.attachment else None
