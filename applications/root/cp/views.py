# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.conf.urls import url
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from cp_vue.api.permissions import SapPermissions
from cp_vue.api.views import CpViewSet
from cp_vue.api.core import cp_api
from .serializers import NewsListSerializer, NewsDetailSerializer, EventsListSerializer, EventsDetailSerializer
from .filters import NewsFilter, EventsFilter
from ..models import News, Event

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


cp_api.register(NewsCpViewSet)
cp_api.register(EventsCpViewSet)