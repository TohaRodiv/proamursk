# -*-coding: utf-8 -*-
import os

from rest_framework import serializers

from applications.mediafiles.cp.serializers import ImageNestedSerializer
from applications.mediafiles.models import MediaFile
from applications.files.cp.serializers import UserFileNestedSerializer
from applications.files.models import UserFile
from cp_vue.api.fields import ObjectRelatedField
from cp_vue.api.serializers import ModelSerializer
from ..models import (News, Event, Report, History, Person, CityGuide, Place, Special, Film, FilmSession, SidebarBanner,
                      WideBanner, PlaceReview, SliderItem, Slider, Feedback, TextError, HistoryRubric, CityGuideItem)


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
        fields = ('id', 'cover', 'title', 'descriptor', 'lead', 'content', 'comment', 'publication_date',
                  'create_date', 'edit_date',
                  'meta_title', 'meta_description', 'meta_keywords', 'og_image', 'is_active', 'cover_author',
                  'content_author', 'show_two_banners')


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
        fields = ('id', 'cover', 'title', 'place', 'coordinates', 'event_date_text', 'start_event_date', 'comment',  'report',
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
                  'meta_keywords', 'og_image', 'cover_author', 'content_author', 'show_two_banners')

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
        fields = ('id', 'cover', 'title', 'place', 'event_date_text', 'comment', 'event',
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
        fields = ('id', 'cover', 'title', 'lead', 'place', 'coordinates', 'event_date_text',
                  'cover_format', 'cover_format_name', 'comment', 'content', 'publication_date', 'event',
                  'create_date', 'edit_date', 'is_active', 'meta_title', 'meta_description',
                  'meta_keywords', 'og_image', 'cover_author', 'content_author', 'show_two_banners')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)

    def validate_event(self, data):
        if data:
            qs = Report.objects.filter(event=data)
            if self.instance and self.instance.id:
                qs = qs.exclude(id=self.instance.id)

            if qs.exists():
                raise serializers.ValidationError('Репортаж для выбранного события уже существует')

        return data


class HistoryRubricNestedSerializer(ModelSerializer):

    class Meta:
        model = HistoryRubric
        fields = ('id', 'name')


class HistoryRubricListSerializer(ModelSerializer):

    class Meta:
        model = HistoryRubric
        fields = ('id', 'name', 'comment', 'create_date', 'edit_date')


class HistoryRubricDetailSerializer(ModelSerializer):

    class Meta:
        model = HistoryRubric
        fields = ('id', 'name', 'comment', 'create_date', 'edit_date')


class HistoryListSerializer(ModelSerializer):
    rubric = serializers.SerializerMethodField()
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = ('id', 'cover', 'cover_format', 'rubric', 'cover_format_name', 'title', 'comment', 'publication_date',
                  'create_date', 'edit_date', 'is_active')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)

    def get_rubric(self, obj):
        return obj.rubric.name


class HistoryDetailSerializer(ModelSerializer):
    rubric = ObjectRelatedField(queryset=HistoryRubric.objects.all(), serializer_class=HistoryRubricNestedSerializer)
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = History
        fields = ('id', 'cover', 'cover_format', 'rubric', 'cover_format_name', 'title', 'lead', 'descriptor', 'content',
                  'comment', 'publication_date', 'create_date', 'edit_date', 'is_active', 'meta_title',
                  'meta_description', 'meta_keywords', 'og_image', 'cover_author', 'content_author', 'show_two_banners')

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
                  'meta_description', 'meta_keywords', 'og_image', 'cover_author', 'content_author', 'show_two_banners')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)


