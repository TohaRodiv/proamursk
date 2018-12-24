# -*-coding: utf-8 -*-

from rest_framework import serializers
from applications.accounts.cp.serializers import UserNestedSerializer
from cp_vue.api.serializers import ModelSerializer
from cp_vue.api.fields import ObjectRelatedField
from cp_vue.models import CpRole
from cp_vue.cp.serializers import CpRoleNestedSerializer
from applications.accounts.models import User
from ..models import Variable, Action, Recipient, Channel, HtmlTemplate, Notifications


class ChannelSerializer(ModelSerializer):

    class Meta:
        model = Channel
        fields = ('id', 'name', 'codename')


class VariableDetailSerializer(ModelSerializer):

    class Meta:
        model = Variable
        fields = ('id', 'name', 'codename', 'construction_type', 'content_type', 'comment', 'weight')

    def validate(self, attrs):
        construction_type = attrs.get('construction_type')
        content_type = attrs.get('content_type')

        if construction_type == 'var' and not content_type:
            raise serializers.ValidationError(dict(content_type=u'Заполните поле'))

        return attrs


class ActionListSerializer(ModelSerializer):

    class Meta:
        model = Action
        fields = ('id', 'name', 'codename', 'comment', 'is_active', 'create_date', 'edit_date')


class ActionNestedSerializer(ModelSerializer):

    class Meta:
        model = Action
        fields = ('id', 'name', 'codename')


class ActionDetailSerializer(ModelSerializer):

    variables = VariableDetailSerializer(many=True, required=False)

    class Meta:
        model = Action
        fields = ('id', 'name', 'codename', 'variables', 'comment', 'is_active', 'create_date', 'edit_date')

    def create(self, validated_data):
        variables_data = validated_data.pop('variables') if 'variables' in validated_data else []
        instance = super(ActionDetailSerializer, self).create(validated_data)
        self.create_child_objects(variables_data, Variable, dict(action=instance))
        return instance

    def update(self, instance, validated_data):
        variables_data = validated_data.pop('variables') if 'variables' in validated_data else []
        instance = super(ActionDetailSerializer, self).update(instance, validated_data)
        self.update_child_objects(variables_data, Variable, dict(action=instance))
        return instance


class RecipientListSerializer(ModelSerializer):
    channel_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Recipient
        fields = ('id', 'name', 'channel', 'channel_name', 'phone', 'email', 'is_active',
                  'comment', 'create_date', 'edit_date')

    def get_channel_name(self, instance):
        return instance.channel.name


class RecipientNestedSerializer(ModelSerializer):
    channel_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Recipient
        fields = ('id', 'name', 'channel', 'channel_name', 'phone', 'email')

    def get_channel_name(self, instance):
        return instance.channel.name


class RecipientDetailSerializer(ModelSerializer):
    channel = ObjectRelatedField(queryset=Channel.objects.all(), serializer_class=ChannelSerializer)

    class Meta:
        model = Recipient
        fields = ('id', 'name', 'channel', 'phone', 'email', 'comment', 'is_active', 'create_date', 'edit_date')


class HtmlTemplateListSerializer(ModelSerializer):

    class Meta:
        model = HtmlTemplate
        fields = ('id', 'name', 'comment', 'create_date', 'edit_date')


class HtmlTemplateDetailSerializer(ModelSerializer):

    class Meta:
        model = HtmlTemplate
        fields = ('id', 'name', 'text', 'comment', 'create_date', 'edit_date')


class NotificationsListSerializer(ModelSerializer):
    channel_name = serializers.SerializerMethodField(read_only=True)
    action_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Notifications
        fields = ('id', 'name', 'channel', 'channel_name', 'action', 'action_name',
                  'comment', 'is_active', 'create_date', 'edit_date')

    def get_channel_name(self, instance):
        return instance.channel.name

    def get_action_name(self, instance):
        return instance.action.name


class NotificationsDetailSerializer(ModelSerializer):
    channel = ObjectRelatedField(queryset=Channel.objects.all(), serializer_class=ChannelSerializer)
    action = ObjectRelatedField(queryset=Action.objects.all(), serializer_class=ActionNestedSerializer)
    users = ObjectRelatedField(queryset=User.objects.all(), serializer_class=UserNestedSerializer,
                               many=True, required=False)
    roles = ObjectRelatedField(queryset=CpRole.objects.all(), serializer_class=CpRoleNestedSerializer,
                               many=True, required=False)
    recipients = ObjectRelatedField(queryset=Recipient.objects.all(), serializer_class=RecipientNestedSerializer,
                               many=True, required=False)

    class Meta:
        model = Notifications
        fields = ('id', 'name', 'channel', 'action', 'recipients', 'roles', 'users', 'subject', 'text', 'comment',
                  'is_active', 'create_date', 'edit_date')