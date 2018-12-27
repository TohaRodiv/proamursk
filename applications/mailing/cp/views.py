# -*- coding: utf-8 -*-

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.conf.urls import url
from django.db.models import Count, F
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from applications.mailing.mailer import MailerApi
from cp_vue.api.permissions import SapPermissions
from cp_vue.api.views import CpViewSet
from cp_vue.api.core import cp_api
from .serializers import (SubscribersListSerializer, SubscribersDetailSerializer, MailingGroupListSerializer,
                          MailingGroupDetailSerializer, CampaignListSerializer, CampaignDetailSerializer)
from .filters import SubscribersFilter, MailingGroupsFilter, CampaignsFilter
from ..models import Subscriber, MailingGroup, Campaign


class SubscriberCpViewSet(CpViewSet):
    path = 'subscribers'
    model = Subscriber
    queryset = Subscriber.objects.all()
    available_actions = dict(activate='Активация и Деактивация')
    serializer_class = SubscribersListSerializer
    list_serializer_class = SubscribersListSerializer
    filter_class = SubscribersFilter
    ordering_fields = ('id', 'email', 'mailerlite_id', 'edit_date', 'create_date')

    def activate_action(self, qs, data):
        api = MailerApi()
        action = data.get('action')
        errors = []
        if action == 'activate':
            qs.update(is_active=True)
            api.activate_subscribers(qs)
        elif action == 'deactivate':
            qs.update(is_active=False)
            api.deactivate_subscribers(qs)
        if not errors:
            return Response(status=200)
        else:
            return Response(status=400, data=dict())


class MailingGroupCpViewSet(CpViewSet):
    path = 'mailing-groups'
    model = MailingGroup
    queryset = MailingGroup.objects.all()
    available_actions = dict(delete='Удаление')
    serializer_class = MailingGroupDetailSerializer
    list_serializer_class = MailingGroupListSerializer
    filter_class = MailingGroupsFilter
    ordering_fields = ('id', 'name', 'mailerlite_id', 'edit_date', 'create_date')


class CampaignsCpViewSet(CpViewSet):
    path = 'campaigns'
    model = Campaign
    queryset = Campaign.objects.all()
    available_actions = dict(delete='Удаление')
    serializer_class = CampaignDetailSerializer
    list_serializer_class = CampaignListSerializer
    filter_class = CampaignsFilter
    ordering_fields = ('id', 'name', 'mailerlite_id', 'edit_date', 'create_date')


cp_api.register(SubscriberCpViewSet)
cp_api.register(MailingGroupCpViewSet)
cp_api.register(CampaignsCpViewSet)
