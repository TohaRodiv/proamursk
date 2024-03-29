# -*- coding: utf-8 -*-
from copy import deepcopy

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.conf.urls import url
from django.db.models import Count, F
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from cp_vue.api.permissions import SapPermissions
from cp_vue.api.views import CpViewSet
from cp_vue.api.core import cp_api
from .serializers import (NewsListSerializer, NewsDetailSerializer, EventsListSerializer, EventsDetailSerializer,
                          ReportsDetailSerializer, ReportsListSerializer, HistoryDetailSerializer,
                          HistoryListSerializer,
                          PersonsDetailSerializer, PersonsListSerializer, CityGuidesDetailSerializer,
                          CityGuidesListSerializer,
                          PlacesDetailSerializer, PlacesListSerializer, SpecialsDetailSerializer,
                          SpecialsListSerializer,
                          FilmsDetailSerializer, FilmsListSerializer, SidebarBannerSerializer, WideBannerSerializer,
                          PlaceReviewsListSerializer, PlaceReviewsDetailSerializer, SlidersDetailSerializer,
                          SlidersListSerializer, FeedbackDetailSerializer, FeedbackListSerializer, TextErrorDetailSerializer,
                          TextErrorListSerializer, HistoryRubricDetailSerializer, HistoryRubricListSerializer,
                          CompilationListSerializer, CompilationDetailSerializer, CompilationSelectSerializer)

from .filters import (NewsFilter, EventsFilter, ReportsFilter, HistoryFilter, PersonsFilter, CityGuidesFilter,
                      PlacesFilter, SpecialsFilter, FilmsFilter, PlaceReviewsFilter, SlidersFilter, FeedbackFilter,
                      SidebarBannersFilter, WideBannersFilter, TextErrorFilter, HistoryRubricFilter, CompilationFilter)

from ..models import (News, Event, Report, History, Person, Place, CityGuide, Special, Film, SidebarBanner, WideBanner,
                      PlaceReview, Slider, Feedback, TextError, HistoryRubric, Compilation)

try:
    from applications.notifications.tasks import send_notification
except ImportError:
    send_notification = None
    try:
        from applications.api.tasks import send_email
    except ImportError:
        send_email = None


class NewsCpViewSet(CpViewSet):
    path = 'news'
    model = News
    queryset = News.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = NewsDetailSerializer
    list_serializer_class = NewsListSerializer
    filter_class = NewsFilter
    ordering_fields = ('id', 'title', 'publications_date', 'edit_date', 'create_date')

    def activate_action(self, qs, data):
        action = data.get('action')
        errors = []
        for i in qs:
            if action == 'activate':
                i.is_active=True
                i.save()
            elif action == 'deactivate':
                i.is_active = False
                i.save()

        if not errors:
            return Response(status=200)
        else:
            return Response(status=400, data=dict())


class EventsCpViewSet(CpViewSet):
    path = 'event-announcements'
    model = Event
    queryset = Event.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = EventsDetailSerializer
    list_serializer_class = EventsListSerializer
    filter_class = EventsFilter
    ordering_fields = ('id', 'title', 'place', 'start_event_date', 'publication_date', 'edit_date', 'create_date')

    def activate_action(self, qs, data):
        action = data.get('action')
        errors = []
        for i in qs:
            if action == 'activate':
                i.is_active=True
                i.save()
            elif action == 'deactivate':
                i.is_active = False
                i.save()

        if not errors:
            return Response(status=200)
        else:
            return Response(status=400, data=dict())


class ReportsCpViewSet(CpViewSet):
    path = 'reports'
    model = Report
    queryset = Report.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = ReportsDetailSerializer
    list_serializer_class = ReportsListSerializer
    filter_class = ReportsFilter
    ordering_fields = ('id', 'title', 'place', 'start_event_date', 'publications_date', 'edit_date', 'create_date')

    def activate_action(self, qs, data):
        action = data.get('action')
        errors = []
        for i in qs:
            if action == 'activate':
                i.is_active=True
                i.save()
            elif action == 'deactivate':
                i.is_active = False
                i.save()

        if not errors:
            return Response(status=200)
        else:
            return Response(status=400, data=dict())


