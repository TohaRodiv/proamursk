# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.conf.urls import url
from django.db.models import Count
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from cp_vue.api.permissions import SapPermissions
from cp_vue.api.views import CpViewSet
from cp_vue.api.core import cp_api
from .serializers import NewsListSerializer, NewsDetailSerializer, EventsListSerializer, EventsDetailSerializer, \
    ReportsDetailSerializer, ReportsListSerializer, HistoryDetailSerializer, HistoryListSerializer, \
    PersonsDetailSerializer, PersonsListSerializer, CityGuidesDetailSerializer, CityGuidesListSerializer, \
    PlacesDetailSerializer, PlacesListSerializer, SpecialsDetailSerializer, SpecialsListSerializer
from .filters import NewsFilter, EventsFilter, ReportsFilter, HistoryFilter, PersonsFilter, CityGuidesFilter, \
    PlacesFilter, SpecialsFilter
from ..models import News, Event, Report, History, Person, Place, CityGuide, Special

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


class EventsCpViewSet(CpViewSet):
    path = 'events'
    model = Event
    queryset = Event.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = EventsDetailSerializer
    list_serializer_class = EventsListSerializer
    filter_class = EventsFilter
    ordering_fields = ('id', 'title', 'place', 'start_event_date', 'publications_date', 'edit_date', 'create_date')


class ReportsCpViewSet(CpViewSet):
    path = 'reports'
    model = Report
    queryset = Report.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = ReportsDetailSerializer
    list_serializer_class = ReportsListSerializer
    filter_class = ReportsFilter
    ordering_fields = ('id', 'title', 'place', 'start_event_date', 'publications_date', 'edit_date', 'create_date')


class HistoryCpViewSet(CpViewSet):
    path = 'history'
    model = History
    queryset = History.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = HistoryDetailSerializer
    list_serializer_class = HistoryListSerializer
    filter_class = HistoryFilter
    ordering_fields = ('id', 'title', 'publications_date', 'edit_date', 'create_date')


class PersonsCpViewSet(CpViewSet):
    path = 'persons'
    model = Person
    queryset = Person.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = PersonsDetailSerializer
    list_serializer_class = PersonsListSerializer
    filter_class = PersonsFilter
    ordering_fields = ('id', 'title', 'publications_date', 'edit_date', 'create_date')


class CityGuidesCpViewSet(CpViewSet):
    path = 'city-guides'
    model = CityGuide
    queryset = CityGuide.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = CityGuidesDetailSerializer
    list_serializer_class = CityGuidesListSerializer
    filter_class = CityGuidesFilter
    ordering_fields = ('id', 'title', 'publications_date', 'edit_date', 'create_date')


class PlacesCpViewSet(CpViewSet):
    path = 'places'
    model = Place
    queryset = Place.objects.all().annotate(reviews_count=Count('reviews'))
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = PlacesDetailSerializer
    list_serializer_class = PlacesListSerializer
    filter_class = PlacesFilter
    ordering_fields = ('id', 'title', 'address', 'reviews_count', 'publications_date', 'edit_date', 'create_date')


class SpecialsCpViewSet(CpViewSet):
    path = 'specials'
    model = Special
    queryset = Special.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = SpecialsDetailSerializer
    list_serializer_class = SpecialsListSerializer
    filter_class = SpecialsFilter
    ordering_fields = ('id', 'title', 'publications_date', 'edit_date', 'create_date')


cp_api.register(NewsCpViewSet)
cp_api.register(EventsCpViewSet)
cp_api.register(ReportsCpViewSet)
cp_api.register(HistoryCpViewSet)
cp_api.register(PersonsCpViewSet)
cp_api.register(CityGuidesCpViewSet)
cp_api.register(PlacesCpViewSet)
cp_api.register(SpecialsCpViewSet)

