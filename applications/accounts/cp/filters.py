# -*- coding: utf-8 -*-

from ..models import User
from cp_vue.api.filters import NumberInFilter, CharInFilter
from cp_vue.api.filterset import APIFilterSet
from django_filters import rest_framework as filters


class UserFilter(APIFilterSet):
    instant_search = filters.CharFilter(field_name="username", lookup_expr="icontains")
    is_active = filters.BooleanFilter(field_name='is_active', method='common_filter')
    is_staff = filters.BooleanFilter(field_name='is_staff', method='common_filter')
    roles_id__in = NumberInFilter(field_name='roles__id', lookup_expr='in')

    class Meta:
        model = User
        fields = {
            'instant_search': 'instant_search',
            'create_date': ['gte', 'lte'],
            'edit_date': ['gte', 'lte'],
            'last_seen': ['gte', 'lte']
        }