class HistoryRubricCpViewSet(CpViewSet):
    path = 'history-rubrics'
    model = HistoryRubric
    queryset = HistoryRubric.objects.all()
    available_actions = dict(delete='Удаление')
    serializer_class = HistoryRubricDetailSerializer
    list_serializer_class = HistoryRubricListSerializer
    filter_class = HistoryRubricFilter
    ordering_fields = ('id', 'name', 'edit_date', 'create_date')


class HistoryCpViewSet(CpViewSet):
    path = 'history'
    model = History
    queryset = History.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = HistoryDetailSerializer
    list_serializer_class = HistoryListSerializer
    filter_class = HistoryFilter
    ordering_fields = ('id', 'title', 'publications_date', 'edit_date', 'create_date')

    def activate_action(self, qs, data):
        action = data.get('action')
        errors = []
        for i in qs:
            if action == 'activate':
                i.is_active=True
                i.save()
            elif action == 'deactivate':
                i.is_active = False
                i.save()

        if not errors:
            return Response(status=200)
        else:
            return Response(status=400, data=dict())


class PersonsCpViewSet(CpViewSet):
    path = 'persons'
    model = Person
    queryset = Person.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = PersonsDetailSerializer
    list_serializer_class = PersonsListSerializer
    filter_class = PersonsFilter
    ordering_fields = ('id', 'title', 'publications_date', 'edit_date', 'create_date')

    def activate_action(self, qs, data):
        action = data.get('action')
        errors = []
        for i in qs:
            if action == 'activate':
                i.is_active=True
                i.save()
            elif action == 'deactivate':
                i.is_active = False
                i.save()

        if not errors:
            return Response(status=200)
        else:
            return Response(status=400, data=dict())


class CityGuidesCpViewSet(CpViewSet):
    path = 'city-guides'
    model = CityGuide
    queryset = CityGuide.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = CityGuidesDetailSerializer
    list_serializer_class = CityGuidesListSerializer
    filter_class = CityGuidesFilter
    ordering_fields = ('id', 'title', 'edit_date', 'create_date')


class PlacesCpViewSet(CpViewSet):
    path = 'places'
    model = Place
    queryset = Place.objects.all().annotate(reviews_count=Count('reviews'))
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = PlacesDetailSerializer
    list_serializer_class = PlacesListSerializer
    filter_class = PlacesFilter
    ordering_fields = ('id', 'title', 'address', 'reviews_count', 'publications_date', 'edit_date', 'create_date')

    def activate_action(self, qs, data):
        action = data.get('action')
        errors = []
        for i in qs:
            if action == 'activate':
                i.is_active=True
                i.save()
            elif action == 'deactivate':
                i.is_active = False
                i.save()

        if not errors:
            return Response(status=200)
        else:
            return Response(status=400, data=dict())


class SpecialsCpViewSet(CpViewSet):
    path = 'specials'
    model = Special
    queryset = Special.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = SpecialsDetailSerializer
    list_serializer_class = SpecialsListSerializer
    filter_class = SpecialsFilter
    ordering_fields = ('id', 'title', 'publications_date', 'edit_date', 'create_date')


class FilmsCpViewSet(CpViewSet):
    path = 'films'
    model = Film
    queryset = Film.objects.all().prefetch_related('sessions')
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = FilmsDetailSerializer
    list_serializer_class = FilmsListSerializer
    filter_class = FilmsFilter
    ordering_fields = ('id', 'title', 'edit_date', 'create_date')


class SidebarBannerCpViewSet(CpViewSet):
    path = 'sidebar-banners'
    model = SidebarBanner
    queryset = SidebarBanner.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = SidebarBannerSerializer
    filter_class = SidebarBannersFilter
    ordering_fields = ('id', 'title', 'start_publication_date', 'end_publication_date', 'edit_date', 'create_date')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        obj = deepcopy(instance)
        self.perform_destroy(instance)
        self.write_log('delete', request.user, obj)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete_action(self, qs, data):
        qs.delete()
        return Response(status=200)


