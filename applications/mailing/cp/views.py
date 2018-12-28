# -*- coding: utf-8 -*-
from copy import deepcopy

from rest_framework import status
from rest_framework.response import Response

from applications.mailing.tasks import (update_subscribers, create_group, update_group, delete_groups)
from cp_vue.api.core import cp_api
from cp_vue.api.views import CpViewSet
from .filters import SubscribersFilter, MailingGroupsFilter, CampaignsFilter
from .serializers import (SubscribersListSerializer, MailingGroupListSerializer, MailingGroupDetailSerializer,
                          CampaignListSerializer, CampaignDetailSerializer)
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
        action = data.get('action')
        errors = []
        subscriber_ids = [subscriber.id for subscriber in qs]
        if action == 'activate':
            qs.update(is_active=True)
            update_subscribers.delay(subscriber_ids)
        elif action == 'deactivate':
            qs.update(is_active=False)
            update_subscribers.delay(subscriber_ids)
        if not errors:
            return Response(status=200)
        else:
            return Response(status=400, data=dict())

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        self.write_log('change', request.user, serializer.instance)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        data = serializer.data
        update_subscribers.delay([instance.id])
        data['object_permissions'] = self.get_object_permissions(request, instance)
        return Response(data)


class MailingGroupCpViewSet(CpViewSet):
    path = 'mailing-groups'
    model = MailingGroup
    queryset = MailingGroup.objects.all()
    available_actions = dict(delete='Удаление')
    serializer_class = MailingGroupDetailSerializer
    list_serializer_class = MailingGroupListSerializer
    filter_class = MailingGroupsFilter
    ordering_fields = ('id', 'name', 'mailerlite_id', 'edit_date', 'create_date')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        subscribers = serializer.data.get('subscribers')
        if subscribers:
            create_group.delay(serializer.instance.id)
        self.write_log('add', request.user, serializer.instance)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        obj = deepcopy(instance)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        self.write_log('change', request.user, serializer.instance)
        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}
        data = serializer.data
        data['object_permissions'] = self.get_object_permissions(request, instance)
        name_changed = obj.name != instance.name
        subscribers_changed = obj.subscribers.all() != instance.subscribers.all()
        if name_changed or subscribers_changed:
            update_group.delay(instance.id, name_changed, subscribers_changed)
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        obj = deepcopy(instance)
        delete_groups.delay([instance.mailerlite_id])
        self.perform_destroy(instance)
        self.write_log('delete', request.user, obj)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def delete_action(self, qs, data):
        group_mailerlite_ids = list(qs.filter(mailerlite_id__isnull=False).values_list('mailerlite_id', flat=True))
        delete_groups.delay(group_mailerlite_ids)
        qs.delete()
        return Response(status=200)


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
