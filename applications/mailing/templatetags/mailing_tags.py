# -*- coding: utf-8 -*-

from django import template
from django.template import Context, Template

from applications.root.models import News, Event, Place, History, Person, Report, CityGuide, Special

register = template.Library()


@register.filter('render')
def render(content):
    content = '{% load mailing_tags %}{% load notification_tags %}' + content
    template = Template(content)
    context = Context({})
    return template.render(context)


@register.inclusion_tag('mailing/news.html')
def news(news_id):
    try:
        news = News.objects.get(id=news_id)
        return {
            'url': news.get_absolute_url(),
            'img_src': news.cover.get_thumbnail_url_by_name('mailing_article'),
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
            'img_src': event.cover.get_thumbnail_url_by_name('mailing_article'),
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
            'img_src': place.cover.get_thumbnail_url_by_name('mailing_article'),
            'title': place.title,
            'descriptor': place.descriptor,
        }
    except Place.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'descriptor': ''}


@register.inclusion_tag('mailing/history.html')
def history(history_id):
    try:
        _history = History.objects.get(id=history_id)
        return {
            'url': _history.get_absolute_url(),
            'img_src': _history.cover.get_thumbnail_url_by_name('mailing_article'),
            'title': _history.title,
            'descriptor': _history.descriptor,
        }
    except History.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'descriptor': ''}


@register.inclusion_tag('mailing/persons.html')
def persons(person_id):
    try:
        person = Person.objects.get(id=person_id)
        return {
            'url': person.get_absolute_url(),
            'img_src': person.cover.get_thumbnail_url_by_name('mailing_article'),
            'title': person.title,
            'descriptor': person.descriptor,
        }
    except Person.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'descriptor': ''}


@register.inclusion_tag('mailing/reports.html')
def reports(report_id):
    try:
        report = Report.objects.get(id=report_id)
        return {
            'url': report.get_absolute_url(),
            'img_src': report.cover.get_thumbnail_url_by_name('mailing_article'),
            'title': report.title,
            'place': report.place,
            'event_date_text': report.event_date_text
        }
    except Report.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'place': '', 'event_date_text': ''}


@register.inclusion_tag('mailing/guides.html')
def guides(guide_id):
    try:
        guide = CityGuide.objects.get(id=guide_id)
        return {
            'url': guide.get_absolute_url(),
            'img_src': guide.cover.get_thumbnail_url_by_name('mailing_article'),
            'title': guide.title,
            'descriptor': guide.place
        }
    except CityGuide.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'descriptor': ''}


@register.inclusion_tag('mailing/specials.html')
def specials(special_id):
    try:
        special = Special.objects.get(id=special_id)
        return {
            'url': special.get_absolute_url(),
            'img_src': special.cover.get_thumbnail_url_by_name('mailing_special'),
            'title': special.title,
            'descriptor': special.descriptor
        }
    except Special.DoesNotExist:
        return {'url': '', 'img_src': '', 'title': '', 'descriptor': ''}
