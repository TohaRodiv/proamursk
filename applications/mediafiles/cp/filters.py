# -*- coding: utf-8 -*-

from ..models import MediaFile
from cp_vue.api.filters import NumberInFilter, CharInFilter, SearchFilter
from cp_vue.api.filterset import APIFilterSet
from django_filters import rest_framework as filters


class ImageFilter(APIFilterSet):
    q = SearchFilter(search_fields=['name',])
    instant_search = filters.CharFilter(field_name="name", lookup_expr="icontains")
    tags_id__in = NumberInFilter(field_name='tags', lookup_expr='in')
    extension_id__in = NumberInFilter(field_name='extension', lookup_expr='in')

    class Meta:
        model = MediaFile
        fields = {
            'width': ['gte', 'lte'],
            'height': ['gte', 'lte'],
            'file_size': ['gte', 'lte'],
            'create_date': ['gte', 'lte'],
        }

