# -*- coding: utf-8 -*-

from django.template import Library
from applications.mediafiles.models import MediaFile

from PIL import Image

register = Library()


@register.filter(name='get_thumbnail_url')
def get_thumbnail_url(value):
    try:
        im = Image.open(value.file.path)
    except:
        width, height = (10000, 10000)
    else:
        try:
            width = int(im.size[0])
            height = int(im.size[1])
        except:
            width, height = (10000, 10000)

    if width and height and isinstance(value, MediaFile):
        value = value.get_thumbnail_url_by_size((width, height))
    else:
        value = ''
    return value


@register.filter(name='get_thumbnail_url_by_size')
def get_thumbnail_url_by_size(value, arg):
    args = arg.split(',')
    if isinstance(value, MediaFile):
        if len(args) > 2:
            value = value.get_thumbnail_url_by_size((int(args[0]), int(args[1]), 'crop'))
        else:
            value = value.get_thumbnail_url_by_size((int(args[0]), int(args[1])))
    else:
        value = ''
    return value

@register.filter(name='get_thumbnail_url_by_name')
def get_thumbnail_url_by_name(value, arg):
    if isinstance(value, MediaFile):
        value = value.get_thumbnail_url_by_name(arg)
    else:
        value = ''
    return value


@register.filter(name='get_img_height')
def get_img_height(value):
    try:
        im = Image.open(value.path)
    except:
        height = None
    else:
        height = im.size[1]

    return height

@register.filter(name='get_file_ext')
def get_file_ext(value):
    try:
        ext = value.name.split('.')[-1]
    except:
        ext = ''

    return ext