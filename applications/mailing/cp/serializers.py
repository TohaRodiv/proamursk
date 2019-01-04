# -*-coding: utf-8 -*-
from cp_vue.api.serializers import ModelSerializer
from ..models import Subscriber


class SubscribersSerializer(ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ('id', 'email', 'mailerlite_id', 'sync_date', 'comment', 'create_date', 'edit_date', 'is_active')
        read_only_fields = 'mailerlite_id', 'sync_date'

