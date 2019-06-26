# -*- coding: utf-8 -*-

from django.conf import settings


def project_settings(request):
    return {'ROOT_LINK': settings.ROOT_LINK}
