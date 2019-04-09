# -*- coding: utf-8 -*-

from django import template
from django.template import Context, Template
from django.conf import settings
from ..models import HtmlTemplate
register = template.Library()


@register.inclusion_tag('notifications/title.html', takes_context=True)
def title(context, text):
    return {'text': text, 'domain': context.get('domain', ''),}


@register.inclusion_tag('notifications/link.html', takes_context=True)
def link(context, url, text=None):
    return {'text': text,
            'domain': context.get('domain', ''),
            'url': url}


@register.inclusion_tag('notifications/button.html', takes_context=True)
def button(context, url, text=None):
    return {'text': text,
            'domain': context.get('domain', ''),
            'url': url}


@register.inclusion_tag('notifications/email.html', takes_context=True)
def email(context, url, text=None):
    return {'text': text,
            'domain': context.get('domain', ''),
            'url': url}


@register.inclusion_tag('notifications/separator.html', takes_context=True)
def separator(context):
    return {'domain': context.get('domain', '')}


@register.simple_tag(takes_context=True)
def html_template(context, id):
    try:
        id = int(id)
        template_object = HtmlTemplate.objects.get(pk=id)
    except:
        return ''
    else:
        template = Template(template_object.text)
        return template.render(context)
