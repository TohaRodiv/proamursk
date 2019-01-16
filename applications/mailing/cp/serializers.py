# -*-coding: utf-8 -*-
from cp_vue.api.serializers import ModelSerializer
from ..models import Subscriber, Campaign


class SubscribersSerializer(ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ('id', 'email', 'mailerlite_id', 'sync_date', 'comment', 'create_date', 'edit_date', 'is_active')
        read_only_fields = ('mailerlite_id', 'sync_date')


class CampaignListSerializer(ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'name', 'comment', 'create_date', 'edit_date')


class CampaignDetailSerializer(ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'name', 'content', 'comment', 'create_date', 'edit_date')

