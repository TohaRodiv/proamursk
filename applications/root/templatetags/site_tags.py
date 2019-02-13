# -*- coding: utf-8 -*-

from django.template import Library
from datetime import datetime
from django.conf import settings
from applications.root.models import News

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