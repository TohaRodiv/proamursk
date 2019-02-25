# -*- coding: utf-8 -*-

import json
import requests
from django.db.models import Q
from django.template import Library
from datetime import datetime
from django.conf import settings
from applications.root.models import News, Person, History, SidebarBanner, CityGuide, Event, Report, Special, Place, Feedback
from applications.contentblocks.models import Page

register = Library()


@register.inclusion_tag('site/page-block/sidebar-banner.html', takes_context=True)
def get_banner(context, banner_type='vertical'):
    banners = SidebarBanner.objects.filter((Q(start_publication_date__isnull=True) | Q(start_publication_date__lte=datetime.now())) &
                                           (Q(end_publication_date__isnull=True) | Q(end_publication_date__gte=datetime.now())),
                                           is_active=True).order_by('?')

    request = context.get('request')
    show_two_banners = False
    if request:
        try:
            url_name = request.resolver_match.url_name
        except:
            pass
        else:
            if url_name == 'news-detail':
                item = context.get('news')
                show_two_banners = item.show_two_banners
            elif url_name == 'events-detail':
                item = context.get('event')
                show_two_banners = item.show_two_banners
            elif url_name == 'reports-detail':
                item = context.get('report')
                show_two_banners = item.show_two_banners
            elif url_name == 'persons-detail':
                item = context.get('person')
                show_two_banners = item.show_two_banners
            elif url_name == 'history-detail':
                item = context.get('history')
                show_two_banners = item.show_two_banners
            elif url_name == 'city-guides-detail':
                item = context.get('guide')
                show_two_banners = item.show_two_banners
            elif url_name == 'places-detail':
                item = context.get('place')
                show_two_banners = item.show_two_banners
            elif url_name == 'films-detail':
                item = context.get('film')
                show_two_banners = item.show_two_banners

    banners = banners[:2] if show_two_banners else banners[:1]
    return dict(banners=banners, show_two_banners=show_two_banners, banner_type=banner_type)


@register.filter()
def get_model_name(val):
    try:
        return val._meta.model_name
    except:
        return None

@register.inclusion_tag('site/page-block/last-news-widget.html', takes_context=True)
def last_news(context):
    news = News.objects.filter(is_active=True, publication_date__lte=datetime.now()).order_by('-publication_date')

    request = context.get('request')
    if request:
        try:
            url_name = request.resolver_match.url_name
        except:
            pass
        else:
            if url_name == 'news-detail':
                news_obj = context.get('news')
                if news_obj:
                    news = news.exclude(id=news_obj.id)

    news = news[:4]

    return dict(news=news)


@register.filter()
def get_model_name(val):
    try:
        return val._meta.model_name
    except:
        return None


@register.inclusion_tag('site/page-block/read-also.html', takes_context=True)
def read_also(context):
    person = context.get('person')
    history_item = context.get('history')
    top_objects = context.get('top_objects', [])

    persons = Person.objects.filter(is_active=True,
                                    publication_date__lte=datetime.now()).exclude(id__in=[i.object_id for i in top_objects if i.entity == 'persons']).order_by('-publication_date')
    history = History.objects.filter(is_active=True,
                                     publication_date__lte=datetime.now()).exclude(id__in=[i.object_id for i in top_objects if i.entity == 'history']).order_by('-publication_date')

    request = context.get('request')
    if request:
        try:
            url_name = request.resolver_match.url_name
        except:
            pass
        else:
            try:
                page = Page.objects.select_related().get(codename=url_name)
            except:
                pass
            else:
                top_objects = page.top_items.all().order_by('weight')
                persons = persons.exclude(id__in=[i.object_id for i in top_objects if i.entity == 'person'])
                history = history.exclude(id__in=[i.object_id for i in top_objects if i.entity == 'history'])

    if person:
        persons = persons.exclude(id=person.id)

    if history_item:
        history = history.exclude(id=history_item.id)

    persons = persons[:2]
    history = history[:2]

    return dict(items=list(persons) + list(history))


@register.inclusion_tag('notifications/posts.html', takes_context=True)
def posts(context, *args):

    models = dict(
        new=News,
        event=Event,
        report=Report,
        history=History,
        person=Person,
        place=Place,
        guide=CityGuide,
        special=Special,
    )

    items = []

    for arg in args:
        item_data = [i.strip() for i in arg.split(',')]
        if len(item_data) == 3:
            model = models.get(item_data[0])
            if model:
                try:
                    id = int(item_data[1])
                except:
                    pass
                else:
                    qs = model.objects.filter(id=id, is_active=True)
                    if item_data[0] not in ['event', 'guide']:
                        qs = qs.filter(publication_date__lte=datetime.now())

                    obj = qs.first()
                    if obj:
                        item_format = item_data[2]
                        if item_format in ['wf', 'ws']:
                            items.append([dict(object=obj, format=item_format)])
                        else:
                            last_item = items[-1]
                            if len(last_item) == 1:
                                last_item_obj = last_item[0]
                                if last_item_obj['format'] not in ['wf', 'ws']:
                                    last_item.append(dict(object=obj, format=item_format))
                                else:
                                    items.append([dict(object=obj, format=item_format)])
                            else:
                                items.append([dict(object=obj, format=item_format)])
    return dict(items=items, domain=context.get('domain'))


@register.inclusion_tag('notifications/attachments.html', takes_context=True)
def attachments(context):
    items = []
    try:
        feedback = Feedback.objects.get(id=context.get('feedback_id'))
    except Exception as e:
        pass
    else:
        items = feedback.attachments.all()

    return dict(items=items, domain=context.get('domain'))


def get_yandex_weather():
    api_key = settings.YA_WEATHER_API_KYE
    lat = settings.YA_WEATHER_LAT
    lon = settings.YA_WEATHER_LON
    headers = {'X-Yandex-API-Key': api_key}
    params = {'lat': lat, 'lon': lon, 'lang': 'ru_RU'}
    try:
        response = requests.get('https://api.weather.yandex.ru/v1/informers/',
                                params=params,
                                headers=headers,
                                timeout=5)
    except:
        response = ''
    else:
        if response.status_code == 200:
            response = response.text

    return response




@register.simple_tag(takes_context=True)
def get_weather(context):
    request = context.get('request')
    temp = ''

    if request and hasattr(request, 'SETTINGS') and request.SETTINGS:
        site_settings = request.SETTINGS
        if not site_settings.weather_data or (site_settings.weather_data and (datetime.now() - site_settings.weather_last_update).seconds / 60 > 60):
            site_settings.weather_last_update = datetime.now()
            site_settings.weather_data = get_yandex_weather()
            site_settings.save()

        try:
            data = json.loads(site_settings.weather_data)
        except:
            pass
        else:
            temp = data.get('fact', dict()).get('temp', '')

    return temp

