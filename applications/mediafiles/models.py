# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import uuid
from PIL import Image
from subprocess import call
from django.core.files import File
from django.utils import timezone
from django.db import models
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from .imgpy import Img


def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    file_name = '{0}.{1}'.format(uuid.uuid4(), ext)
    path = '/'.join(['medialib', file_name])
    return path


def get_thumbnail_file_path(instance, filename):
    file_name = filename.split('/')[-1]
    path = '/'.join(['medialib', 'thumbnails', file_name])
    return path


class Extension(models.Model):
    name = models.CharField(u'Название', max_length=20, unique=True)

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'value': self.name}

    class Meta:
        verbose_name = u'Расширение'
        verbose_name_plural = u'Расширения'


class MediaFile(models.Model):
    name = models.CharField(max_length=255, verbose_name=u'Имя файла оригинала')
    file = models.FileField(upload_to=get_file_path, verbose_name=u'Файл', max_length=1000)
    width = models.IntegerField(u'Ширина, px', blank=True, null=True)
    height = models.IntegerField(u'Высота, px', blank=True, null=True)
    file_size = models.IntegerField(u'Размер оригинала, КБ')
    create_date = models.DateTimeField(auto_now_add=True, verbose_name=u'Дата загрузки')
    is_active = models.BooleanField(default=True, verbose_name=u'Активный')
    tags = models.ManyToManyField('MediaTag', verbose_name=u'Теги', blank=True)
    extension = models.ForeignKey(Extension, models.SET_NULL, verbose_name=u'Расширение', blank=True, null=True)

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'value': self.name}

    class Meta:
        verbose_name = u'Галерея'
        verbose_name_plural = u'Галерея'

    def get_thumbnail_url_by_size(self, size, params=None, watermark=None):
        thumbnail_suffix = '%dx%d' % (size[0], size[1])
        if watermark:
            thumbnail_suffix = u'%s_wm_%s' % (thumbnail_suffix, watermark)
        if params is None:
            params = {}
        if hasattr(settings, 'MEDIALIB_JPEG_QUALITY') and 'quality' not in params:
            params['quality'] = settings.MEDIALIB_JPEG_QUALITY
        return self.get_thumbnail_url(size, thumbnail_suffix, **params)

    def get_thumbnail_url_by_name(self, name, params=None, size=None, watermark=None):
        thumbnail_suffix = name
        if watermark:
            thumbnail_suffix = u'%s_wm_%s' % (thumbnail_suffix, watermark)
        setting_define = hasattr(settings, 'MEDIALIB_THUMB_SIZE') and isinstance(settings.MEDIALIB_THUMB_SIZE, dict)
        if params is None:
            params = {}
        if hasattr(settings, 'MEDIALIB_JPEG_QUALITY') and 'quality' not in params:
            params['quality'] = settings.MEDIALIB_JPEG_QUALITY
        if watermark:
            params['watermark'] = watermark
        if size is not None and isinstance(size, (list, tuple)):
            size = size
            return self.get_thumbnail_url(size, thumbnail_suffix, **params)
        elif setting_define and name in settings.MEDIALIB_THUMB_SIZE:
            size = settings.MEDIALIB_THUMB_SIZE[name]
            return self.get_thumbnail_url(size, thumbnail_suffix, **params)
        else:
            return ''

    def get_thumbnail_url(self, size, thumbnail_suffix, convert_to_jpeg=False, quality=100, progressive=True, watermark=None):

        # if self.get_ext() == 'gif':
        #     url = self.file.url
        # else:
        media_url = settings.MEDIA_URL.replace('/', '')
        thumbnail_file_path = self.get_thumbnail_path(thumbnail_suffix, convert_to_jpeg)

        if not self.check_file_exist(thumbnail_file_path):

            im = self.make_image_thumbnail(size, thumbnail_suffix, convert_to_jpeg, quality, progressive, watermark)

            if im is not None:
                fullname = thumbnail_file_path.replace(settings.MEDIA_ROOT, '')
            else:
                fullname = None

        else:
            fullname = thumbnail_file_path.replace(settings.MEDIA_ROOT, '')

        if fullname is not None:
            url = '/'.join([i for i in fullname.split('\\')])
            if url.startswith('/'):
                url = '/%s%s' % (media_url, url)
            else:
                url = '/%s/%s' % (media_url, url)
        else:
            url = ''
        return url

    def get_thumbnail_path(self, thumbnail_suffix, convert_to_jpeg=False):
        file_dir = os.path.dirname(self.file.path)
        file_name, extension = os.path.basename(self.file.name).split('.')
        thumbnail_dir = os.path.join(file_dir, 'thumbnails')
        if convert_to_jpeg:
            extension = 'jpg'
        thumbnail_name = file_name+'_'+thumbnail_suffix+'.'+extension
        thumbnail_path = os.path.join(thumbnail_dir, thumbnail_name)

        return thumbnail_path

    def get_thumbnail_name_by_suffix(self, thumbnail_suffix):
        file_name, extension = os.path.basename(self.file.name).split('.')
        return u'%s_%s.%s' % (file_name, thumbnail_suffix, extension)

    @staticmethod
    def check_file_exist(path):
        return os.path.isfile(path)

    def make_all_image_thumbnail(self, key):
        is_define_auto_create = hasattr(settings, 'MEDIALIB_THUMB_AUTO_CREATE') and isinstance(settings.MEDIALIB_THUMB_AUTO_CREATE, dict)
        is_define_thumb_size = hasattr(settings, 'MEDIALIB_THUMB_SIZE') and isinstance(settings.MEDIALIB_THUMB_SIZE, dict)

        if is_define_auto_create and key in settings.MEDIALIB_THUMB_AUTO_CREATE:
            sizes = settings.MEDIALIB_THUMB_AUTO_CREATE[key]

            if is_define_thumb_size:
                params = settings.MEDIALIB_THUMB_SIZE
            else:
                params = None

            for size in sizes:
                if isinstance(size, (tuple, list)):
                    thumbnail_suffix = '%dx%d' % (size[0], size[1])
                    self.make_image_thumbnail(size, thumbnail_suffix)
                elif size in params:
                    name = size
                    self.make_image_thumbnail(params[name], name)

        elif is_define_thumb_size and key in settings.MEDIALIB_THUMB_SIZE:
            size = settings.MEDIALIB_THUMB_SIZE[key]
            self.make_image_thumbnail(size, key)

    def make_image_thumbnail(self, size, thumbnail_suffix, convert_to_jpeg=False, quality=100, progressive=True, watermark=None):
        self.create_thumbnail_dir_if_not_exist()
        thumbnail_file_path = self.get_thumbnail_path(thumbnail_suffix, convert_to_jpeg)
        img = self.get_image_or_none()
        try:
            file_ext = os.path.basename(self.file.name).split('.')[-1].lower()
        except:
            file_ext = None

        if img is not None:

            if len(size) == 3 and str(size[2]) == str('crop'):
                width, height = img.size
                th_width = size[0]
                th_height = size[1]

                if th_width <= width and th_height <= height:

                    width_k = float(width)/th_width
                    height_k = float(height)/th_height

                    th_m = float(th_width)/th_height
                    m = float(width)/height

                    if width_k < height_k:
                        thumb_size = (width, round(width/th_m))
                    else:
                        thumb_size = (round(height*th_m), height)

                    left = int(round(float(width)/2 - thumb_size[0]/float(2)))
                    top = int(round(height/float(2) - thumb_size[1]/float(2)))
                    right = int(round(width/float(2) + thumb_size[0]/float(2)))
                    bottom = int(round(height/float(2) + thumb_size[1]/float(2)))

                    if file_ext == 'gif':
                        img.crop((left, top, right, bottom))
                    else:
                        img = img.crop((left, top, right, bottom))

                img.thumbnail((th_width, th_height))
            elif len(size) == 2:
                img.thumbnail(size)

            if file_ext != 'gif' and watermark and hasattr(settings, 'MEDIALIB_WATERMARKS'):
                watermark_conf = settings.MEDIALIB_WATERMARKS.get(watermark)
                if watermark_conf:
                    watermark_img_path = watermark_conf.get('image_path')
                    watermark_img_size = watermark_conf.get('size')
                    if watermark_img_path:
                        try:
                            watermark_image = Image.open(watermark_img_path)
                        except:
                            pass
                        else:
                            if watermark_img_size and isinstance(watermark_img_size, (list, tuple)):
                                watermark_image.thumbnail(watermark_img_size)
                            img_width, img_height = img.size
                            watermark_width, watermark_height = watermark_image.size
                            watermark_left = watermark_conf.get('left')
                            watermark_top = watermark_conf.get('top')
                            watermark_right = watermark_conf.get('right')
                            watermark_bottom = watermark_conf.get('bottom')
                            if watermark_left:
                                left_position = watermark_left
                            elif watermark_right:
                                left_position = img_width - watermark_right - watermark_width
                            else:
                                left_position = 0

                            if watermark_top:
                                top_position = watermark_top
                            elif watermark_bottom:
                                top_position = img_height - watermark_bottom - watermark_height
                            else:
                                top_position = 0

                            img.paste(watermark_image, (left_position, top_position), mask=watermark_image)

            if file_ext == 'gif':
                img.save(thumbnail_file_path)
                try:
                    cmd = ["gifsicle", thumbnail_file_path, "--output", thumbnail_file_path]
                    code = call(cmd)
                except Exception as e:
                    pass
                else:
                    if code == 0:
                        try:
                            img = Image.open(thumbnail_file_path)
                        except Exception as e:
                            pass

            else:
                if convert_to_jpeg:
                    img.convert('RGB').save(thumbnail_file_path, 'JPEG', quality=quality, progressive=progressive)
                elif file_ext in ('jpg', 'jpeg'):
                    img.convert('RGB').save(thumbnail_file_path, 'JPEG', quality=quality, progressive=progressive)
                else:
                    img.save(thumbnail_file_path)

            self.save_thumbnail_to_db(thumbnail_suffix, img, thumbnail_file_path)

        return img

    def save_thumbnail_to_db(self, thumbnail_suffix, img, file_path):
        width, height = img.size
        file_name = self.get_thumbnail_name_by_suffix(thumbnail_suffix)
        django_file = File(open(file_path))
        file_size = django_file.size / 1024
        obj = Thumbnail(name=file_name, suffix=thumbnail_suffix, original_file_id=self.id, width=width, height=height,
                         file_size=file_size, create_date=timezone.now())
        obj.file.name = file_path.replace(settings.MEDIA_ROOT+'/', '')
        obj.save()
        return obj

    def create_thumbnail_dir_if_not_exist(self):
        orig_file_dir = os.path.dirname(self.file.path)
        thumbnail_dir = os.path.join(orig_file_dir, 'thumbnails')
        if not os.path.isdir(thumbnail_dir):
            os.makedirs(os.path.join(thumbnail_dir))

    def get_default_thumbnail(self):
        return self.get_thumbnail_url_by_size((300, 200))

    def get_ext(self):
        file_name, file_ext = os.path.basename(self.file.name).split('.')
        return file_ext.lower()

    def is_image(self):
        return True if self.get_image_or_none() else False

    def get_image_or_none(self):
        ext = self.get_ext().lower()
        if ext == 'gif':
            try:
                img = Img(self.file.path)
            except:
                img = None
        else:
            try:
                img = Image.open(self.file.path)
            except:
                img = None

        return img

    def get_file_size(self):
        return os.path.getsize(self.file.path)

    def get_text_file_size(self):
        file_size = float(self.file_size)
        if not file_size or file_size == 0:
            return u'—'
        elif file_size > 1024:
            file_size = (u'%s МБ' % (int((file_size / float(1024)) * 100) / float(100))).rstrip('0').rstrip('0').rstrip('.')
        else:
            file_size = u'%d КБ' % file_size
        return file_size.replace('.', ',')

    def get_resolution_text(self):
        if self.width and self.height:
            return u'%sx%s' % (self.width, self.height)
        else:
            return u'—'

    def save(self, *args, **kwargs):
        extension = None
        try:
            extension = Extension.objects.get(name=self.get_ext())
        except ObjectDoesNotExist:
            extension = Extension.objects.create(name=self.get_ext())
        except:
            pass

        self.extension = extension
        super(MediaFile, self).save(*args, **kwargs)


