# -*- coding: utf-8 -*-

import re
import sys

from django.conf import settings
from django.template import (Node, Variable, TemplateSyntaxError,Library)
from ..utils import locale_date_format

register = Library()


class GetAvailableLanguagesNode(Node):
    def __init__(self, variable):
        self.variable = variable

    def render(self, context):
        context[self.variable] = [(k, v) for k, v in settings.LANGUAGES]
        return ''


@register.tag("get_all_languages")
def do_get_all_languages(parser, token):
    args = token.contents.split()
    if len(args) != 3 or args[1] != 'as':
        raise TemplateSyntaxError("'get_available_languages' requires 'as variable' (got %r)" % args)
    return GetAvailableLanguagesNode(args[2])


@register.simple_tag(takes_context=True)
def get_site_language(context, token, short=False):
    lang = token.split('-')[0]
    if short:
        return settings.SITE_LANGUAGES[lang][1]
    else:
        return settings.SITE_LANGUAGES[lang][0]


register.simple_tag(locale_date_format)