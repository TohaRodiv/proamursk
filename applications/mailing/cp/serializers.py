# -*-coding: utf-8 -*-

from cp_vue.api.fields import ObjectRelatedField
from cp_vue.api.serializers import ModelSerializer
from ..models import Subscriber, MailingGroup, Campaign


class NestedGroupSerializer(ModelSerializer):
    class Meta:
        model = MailingGroup
        fields = 'id', 'name'


class NestedSubscriberSerializer(ModelSerializer):
    class Meta:
        model = Subscriber
        fields = 'id', 'email'


class SubscribersListSerializer(ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ('id', 'email', 'mailerlite_id', 'comment', 'create_date', 'edit_date', 'is_active')


class SubscribersDetailSerializer(ModelSerializer):
    groups = ObjectRelatedField(queryset=MailingGroup.objects.all(), serializer_class=NestedGroupSerializer, many=True)

    class Meta:
        model = Subscriber
        fields = ('id', 'email', 'mailerlite_id', 'groups', 'comment', 'create_date', 'edit_date', 'is_active')


class MailingGroupListSerializer(ModelSerializer):
    class Meta:
        model = MailingGroup
        fields = ('id', 'name', 'mailerlite_id', 'comment', 'create_date', 'edit_date', 'is_active')
        read_only_fields = 'is_active',


class MailingGroupDetailSerializer(ModelSerializer):
    subscribers = ObjectRelatedField(queryset=Subscriber.objects.all(), serializer_class=NestedSubscriberSerializer,
                                     many=True)
    class Meta:
        model = MailingGroup
        fields = ('id', 'name', 'mailerlite_id', 'subscribers', 'comment', 'create_date', 'edit_date', 'is_active')
        read_only_fields = 'is_active',


class CampaignListSerializer(ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'name', 'mailerlite_id', 'comment', 'create_date', 'edit_date', 'is_active')
        read_only_fields = 'is_active',


class CampaignDetailSerializer(ModelSerializer):
    subscribers = ObjectRelatedField(queryset=Subscriber.objects.all(), serializer_class=NestedSubscriberSerializer,
                                     many=True)
    groups = ObjectRelatedField(queryset=MailingGroup.objects.all(), serializer_class=NestedGroupSerializer, many=True)

    class Meta:
        model = Campaign
        fields = ('id', 'name', 'subject', 'content', 'mailerlite_id', 'subscribers', 'groups', 'comment',
                  'send_date', 'create_date', 'edit_date', 'is_active')
        read_only_fields = 'is_active',

