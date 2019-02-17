# -*- coding: utf-8 -*-

from .models import Settings


def site_settings(request):
    try:
        settings = Settings.objects.get(pk=1)
    except:
        settings = None

    return {'settings': settings}