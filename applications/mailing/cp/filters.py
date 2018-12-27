# -*- coding: utf-8 -*-

from ..models import Subscriber, Campaign, MailingGroup
from cp_vue.api.filters import NumberInFilter, CharInFilter, SearchFilter
from cp_vue.api.filterset import APIFilterSet
from django_filters import rest_framework as filters


class SubscribersFilter(APIFilterSet):
    q = SearchFilter(search_fields=['email', 'mailerlite_id', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = Subscriber
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte']
        }


class MailingGroupsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'mailerlite_id', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = MailingGroup
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte']
        }


class CampaignsFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'mailerlite_id', 'comment'])
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')

    class Meta:
        model = Campaign
        fields = {
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte']
        }



