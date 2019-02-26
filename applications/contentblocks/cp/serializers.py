# -*-coding: utf-8 -*-

import copy
import json
from django.db import transaction
from django.core.exceptions import ObjectDoesNotExist
from django.urls import reverse
from rest_framework import serializers
from applications.mediafiles.cp.serializers import ImageNestedSerializer
from cp_vue.api.serializers import ModelSerializer
from cp_vue.api.fields import ObjectRelatedField
from applications.mediafiles.models import MediaFile
from applications.root.models import TopItem
from applications.root.cp.serializers import (EventsListSerializer, ReportsListSerializer, PersonsListSerializer,
                                              HistoryListSerializer, CityGuidesListSerializer, PlacesListSerializer,
                                              SpecialsListSerializer)
from ..models import Page, ContentBlock


class TopItemSerializer(ModelSerializer):
    item = serializers.SerializerMethodField()
    entity = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = TopItem
        fields = ('id', 'entity', 'object_id', 'weight', 'item')

    def get_item(self, instance):
        obj = instance.get_object()
        slz = self.get_item_serializer(instance.entity)
        data = slz(obj).data
        return data

    def get_item_serializer(self, codename):
        slz = {
            "event-announcements": EventsListSerializer,
            "reports": ReportsListSerializer,
            "persons": PersonsListSerializer,
            "history": HistoryListSerializer,
            "city-guides": CityGuidesListSerializer,
            "places": PlacesListSerializer,
            "specials": SpecialsListSerializer
        }

        return slz.get(codename)


class ContentBlockSerializer(ModelSerializer):
    class Meta:
        model = ContentBlock
        fields = ('id', 'codename', 'data_type')


class PageNestedSerializer(ModelSerializer):

    class Meta:
        model = Page
        fields = ('id', 'name', 'codename', )


class PageSettingListSerializer(ModelSerializer):
    link = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ('id', 'name', 'codename', 'link', 'create_date', 'edit_date')

    def get_link(self, instance):
        try:
            return reverse(instance.codename)
        except:
            return ''


class PageSettingDetailSerializer(ModelSerializer):

    WIDGET_DATA_TYPES = dict(
        textarea='text',
        singleImageLoader='mediafile',
        formatter='text',
        singleCheckbox='bool',
        simpleInput=dict(
            field='string'
        )
    )

    class Meta:
        model = Page
        fields = ('id', 'name', 'codename', 'admin_form_config', 'create_date', 'edit_date')

    def gen_blocks_data(self, instance):
        blocks_data = []
        try:
            config = json.loads(instance.admin_form_config)
        except Exception as e:
            pass
        else:
            if config:
                for tab in config:
                    blocks = tab.get('blocks', [])
                    if isinstance(blocks, list):
                        for block in blocks:
                            elements = block.get('elements', [])
                            if isinstance(elements, list):
                                for item in elements:
                                    widget = item.get('widget')
                                    codename = item.get('codename')
                                    if codename not in [f.name for f in Page._meta.get_fields()]:
                                        if widget == 'simpleInput':
                                            widget_type = item.get('type')
                                            data_type = self.WIDGET_DATA_TYPES.get(widget, dict()).get(widget_type)
                                        else:
                                            data_type = self.WIDGET_DATA_TYPES.get(widget)

                                        if data_type and codename:
                                            blocks_data.append(dict(data_type=data_type, codename=codename))

        return blocks_data

    def create(self, validated_data):
        instance = super(PageSettingDetailSerializer, self).create(validated_data)
        if instance.admin_form_config:
            blocks_data = self.gen_blocks_data(instance)
            self.create_child_objects(blocks_data, ContentBlock, dict(page=instance))
        return instance

    def update(self, instance, validated_data):
        instance = super(PageSettingDetailSerializer, self).update(instance, validated_data)
        if instance.admin_form_config:
            blocks_data = self.gen_blocks_data(instance)
            parent_param = dict(page=instance)
            current_items = [c.codename for c in ContentBlock.objects.filter(**parent_param)]
            data_ids = [c.get('codename') for c in blocks_data]
            for_delete = [c for c in current_items if c not in data_ids]
            ContentBlock.objects.filter(codename__in=for_delete, **parent_param).delete()
            for item_data in blocks_data:
                if item_data:
                    item_data = copy.deepcopy(item_data)
                    codename = item_data.get('codename')
                    try:
                        item_instance = ContentBlock.objects.get(codename=codename, **parent_param)
                    except ObjectDoesNotExist:
                        item_data.update(parent_param)
                        ContentBlock.objects.create(**item_data)
                    except Exception as e:
                        raise e
                    else:
                        for k, v in item_data.items():
                            setattr(item_instance, k, v)
                        item_instance.save()

        return instance


class StaticPagesListSerializer(ModelSerializer):
    link = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ('id', 'name', 'link', 'create_date', 'edit_date')

    def get_link(self, instance):
        try:
            return reverse(instance.codename)
        except:
            return ''


class StaticPagesDetailSerializer(ModelSerializer):
    FIELD_CLASSES = {
        'text': serializers.CharField,
        'string': serializers.CharField,
        'url': serializers.CharField,
        'mediafile': ObjectRelatedField,
        'bool': serializers.BooleanField,
    }

    og_image = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                  required=False, allow_null=True)

    top_items = TopItemSerializer(many=True, required=False)

    class Meta:
        model = Page
        fields = ('id', 'name', 'meta_title', 'meta_description', 'meta_keywords',
                  'og_image', 'create_date', 'edit_date', 'top_items', 'codename')
        read_only_fields = ('id', 'name', 'codename', 'create_date', 'edit_date')

    def validate_top_items(self, data):
        if self.instance.pk and self.instance.codename in ['index', 'events-index', 'reports-list', 'history-list',
                                                           'persons-list', 'places-list']:
            if len(data) < 4:
                raise serializers.ValidationError("Необходимо выбрать 4 записи")

        return data

    def __init__(self, *args, **kwargs):
        super(StaticPagesDetailSerializer, self).__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            fields = self.instance.get_available_fields()
            self._build_dynamic_fields(fields)

    def _build_dynamic_fields(self, fields):

        for field in fields:
            data_type = field.data_type

            defaults = {
                'required':  False,
            }

            if data_type in ['string', 'text', 'url']:
                defaults['allow_blank'] = True

            elif data_type == 'mediafile':
                defaults.update({'queryset': MediaFile.objects.all(), 'serializer_class': ImageNestedSerializer})

            MappedField = self.FIELD_CLASSES[data_type]
            self.fields[field.codename] = MappedField(**defaults)

    def update(self, instance, validated_data):
        top_items = validated_data.pop('top_items') if 'top_items' in validated_data else []

        if self.instance.pk and self.instance.codename in ['reports-list', 'history-list', 'persons-list', 'places-list']:
            for i in top_items:
                if self.instance.codename == 'reports-list':
                    i['entity'] = 'reports'
                elif self.instance.codename == 'history-list':
                    i['entity'] = 'history'
                elif self.instance.codename == 'persons-list':
                    i['entity'] = 'persons'
                elif self.instance.codename == 'places-list':
                    i['entity'] = 'places'

        fields = self.instance.get_available_fields()
        with transaction.atomic():
            for f in fields:
                if f.codename in validated_data:
                    f.content = validated_data.pop(f.codename)
                    f.save()

            instance = super(StaticPagesDetailSerializer, self).update(instance, validated_data)
            self.update_child_objects(top_items, TopItem, dict(page=instance))

        return instance