class WideBannerCpViewSet(CpViewSet):
    path = 'wide-banners'
    model = WideBanner
    queryset = WideBanner.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = WideBannerSerializer
    filter_class = WideBannersFilter
    ordering_fields = ('id', 'title', 'start_publication_date', 'end_publication_date', 'edit_date', 'create_date')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        obj = deepcopy(instance)
        self.perform_destroy(instance)
        self.write_log('delete', request.user, obj)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete_action(self, qs, data):
        qs.delete()
        return Response(status=200)


class PlaceReviewsCpViewSet(CpViewSet):
    path = 'reviews'
    model = PlaceReview
    queryset = PlaceReview.objects.all().annotate(title=F('place__title'))
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = PlaceReviewsDetailSerializer
    list_serializer_class = PlaceReviewsListSerializer
    filter_class = PlaceReviewsFilter
    ordering_fields = ('id', 'title', 'name', 'email', 'phone', 'create_date', 'edit_date')


class SlidersCpViewSet(CpViewSet):
    path = 'sliders'
    model = Slider
    queryset = Slider.objects.all().annotate(slides_count=Count('slides'))
    available_actions = dict(delete='Удаление')
    serializer_class = SlidersDetailSerializer
    list_serializer_class = SlidersListSerializer
    filter_class = SlidersFilter
    ordering_fields = ('id', 'title', 'slides_count', 'create_date', 'edit_date')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        obj = deepcopy(instance)
        self.perform_destroy(instance)
        self.write_log('delete', request.user, obj)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete_action(self, qs, data):
        qs.delete()
        return Response(status=200)


class FeedbackCpViewSet(CpViewSet):
    path = 'feedbacks'
    model = Feedback
    queryset = Feedback.objects.all().prefetch_related('attachments')
    available_actions = dict()
    serializer_class = FeedbackDetailSerializer
    list_serializer_class = FeedbackListSerializer
    filter_class = FeedbackFilter
    ordering_fields = ('id', 'name', 'email', 'phone', 'attachment', 'create_date')
    list_http_method_names = ['get', 'head', 'options', 'trace']
    detail_http_method_names = ['get', 'head', 'options', 'trace']


class TextErrorCpViewSet(CpViewSet):
    path = 'text-errors'
    model = TextError
    queryset = TextError.objects.all()
    available_actions = dict()
    serializer_class = TextErrorDetailSerializer
    list_serializer_class = TextErrorListSerializer
    filter_class = TextErrorFilter
    ordering_fields = ('id', 'url', 'create_date')
    list_http_method_names = ['get', 'head', 'options', 'trace']
    detail_http_method_names = ['get', 'head', 'options', 'trace']


class CompilationCpViewSet(CpViewSet):
    path = 'compilations'
    model = Compilation
    queryset = Compilation.objects.all().annotate(items_amount=Count('items'))
    available_actions = dict(activate='Активация и Деактивация',
                             delete='Удаление')
    serializer_class = CompilationDetailSerializer
    select_serializer_class = CompilationSelectSerializer
    list_serializer_class = CompilationListSerializer
    filter_class = CompilationFilter
    ordering_fields = ('id', 'name', 'items_amount', 'edit_date', 'create_date')


cp_api.register(CompilationCpViewSet)
cp_api.register(NewsCpViewSet)
cp_api.register(EventsCpViewSet)
cp_api.register(ReportsCpViewSet)
cp_api.register(HistoryRubricCpViewSet)
cp_api.register(HistoryCpViewSet)
cp_api.register(PersonsCpViewSet)
cp_api.register(CityGuidesCpViewSet)
cp_api.register(PlacesCpViewSet)
cp_api.register(SpecialsCpViewSet)
cp_api.register(FilmsCpViewSet)
cp_api.register(SidebarBannerCpViewSet)
cp_api.register(WideBannerCpViewSet)
cp_api.register(PlaceReviewsCpViewSet)
cp_api.register(SlidersCpViewSet)
cp_api.register(FeedbackCpViewSet)
cp_api.register(TextErrorCpViewSet)
