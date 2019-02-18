# -*- coding: utf-8 -*-

from django.template import Library
from datetime import datetime
from django.conf import settings
from applications.root.models import News, Person, History
from applications.contentblocks.models import Page

register = Library()


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

    persons = Person.objects.filter(is_active=True, publication_date__lte=datetime.now()).order_by('-publication_date')
    history = History.objects.filter(is_active=True, publication_date__lte=datetime.now()).order_by('-publication_date')

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

