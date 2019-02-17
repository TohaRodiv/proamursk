# -*- coding: utf-8 -*-

from django.urls import resolve
from .models import Page


def content_blocks(request):
    """
        Выводит contentblocks для страницы
    """
    result = None
    page = None
    try:
        url_name = resolve(request.path_info).url_name
    except:
        pass
    else:
        try:
            page = Page.objects.select_related().get(codename=url_name)
        except:
            pass
        else:
            blocks = page.blocks.all()
            result = {}
            for block in blocks:
                result[block.codename] = block

    return {'content_blocks': result, 'content_page': page}
