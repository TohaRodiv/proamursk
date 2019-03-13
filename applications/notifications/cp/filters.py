# -*- coding: utf-8 -*-

from ..models import Variable, Action, Recipient, Channel, HtmlTemplate, Notifications
from cp_vue.api.filters import NumberInFilter, CharInFilter, SearchFilter
from cp_vue.api.filterset import APIFilterSet
from django_filters import rest_framework as filters


class ActionFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'codename', 'comment'])
    instant_search = filters.CharFilter(field_name="name", lookup_expr="icontains")
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = Action
        fields = {
            'edit_date': ['gte', 'lte'],
            'create_date': ['gte', 'lte'],
        }


class RecipientFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'phone', 'email', 'comment'])
    instant_search = filters.CharFilter(field_name="name", lookup_expr="icontains")
    channel_id__in = NumberInFilter(field_name='channel', lookup_expr='in')
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = Recipient
        fields = {
            'edit_date': ['gte', 'lte'],
            'create_date': ['gte', 'lte'],
        }


class ChannelFilter(APIFilterSet):
    instant_search = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = Channel
        exclude = ()


class HtmlTemplateFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'comment'])
    instant_search = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = HtmlTemplate
        fields = {
            'edit_date': ['gte', 'lte'],
            'create_date': ['gte', 'lte'],
        }


class NotificationsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'comment'])
    instant_search = filters.CharFilter(field_name="name", lookup_expr="icontains")
    action_id__in = NumberInFilter(field_name='action', lookup_expr='in')
    channel_id__in = NumberInFilter(field_name='channel', lookup_expr='in')
    users_id__in = NumberInFilter(field_name='users', lookup_expr='in')
    roles_id__in = NumberInFilter(field_name='roles', lookup_expr='in')
    recipients_id__in = NumberInFilter(field_name='recipients', lookup_expr='in')
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = Notifications
        fields = {
            'edit_date': ['gte', 'lte'],
            'create_date': ['gte', 'lte'],
        }