class PlacesNestedSerializer(ModelSerializer):

    class Meta:
        model = Place
        fields = ('id', 'title', 'is_active', )


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
                  'address', 'coordinates', 'schedule', 'contacts', 'site',  'instagram', 'comment',
                  'publication_date', 'meta_title', 'meta_description',
                  'meta_keywords', 'og_image', 'create_date', 'edit_date', 'is_active', 'cover_author',
                  'content_author', 'show_two_banners')

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
                  'meta_description', 'meta_keywords', 'og_image', 'cover_author', 'content_author')

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
    sessions = FilmsSessionsSerializer(many=True, required=True)
    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )

    class Meta:
        model = Film
        fields = ('id', 'cover', 'title', 'description', 'release_year', 'country', 'genre', 'director', 'starring',
                  'duration', 'age_restriction', 'is_3d', 'trailer', 'purchase_link', 'comment',
                  'create_date', 'edit_date', 'is_active', 'sessions', 'meta_title',
                  'meta_description', 'meta_keywords', 'og_image', 'show_two_banners')

    def validate_sessions(self, data):
        if not data:
            raise serializers.ValidationError("Добавьте запись")

        return data

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
    horizontal_cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)

    class Meta:
        model = SidebarBanner
        fields = ('id', 'horizontal_cover', 'cover', 'title', 'link', 'start_publication_date', 'end_publication_date', 'comment',
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
        fields = ('id', 'cover', 'description', 'is_active', 'weight')


class SlidersNestedSerializer(ModelSerializer):

    class Meta:
        model = Slider
        fields = ('id', 'title', 'format', 'is_active')


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
    attachments = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ('id', 'subject', 'subject_name', 'name', 'email', 'phone', 'attachments', 'create_date')

    def get_subject_name(self, instance):
        return dict(instance.SUBJECTS).get(instance.subject)

    def get_attachments(self, instance):
        result = []
        if instance and instance.id:
            result = [a.name for a in instance.attachments.all()]

        return result


class FeedbackDetailSerializer(ModelSerializer):
    subject_name = serializers.SerializerMethodField()
    attachments = ObjectRelatedField(queryset=UserFile.objects.all(), serializer_class=UserFileNestedSerializer, many=True)

    class Meta:
        model = Feedback
        fields = ('id', 'subject', 'subject_name', 'name', 'email', 'phone', 'text', 'attachments', 'create_date')

    def get_subject_name(self, instance):
        return dict(instance.SUBJECTS).get(instance.subject)


class TextErrorListSerializer(ModelSerializer):

    class Meta:
        model = TextError
        fields = ('id', 'url', 'create_date')


class TextErrorDetailSerializer(ModelSerializer):

    class Meta:
        model = TextError
        fields = ('id', 'url', 'text', 'create_date')


class CityGuideItemSerializer(ModelSerializer):
    place = ObjectRelatedField(queryset=Place.objects.all(), serializer_class=PlacesNestedSerializer,
                               required=False, allow_null=True, allow_empty=True)
    slider = ObjectRelatedField(queryset=Slider.objects.all(), serializer_class=SlidersNestedSerializer,
                                required=False, allow_null=True, allow_empty=True)
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                               required=False, allow_null=True, allow_empty=True)

    class Meta:
        model = CityGuideItem
        fields = ('id', 'title', 'description', 'place', 'single_room_price', 'luxury_room_price', 'nutrition_info',
                  'kitchen', 'avg_value', 'enter_price', 'work_time', 'phone', 'site', 'instagram', 'address',
                  'coordinates', 'slider', 'cover', 'create_date', 'edit_date', 'is_active', 'weight', 'cover_description')


class CityGuidesListSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()
    guide_format_name = serializers.SerializerMethodField()

    class Meta:
        model = CityGuide
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'guide_format', 'guide_format_name', 'title',
                  'comment', 'is_active', 'create_date', 'edit_date')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)

    def get_guide_format_name(self, instance):
        return dict(instance.GUIDE_FORMATS).get(instance.guide_format)


class CityGuidesDetailSerializer(ModelSerializer):
    cover = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer)
    cover_format_name = serializers.SerializerMethodField()

    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False,
                                  allow_null=True
                                  )
    items = CityGuideItemSerializer(many=True, required=False)
    guide_format_name = serializers.SerializerMethodField()

    class Meta:
        model = CityGuide
        fields = ('id', 'cover', 'cover_format', 'cover_format_name', 'title', 'descriptor', 'guide_format',
                  'guide_format_name', 'comment', 'create_date', 'edit_date', 'meta_title',
                  'meta_description', 'meta_keywords', 'og_image', 'show_two_banners', 'is_active',
                  'items')

    def get_cover_format_name(self, instance):
        return dict(instance.FORMATS).get(instance.cover_format)

    def get_guide_format_name(self, instance):
        return dict(instance.GUIDE_FORMATS).get(instance.guide_format)

    def validate_guide_format(self, data):
        if data:
            guides = CityGuide.objects.filter(guide_format=data)
            if self.instance and self.instance.pk:
                guides = guides.exclude(id=self.instance.pk)
            if guides.exists():
                raise serializers.ValidationError("Гид с выбранным типом уже существует")

        return data

    def create(self, validated_data):
        items = validated_data.pop('items') if 'items' in validated_data else []
        instance = super(CityGuidesDetailSerializer, self).create(validated_data)
        self.create_child_objects(items, CityGuideItem, dict(city_guide=instance))
        search_text = ''
        for i in items:
            search_text += ' '
            search_text += i.get('title', '')
            search_text += ' '
            search_text += i.get('description', '')

        instance.search_text = search_text
        instance.save()

        return instance

    def update(self, instance, validated_data):
        items = validated_data.pop('items') if 'items' in validated_data else []
        instance = super(CityGuidesDetailSerializer, self).update(instance, validated_data)
        self.update_child_objects(items, CityGuideItem, dict(city_guide=instance))
        search_text = ''
        for i in items:
            search_text += ' '
            search_text += i.get('title', '')
            search_text += ' '
            search_text += i.get('description', '')

        instance.search_text = search_text
        instance.save()
        return instance

