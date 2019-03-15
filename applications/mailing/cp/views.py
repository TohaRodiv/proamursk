# -*- coding: utf-8 -*-
from copy import deepcopy

from rest_framework import status
from rest_framework.response import Response
from django.template import Context, Template
from django.template.loader import get_template
from django.utils.safestring import mark_safe
from django.utils.text import normalize_newlines
from django.core import mail
from django.core.mail import EmailMessage
from django.conf.urls import url
from django.conf import settings
from cp_vue.api.core import cp_api
from cp_vue.api.views import CpViewSet
from .filters import SubscribersFilter, CampaignsFilter
from .serializers import (SubscribersSerializer, CampaignDetailSerializer, CampaignListSerializer, PreviewSerializer,
                          SendEmailSerializer)
from ..models import Subscriber, Campaign
try:
    from ..tasks import update_subscribers, create_subscriber, send_email
except:
    pass


class SubscriberCpViewSet(CpViewSet):
    path = 'subscribers'
    model = Subscriber
    queryset = Subscriber.objects.all()
    available_actions = dict(activate='Активация и Деактивация')
    serializer_class = SubscribersSerializer
    filter_class = SubscribersFilter
    ordering_fields = ('id', 'email', 'mailerlite_id', 'edit_date', 'create_date')
    detail_http_method_names = ['get', 'put', 'patch', 'head', 'options', 'trace']

    def create(self, request, *args, **kwargs):
        response = super(SubscriberCpViewSet, self).create(request, *args, **kwargs)
        if response.status_code == 201:
            serializer = self.get_serializer(data=request.data)
            create_subscriber.delay(serializer.instance.id)
        return response

    def activate_action(self, qs, data):
        response = super(SubscriberCpViewSet, self).activate_action(qs, data)
        if response.status_code == 200:
            subscriber_ids = [subscriber.id for subscriber in qs]
            update_subscribers.delay(subscriber_ids)
        return response

    def update(self, request, *args, **kwargs):
        response = super(SubscriberCpViewSet, self).update(request, *args, **kwargs)
        if response.status_code == 200:
            instance = self.get_object()
            update_subscribers.delay([instance.id])
        return response


class CampaignsCpViewSet(CpViewSet):
    path = 'campaigns'
    model = Campaign
    queryset = Campaign.objects.all()
    available_actions = dict(delete='Удаление')
    serializer_class = CampaignDetailSerializer
    list_serializer_class = CampaignListSerializer
    filter_class = CampaignsFilter
    ordering_fields = ('id', 'name', 'edit_date', 'create_date')

    def post(self, request, *args, **kwargs):
        view_name = request._request.resolver_match.view_name
        if view_name.split('__')[-1] == 'preview':
            return self.preview(request)
        elif view_name.split('__')[-1] == 'send':
            return self.send(request)

        return super(CampaignsCpViewSet, self).post(request, *args, **kwargs)

    def preview(self, request):
        serializer = PreviewSerializer(data=request.data)
        if serializer.is_valid():
            try:
                text = self.render_string(self.linebreaksbr(serializer.data.get('template', '')), dict())
                template = get_template("notifications/email/email.html")
                context = dict(text=text,
                               unsubscribe=True,
                               domain=settings.ROOT_LINK if hasattr(settings, 'ROOT_LINK') else '')
                return Response(dict(template=template.render(context)))
            except Exception as e:
                Response(status=400)
        else:
            Response(status=400)

    def send(self, request):
        serializer = SendEmailSerializer(data=request.data)
        if serializer.is_valid():
            try:
                text = self.render_string(self.linebreaksbr(serializer.data.get('template', '')), dict())
                email = serializer.data.get('email')
                template = get_template("notifications/email/email.html")
                context = dict(text=text,
                               unsubscribe=True,
                               domain=settings.ROOT_LINK if hasattr(settings, 'ROOT_LINK') else '')
                content = template.render(context)
                subject = 'Тест рассылки'
            except Exception as e:
                return Response(dict(message='Ошибка при создании шаблона'), status=400)

            send_email.delay(subject, content, [email])
            return Response(status=200)
        else:
            Response(status=400)

    def render_string(self, string, context):
        load_string = r'{% load site_tags notification_tags %}'
        string = load_string + string
        template = Template(string)
        context = Context(context)
        return template.render(context)

    def linebreaksbr(self, value):
        value = normalize_newlines(value)
        return mark_safe(value.replace('\n', '<br />\n'))

    @classmethod
    def get_urls(self):
        path = self.path if self.path else self.model._meta.model_name
        urlpatterns = [
            url(r'^%s/preview/$' % path,
                self.as_view(http_method_names=['post', 'head', 'options', 'trace']),
                name='api__%s__preview' % path),
            url(r'^%s/send/$' % path,
                self.as_view(http_method_names=['post', 'head', 'options', 'trace']),
                name='api__%s__send' % path),
        ]
        urlpatterns += super(CampaignsCpViewSet, self).get_urls()

        return urlpatterns


cp_api.register(SubscriberCpViewSet)
cp_api.register(CampaignsCpViewSet)
