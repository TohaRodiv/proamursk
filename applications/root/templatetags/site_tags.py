# -*- coding: utf-8 -*-

from django.db.models import Q
from django.template import Library
from datetime import datetime
from django.conf import settings
from applications.root.models import News, Person, History, SidebarBanner
from applications.contentblocks.models import Page

register = Library()


@register.inclusion_tag('site/page-block/sidebar-banner.html', takes_context=True)
def get_banner(context):
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
    return dict(banners=banners, show_two_banners=show_two_banners)


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
                                    publication_date__lte=datetime.now()).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'persons']).order_by('-publication_date')
    history = History.objects.filter(is_active=True,
                                     publication_date__lte=datetime.now()).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'history']).order_by('-publication_date')

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
                persons = persons.exclude(id__in=[i.object_id for i in top_objects if i.codename == 'person'])
                history = history.exclude(id__in=[i.object_id for i in top_objects if i.codename == 'history'])

    if person:
        persons = persons.exclude(id=person.id)

    if history_item:
        history = history.exclude(id=history_item.id)

    persons = persons[:2]
    history = history[:2]

    return dict(items=list(persons) + list(history))

