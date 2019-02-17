# -*- coding: utf-8 -*-

from django.template import Library, TemplateSyntaxError, Node
from ..models import Settings

register = Library()


@register.simple_tag(takes_context=True)
def get_settings(context):
    try:
        settings = Settings.objects.get(pk=1)
    except:
        settings = None
    return settings




