# -*- coding: utf-8 -*-
from copy import deepcopy

from rest_framework import status
from rest_framework.response import Response

from applications.mailing.tasks import update_subscribers, create_subscriber
from cp_vue.api.core import cp_api
from cp_vue.api.views import CpViewSet
from .filters import SubscribersFilter
from .serializers import SubscribersSerializer
from ..models import Subscriber


class SubscriberCpViewSet(CpViewSet):
    path = 'subscribers'
    model = Subscriber
    queryset = Subscriber.objects.all()
    available_actions = dict(activate='Активация и Деактивация')
    serializer_class = SubscribersSerializer
    filter_class = SubscribersFilter
    ordering_fields = ('id', 'email', 'mailerlite_id', 'edit_date', 'create_date')
    detail_http_method_names = ['get', 'put', 'patch', 'head', 'options', 'trace']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        self.write_log('add', request.user, serializer.instance)
        create_subscriber.delay(serializer.instance.id)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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


cp_api.register(SubscriberCpViewSet)
