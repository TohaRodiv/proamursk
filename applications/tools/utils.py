# -*- coding: utf-8 -*-

import os
import json
import re
import time
from django.utils.html import strip_tags
from urllib.parse import urlparse, parse_qs
from django.utils import translation
from django.conf import settings


class Breadcrumb(object):

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

def log(text):
    f = open(os.path.join(settings.BASE_DIR, 'log.txt'), 'a')
    text = text if text else ''
    f.write(text)
    f.close()


def get_player_link(value):
    url = urlparse(value)
    if url.hostname == 'vimeo.com' or url.hostname == 'www.vimeo.com':
        video_id = url.path.split('/')[-1]
        link = '//player.vimeo.com/video/%s?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff' % video_id
    elif url.hostname == 'youtube.com' or url.hostname == 'www.youtube.com':
        video_id = parse_qs(url.query).get('v')
        video_id = video_id[0] if isinstance(video_id, list) else None
        link = '//www.youtube.com/embed/%s?rel=0&amp;showinfo=0' % video_id
    else:
        link = ''

    return link


def make_ajax_response(status, content):
    result = {
        'status': status,
    }

    result.update(content)

    return json.dumps(result)


def cut_zero_from_float(value):
    if isinstance(value, float):
        int_value = int(value)
        if (value - int_value) == 0:
            return int_value
        else:
            return value

    else:
        return value


def sort_by_id(objects_list, ids):
    return sorted(objects_list, key=lambda x: ids.index(x.id) if x.id in ids else len(ids))


def add_lang_params_to_query_params(query_params, lang_params=None):
    if lang_params and isinstance(lang_params, dict):
        lang = translation.get_language()
        lang = lang.split('-')[0] if lang else None
        if lang is not None:
            for key, value in lang_params.items():
                key = '%s_%s' % (key, lang)
                query_params[key] = value

    return query_params


def locale_date_format(date_value, **kwargs):
    # Need pytils
    from pytils import dt
    lang = translation.get_language().split('-')[0]
    date_format = kwargs.get(lang)
    result = date_value.strftime("%d.%m.%Y")
    if date_format:
        if lang == 'ru':
            result = dt.ru_strftime(date_format, date_value)
        else:
            result = date_value.strftime(date_format)
    return result.lstrip('0')


def smart_floatformat(text):
    if isinstance(text, (float, int)) or re.match(r'\d+$', str(text)):
        try:
            int_val = int(text)
            val = float(text)
        except:
            return text if text else ''
        else:
            if (val - int_val) == 0:
                return int_val
            else:
                return val

    else:
        return text if text else ''


def intspace(value):
    orig = str(value)
    # new = re.sub("^(-?\d+)(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})", u'\g<1>\u00a0\g<2>', orig)
    parts = orig.split('.')
    x = parts[0]
    new_value = u''
    for i, index in enumerate(range(len(x), 0, -1)):
        new_value = x[index - 1] + new_value
        if (i + 1) % 3 == 0:
            new_value = u' ' + new_value

    if len(parts) > 1:
        fraction_part = parts[-1]
        if len(fraction_part) == 1:
            fraction_part += '0'
        else:
            fraction_part = fraction_part[:2]
        new_value = '%s,%s' % (new_value, fraction_part)

    return new_value


def add_space_each(value, symbol_count):
    x = str(value)
    new_value = u''
    for i, index in enumerate(range(len(x), 0, -1)):
        new_value = x[index - 1] + new_value
        if (i + 1) % symbol_count == 0:
            new_value = u' ' + new_value

    return new_value


def capfirst(value):
    return value and value[0].upper() + value[1:]


def get_timestamp(dt):
    return int(time.mktime(dt.timetuple()))


def format_card_number(number):
    x = 0
    parts = []
    while x <= (len(str(number)) - 4):
        parts.append(number[x:x+4])
        x = x + 4
    return ' '.join(parts)


def filter_number(string):
    return ''.join([c for c in string if c.isdigit()]) if string else ''


def clean_html(text):
    text = strip_tags(text)
    text = re.sub(r"&\w+;", " ", text)
    return text


def get_post_editor_text(content):
    result = ''

    for section in content:
        columns = section.get('columns', [])
        for column in columns:
            widgets = column.get('widgets', [])
            for element in widgets:
                if element:
                    element_type = element.get('type')
                    if element_type == 'text':
                        result += ' '
                        result += clean_html(element.get('text', ''))
                    elif element_type == 'quote':
                        result += ' '
                        result += clean_html(element.get('text', ''))
                    elif element_type == 'direct-speech':
                        result += ' '
                        result += clean_html(element.get('fio', ''))
                        result += ' '
                        result += clean_html(element.get('job', ''))
                        result += ' '
                        result += clean_html(element.get('text', ''))

    return result

