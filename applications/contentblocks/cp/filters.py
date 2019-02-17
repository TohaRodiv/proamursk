# -*- coding: utf-8 -*-

from ..models import Page
from cp_vue.api.filters import NumberInFilter, CharInFilter, SearchFilter
from cp_vue.api.filterset import APIFilterSet
from django_filters import rest_framework as filters


class PageFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name', 'codename'])
    instant_search = filters.CharFilter(field_name="name", lookup_expr="icontains")
    codename__in = CharInFilter(field_name='codename', lookup_expr='in')

    class Meta:
        model = Page
        fields = {
            'edit_date': ['gte', 'lte'],
            'create_date': ['gte', 'lte'],
        }
