# -*-coding: utf-8 -*-

from django.urls import resolve
from django.template.loader import render_to_string
from django.template import RequestContext
from django.http import HttpResponse
from .models import Settings
from django.utils.deprecation import MiddlewareMixin


class AddSettingsInRequest(MiddlewareMixin):
    def process_request(self, request):
        try:
            settings = Settings.objects.get(pk=1)
        except:
            settings = None

        request.SETTINGS = settings


class CheckDisableSite(MiddlewareMixin):

    def process_request(self, request):
        is_admin_link = request.path.startswith('/admin')
        is_sap_link = request.path.startswith('/sap')
        is_signin_link = request.path.startswith('/api/v1/auth/signin')
        is_bank_link = request.path.startswith('/payment-notification')
        is_policy_link = request.path.startswith('/about/policy/')
        is_payments_link = request.path.startswith('/api/site/add-payment/')
        try:
            url = resolve(request.path)
            url_name = url.url_name
        except:
            url_name = None

        if not is_payments_link and not is_signin_link and not is_sap_link and not is_policy_link and not is_bank_link and not is_admin_link and request.SETTINGS and request.SETTINGS.disable_site and url_name != 'maintenance-mode':
            if not (request.user and request.user.is_staff):
                content = render_to_string('site/maintenance-mode.html', {'new_settings': request.SETTINGS}, request=request)
                return HttpResponse(content, status=503)
