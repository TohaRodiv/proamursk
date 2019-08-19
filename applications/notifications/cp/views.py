
from __future__ import unicode_literals

from cp_vue.api.core import cp_api
from cp_vue.api.views import CpViewSet

from cp_vue.api.permissions import SapPermissions
from .serializers import (VariableDetailSerializer, ActionListSerializer, ActionDetailSerializer,
                          RecipientListSerializer, RecipientDetailSerializer, ChannelSerializer,
                          HtmlTemplateListSerializer, HtmlTemplateDetailSerializer, NotificationsListSerializer,
                          NotificationsDetailSerializer)
from .filters import (ActionFilter, RecipientFilter, ChannelFilter, HtmlTemplateFilter,
                      NotificationsFilter, VariableFilter)
from ..models import Variable, Action, Recipient, Channel, HtmlTemplate, Notifications


class ActionCpViewSet(CpViewSet):
    path = 'actions'
    model = Action
    available_actions = dict(delete='Удаление', activate='Активация и Деактивация')
    list_serializer_class = ActionListSerializer
    serializer_class = ActionDetailSerializer
    queryset = Action.objects.all().prefetch_related('variables').order_by('name')
    filter_class = ActionFilter
    ordering_fields = ('id', 'name', 'codename', 'is_active', 'create_date', 'edit_date')


class VariableCpViewSet(CpViewSet):
    path = 'variables'
    model = Variable
    available_actions = dict()
    list_serializer_class = VariableDetailSerializer
    serializer_class = VariableDetailSerializer
    queryset = Variable.objects.all().order_by('action__id')
    permission_classes = (SapPermissions,)
    filter_class = VariableFilter
    ordering_fields = ('id', 'name', 'codename')


class RecipientCpViewSet(CpViewSet):
    path = 'recipients'
    model = Recipient
    available_actions = dict(delete='Удаление', activate='Активация и Деактивация')
    list_serializer_class = RecipientListSerializer
    serializer_class = RecipientDetailSerializer
    queryset = Recipient.objects.all().order_by('name')
    filter_class = RecipientFilter
    ordering_fields = ('id', 'name', 'is_active', 'create_date', 'edit_date')


class ChannelCpViewSet(CpViewSet):
    path = 'channels'
    model = Channel
    serializer_class = ChannelSerializer
    queryset = Channel.objects.all().order_by('name')
    filter_class = ChannelFilter
    ordering_fields = ('id', 'name', 'codename', 'create_date', 'edit_date')


class HtmlTemplateCpViewSet(CpViewSet):
    path = 'html-templates'
    model = HtmlTemplate
    list_serializer_class = HtmlTemplateListSerializer
    serializer_class = HtmlTemplateDetailSerializer
    queryset = HtmlTemplate.objects.all().order_by('name')
    filter_class = HtmlTemplateFilter
    ordering_fields = ('id', 'name', 'create_date', 'edit_date')


class NotificationsCpViewSet(CpViewSet):
    path = 'notification-templates'
    model = Notifications
    available_actions = dict(delete='Удаление', activate='Активация и Деактивация')
    list_serializer_class = NotificationsListSerializer
    serializer_class = NotificationsDetailSerializer
    queryset = Notifications.objects.all().order_by('name')
    filter_class = NotificationsFilter
    ordering_fields = ('id', 'name', 'action__name', 'create_date', 'edit_date')


cp_api.register(ActionCpViewSet)
cp_api.register(RecipientCpViewSet)
cp_api.register(ChannelCpViewSet)
cp_api.register(HtmlTemplateCpViewSet)
cp_api.register(NotificationsCpViewSet)
cp_api.register(VariableCpViewSet)

