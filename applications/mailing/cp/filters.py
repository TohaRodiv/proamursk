# -*- coding: utf-8 -*-

from ..models import Subscriber
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

