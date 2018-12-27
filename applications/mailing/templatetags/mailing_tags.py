# -*- coding: utf-8 -*-

from django import template
from django.template import Context, Template
from django.template.loader import get_template

from applications.root.models import News, Event, Place

register = template.Library()


@register.filter('render')
def render(content):
    content = '{% load mailing_tags %}' + content
    template = Template(content)
    context = Context({})
    return template.render(context)


@register.inclusion_tag('mailing/news.html')
def news(news_id):
    try:
        news = News.objects.get(id=news_id)
        return {
            'url': news.get_absolute_url(),
            'img_src': news.cover.get_thumbnail_url_by_name('pub_3cols_small'),
            'title': news.title,
            'lead': news.lead
        }
    except News.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'lead': ''}


@register.inclusion_tag('mailing/events.html')
def events(event_id):
    try:
        event = Event.objects.get(id=event_id)
        return {
            'url': event.get_absolute_url(),
            'img_src': event.cover.get_thumbnail_url_by_name('pub_3cols_small'),
            'title': event.title,
            'place': event.place,
            'event_date_text': event.event_date_text
        }
    except Event.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'place': '', 'event_date_text': ''}


@register.inclusion_tag('mailing/places.html')
def places(place_id):
    try:
        place = Place.objects.get(id=place_id)
        return {
            'url': place.get_absolute_url(),
            'img_src': place.cover.get_thumbnail_url_by_name('pub_3cols_small'),
            'title': place.title,
            'descriptor': place.descriptor,
        }
    except Place.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'descriptor': ''}

