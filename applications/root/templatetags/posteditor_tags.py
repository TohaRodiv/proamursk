# -*- coding: utf-8 -*-

import json

from django import template
from applications.mediafiles.models import MediaFile
register = template.Library()


@register.inclusion_tag('posteditor/content.html', takes_context=True)
def make_content(context, content_json):
    request = context.get('request')
    all_images = {}

    if content_json:
        post_widgets = dict(image=[])

        for section in content_json:
            for column in section['columns']:
                for element in column['widgets']:
                    if element:
                        element_images = []
                        element_type = element.get('type')
                        if element_type == 'image':
                            element_images.append(element.get('image'))

                        for image_dict in element_images:
                            if image_dict:
                                try:
                                    image_id = int(image_dict.get('id'))
                                except:
                                    image_id = None

                                if image_id:
                                    post_widgets[element_type].append(image_id)

        if post_widgets['image']:
            ids = set()
            ids.update(post_widgets['image'])
            images = MediaFile.objects.select_related().filter(pk__in=ids)
            all_images = {int(image.id): image for image in images}

    return {'request': request,
            'content': content_json,
            'article': context.get('article'),
            'images': all_images}


# @register.inclusion_tag('posteditor/modules/slider_block.html', takes_context=True)
# def get_posteditor_slider(context, slider_id):
#     try:
#         slider_obj = Slider.objects.select_related().get(id=int(slider_id))
#     except:
#         slider_obj = None
#
#     slider = slider_obj.get_slides() if slider_obj else None
#
#     return {'slider_obj': slider_obj,
#             'slider': slider}
#


# @register.assignment_tag(takes_context=True)
# def get_posteditor_audio(context, obj_id):
#     try:
#         obj = AudioFile.objects.get(id=int(obj_id))
#     except:
#         obj = None
#
#     return obj




# @register.assignment_tag(takes_context=True)
# def get_image_size(context, block, column):
#     size_name = '%s.%s_%s' % (block['class'], column['part'], block['columns_count'])
#     retina_factor = RETINA_FACTOR
#     size = list(IMAGE_THUMBNAILS.get(size_name))
#     size[0] = size[0] * retina_factor
#     size = [str(i) for i in size]
#     return ', '.join(size)


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

