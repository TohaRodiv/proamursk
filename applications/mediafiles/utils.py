# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import requests
import tempfile
import uuid
from django.core import files
from PIL import Image
from .models import MediaFile


def get_image_file_data(fl):
    try:
        im = Image.open(fl)
    except Exception as e:
        return None
    else:
        file_size_kb = int(round(float(fl.size) / 1024, 0))
        width, height = im.size
        img_format = im.format
        file_name = '%s.%s' % (uuid.uuid4(), img_format.lower())

        return {'name': file_name,
                'file_size': file_size_kb,
                'width': width,
                'height': height}


def save_image(image_file):
    is_image = True
    try:
        Image.open(image_file).load()
    except:
        is_image = False

    image_file.seek(0)
    data = get_image_file_data(image_file)

    if data and is_image:
        data['is_active'] = True
        file_name = data.get('name')
        image = MediaFile(**data)
        image.file.save(file_name, image_file)
        image.save()

        return image

    return None


def save_image_from_url(url):
    response = requests.get(url, stream=True)

    if response.status_code != requests.codes.ok:
        return None

    lf = tempfile.NamedTemporaryFile()
    for block in response.iter_content(1024 * 8):
        if not block:
            break
        lf.write(block)

    image = save_image(files.File(lf))
    return image


