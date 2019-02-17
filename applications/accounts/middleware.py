# -*- coding: utf-8 -*-

import re
# from social.apps.django_app.middleware import SocialAuthExceptionMiddleware
from datetime import timedelta

from django.http import HttpResponseRedirect
from django.conf import settings
# from social import exceptions as social_exceptions
from django.urls import reverse, resolve


# class SocialExceptionMiddleware(SocialAuthExceptionMiddleware):
#     def process_exception(self, request, exception):
#         if hasattr(social_exceptions, exception.__class__.__name__):
#             return HttpResponseRedirect(reverse('profile', prefix=request.CITY_PREFIX))
from django.utils.timezone import now


class ChangePasswordMiddleware(object):

    def __init__(self):
        self.exceptions = tuple(re.compile(url) for url in settings.LOGIN_REQUIRED_URLS_EXCEPTIONS)

    def process_request(self, request):
        user = request.user

        for url in self.exceptions:
            if url.match(request.path):
                return None

        try:
            view_name = resolve(request.path_info).url_name
        except:
            view_name = ''
        if user and user.is_authenticated() and user.request_change_password and view_name != 'change-password-after-login':
            return HttpResponseRedirect(reverse('change-password-after-login'))


class LastSeenUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.user.is_anonymous:
            user = request.user
            last_seen = user.last_seen
            current_time = now()
            if last_seen is not None:
                if current_time > last_seen + timedelta(minutes=1):
                    user.last_seen = current_time
                    user.save()
            else:
                user.last_seen = current_time
                user.save()
        response = self.get_response(request)
        return response
