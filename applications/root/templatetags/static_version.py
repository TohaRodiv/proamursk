# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.template import Library
from django.conf import settings

register = Library()


@register.simple_tag
def static_version():
    try:
        v = settings.STATIC_VERSION
    except:
        v = 1
    return '?v='+str(v)