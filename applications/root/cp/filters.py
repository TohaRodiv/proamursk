# -*- coding: utf-8 -*-

from ..models import News, Event, Report, History, Person, CityGuide, Place, Special, Film, PlaceReview, Slider, \
    Feedback, SidebarBanner, WideBanner, TextError
from cp_vue.api.filters import NumberInFilter, CharInFilter, SearchFilter
from cp_vue.api.filterset import APIFilterSet
from django_filters import rest_framework as filters


class NewsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = News
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'publication_date': ['gte', 'lte']
        }


class EventsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    cover_formats__in = CharInFilter(field_name='cover_format', lookup_expr='in')

    class Meta:
        model = Event
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'start_event_date': ['gte', 'lte'],
        }


class ReportsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    cover_formats__in = CharInFilter(field_name='cover_format', lookup_expr='in')

    class Meta:
        model = Report
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'publication_date': ['gte', 'lte'],
        }


class HistoryFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    cover_formats__in = CharInFilter(field_name='cover_format', lookup_expr='in')
    rubrics_id__in = NumberInFilter(field_name='rubric', lookup_expr='in')

    class Meta:
        model = History
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'publication_date': ['gte', 'lte']
        }


class PersonsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    cover_formats__in = CharInFilter(field_name='cover_format', lookup_expr='in')

    class Meta:
        model = Person
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'publication_date': ['gte', 'lte']
        }


class CityGuidesFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    cover_formats__in = CharInFilter(field_name='cover_format', lookup_expr='in')

    class Meta:
        model = CityGuide
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'publication_date': ['gte', 'lte']
        }


class PlacesFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment', 'address'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    cover_formats__in = CharInFilter(field_name='cover_format', lookup_expr='in')
    reviews_count__lte = filters.NumberFilter(field_name='reviews_count__lte', method='common_filter')
    reviews_count__gte = filters.NumberFilter(field_name='reviews_count__gte', method='common_filter')

    class Meta:
        model = Place
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'publication_date': ['gte', 'lte']
        }


class SpecialsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    cover_formats__in = CharInFilter(field_name='cover_format', lookup_expr='in')

    class Meta:
        model = Special
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'publication_date': ['gte', 'lte']
        }


class FilmsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = Film
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte']
        }


class PlaceReviewsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'email', 'phone', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    places__in = NumberInFilter(field_name='place', lookup_expr='in')

    class Meta:
        model = PlaceReview
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte']
        }


class SlidersFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'comment'])
    formats__in = CharInFilter(field_name='format', lookup_expr='in')
    slides_count__lte = filters.NumberFilter(field_name='slides_count__lte', method='common_filter')
    slides_count__gte = filters.NumberFilter(field_name='slides_count__gte', method='common_filter')

    class Meta:
        model = Slider
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte']
        }


class FeedbackFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'email', 'phone'])
    subjects__in = CharInFilter(field_name='subject', lookup_expr='in')

    class Meta:
        model = Feedback
        fields = {
            'create_date': ['gte', 'lte']
        }


class SidebarBannersFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'link', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = SidebarBanner
        fields = {
            'start_publication_date': ['gte', 'lte'],
            'end_publication_date': ['gte', 'lte'],
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte']
        }


class WideBannersFilter(APIFilterSet):
    q = SearchFilter(search_fields=['title', 'link', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = WideBanner
        fields = {
            'start_publication_date': ['gte', 'lte'],
            'end_publication_date': ['gte', 'lte'],
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte']
        }


class TextErrorFilter(APIFilterSet):
    q = SearchFilter(search_fields=['url', 'text',])

    class Meta:
        model = TextError
        fields = {
            'create_date': ['gte', 'lte'],
        }
