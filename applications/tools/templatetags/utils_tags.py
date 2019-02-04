# -*- coding: utf-8 -*-

import datetime

import time
from django.utils import timezone
from django.urls import resolve
from django.template import Library
from ..utils import get_player_link as player_link, intspace, smart_floatformat, add_space_each
from django.template.defaulttags import date
from django.utils.translation import ugettext as _
from django.template.loader import get_template

register = Library()


@register.simple_tag(takes_context=True)
def get_view_name(context):
    request = context.get('request')
    try:
        name = resolve(request.path_info).url_name
    except:
        name = ''
    return name


@register.simple_tag(takes_context=True)
def current_datetime(context):
    return datetime.datetime.now()


@register.simple_tag(takes_context=True)
def current_date(context):
    return datetime.date.today()


@register.simple_tag(takes_context=True)
def current_timestamp(context):
    return int(time.mktime(timezone.now().timetuple()))


@register.simple_tag(takes_context=True)
def add_value_to_context(context, val):
    return val

@register.filter(name='carry_over')
def carry_over(value, arg):
    return value.replace(arg, '&shy;')


@register.filter(name='get_dict_without')
def get_dict_without(value, arg):
    keys = arg.split(',')
    new_dict = dict([(k, v) for k, v in value.items() if k not in keys])
    return new_dict


@register.filter(name='to_querystring')
def to_querystring(value):
    querystring = '&'.join(['%s=%s' % (k, v) for k, v in value.items()])
    return querystring


@register.filter(name='replace')
def replace(value, arg):
    old, new = arg.split(',')
    return value.replace(old, new)


@register.filter(name='division')
def division(value, arg):
    result = None
    try:
        val = int(arg)
    except:
        val = None
    else:
        result = value / val

    return result


@register.filter(name='calc_discount')
def calc_discount(value, arg):
    result = None
    try:
        arg = int(arg)
    except:
        arg = None
    else:
        result = int(value / 100 * arg)

    return result


@register.filter(name='multiply')
def multiply(value, arg):
    result = None
    try:
        val = int(arg)
    except:
        val = None
    else:
        result = value * val
    return result


@register.filter
def subtract(value, arg):
    return value - arg


@register.filter()
def to_unicode(value):
    return str(value)


@register.filter()
def to_string(value):
    return str(value)


@register.filter
def get_item_or_zero(dictionary, key):
    if dictionary is not None:
        return dictionary.get(key, 0)
    else:
        return 0


@register.filter
def get_item(dictionary, key):
    try:
        value = dictionary.get(key)
    except:
        value = None

    return value


@register.filter
def get_attr(obj, attr):
    try:
        value = getattr(obj, attr)
    except:
        value = None

    return value


@register.filter
def get_list_item(obj, index):
    try:
        value = obj[index]
    except:
        value = None

    return value


@register.filter()
def only_language(value):
    return value.split('-')[0]


@register.filter()
def split_by(value, arg):
    return value.split(arg)


@register.filter()
def strip(value):
    return value.strip()


@register.filter()
def filter_numbers(value):
    return u''.join([i for i in value if i.isdigit()])


@register.filter
def is_number(value):
    try:
        int(value)
    except:
        return False
    else:
        return True


@register.inclusion_tag('og_meta_tags.html', takes_context=True)
def og_meta_tags(context, og_title=None, og_type=None, og_description=None,
                 og_image=None, og_site_name=None, og_image_width=None, og_image_height=None):
    og_type = og_type if og_type else 'website'
    request = context.get('request')
    if request:
        host = request.get_host()
        url = request.build_absolute_uri()
    else:
        host = ''
        url = ''

    og_image_width = og_image_width if og_image_width is not None else 1200
    og_image_height = og_image_height if og_image_height is not None else 630

    og_site_name = og_site_name if og_site_name else host
    meta = {
        'og_title': og_title,
        'og_type': og_type,
        'og_description': og_description,
        'og_image': 'http://'+str(host)+str(og_image) if og_image else '',
        'og_site_name': og_site_name,
        'og_url': str(url),
        'twitter_description': og_description,
        'twitter_domain': host,
        'twitter_image_src': 'http://'+str(host)+str(og_image) if og_image else '',
        'twitter_title': og_title,
        'og_image_width': og_image_width,
        'og_image_height': og_image_height
    }
    return {'meta': meta}


@register.inclusion_tag('breadcrumbs.html', takes_context=True)
def breadcrumbs(context, **kwargs):
    breadcrumbs = []
    return {'breadcrumbs': breadcrumbs}


@register.filter(name='get_player_link')
def get_player_link(value):
    return player_link(value)


@register.filter(is_safe=False)
def day_or_date(value, arg=None):
    """
        Возвращает Сегодня / Вчера или Дату по формату
    """

    if value in (None, ''):
        return ''

    try:
        value_date = value.date()
    except:
        if isinstance(value, datetime.date):
            value_date = value
        else:
            value_date = None

    if value_date is None:
        return ''

    if value_date == datetime.date.today():
        return _(u'Сегодня')
    elif value_date == (datetime.date.today() - datetime.timedelta(days=1)):
        return _(u'Вчера')
    else:
        return date(value, arg)


@register.filter(name='money_format')
def money_format(value):
    return '{0:,}'.format(value)


@register.filter(name='template_exist')
def template_exist(value):
    try:
        get_template(value)
        return True
    except:
        return False

@register.filter(name='second_to_minute')
def second_to_minute(value):
    try:
        m, s = divmod(value, 60)
        if s == 0:
            return u'%2d' % m
        else:
            return u'%2d:%02d' % (m, s)
    except:
        return u''

@register.filter
def percent(value, percent):
    try:
        result = value/100*percent
    except:
        result = None

    return result


smart_floatformat.is_safe = True
register.filter(smart_floatformat)

intspace.is_safe = True
register.filter(intspace)

add_space_each.is_safe = True
register.filter(add_space_each)