class MediaTag(models.Model):
    name = models.CharField(u'Название тега', max_length=255, unique=True)
    model = models.CharField(u'Модель', max_length=255, blank=True)
    is_default = models.BooleanField(default=False, verbose_name=u'Тег по умолчанию')

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'value': self.name}

    class Meta:
        verbose_name = u'Медиатег'
        verbose_name_plural = u'Медиатеги'


class Thumbnail(models.Model):
    name = models.CharField(max_length=255, verbose_name=u'Имя файла')
    suffix = models.CharField(max_length=255, verbose_name=u'Суффикс')
    original_file = models.ForeignKey(MediaFile, models.CASCADE, verbose_name=u'Оригинал')
    file = models.FileField(upload_to=get_thumbnail_file_path, verbose_name=u'Файл', max_length=1000)
    width = models.IntegerField(u'Ширина, px', blank=True, null=True)
    height = models.IntegerField(u'Высота, px', blank=True, null=True)
    file_size = models.IntegerField(u'Размер оригинала, КБ')
    create_date = models.DateTimeField(auto_now_add=True, verbose_name=u'Дата создания')

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'value': self.name}

    def get_text_file_size(self):
        file_size = float(self.file_size)
        if not file_size or file_size == 0:
            return u'—'
        elif file_size > 1024:
            file_size = (u'%s МБ' % (int((file_size / float(1024)) * 100) / float(100))).rstrip('0').rstrip('0').rstrip('.')
        else:
            file_size = u'%d КБ' % file_size
        return file_size.replace('.', ',')

    class Meta:
        verbose_name = u'Миниатюра'
        verbose_name_plural = u'Миниатюры'


def auto_delete_file_on_delete(sender, **kwargs):
    instance = kwargs['instance']
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

models.signals.post_delete.connect(auto_delete_file_on_delete, sender=MediaFile)
models.signals.post_delete.connect(auto_delete_file_on_delete, sender=Thumbnail)
