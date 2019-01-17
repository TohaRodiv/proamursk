# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import os
import uuid
from django.db import models
from django.core.exceptions import ObjectDoesNotExist


def get_file_path(instance, filename):
    ext = filename.split('.')[-1]
    file_name = '{0}.{1}'.format(uuid.uuid4(), ext)
    path = '/'.join(['files', file_name])
    return path


class FileExtension(models.Model):
    name = models.CharField(u'Название', max_length=20, unique=True)

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'value': self.name}

    class Meta:
        db_table='files_file_extension'
        verbose_name = u'Расширение'
        verbose_name_plural = u'Расширения'


class FileTag(models.Model):
    name = models.CharField(u'Название тега', max_length=255, unique=True)

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'value': self.name}

    class Meta:
        verbose_name = u'Тег файла'
        verbose_name_plural = u'Теги фалов'


class UserFile(models.Model):
    name = models.CharField(max_length=255, verbose_name=u'Имя файла оригинала')
    file = models.FileField(upload_to=get_file_path, verbose_name=u'Файл', max_length=1000)
    file_size = models.IntegerField(u'Размер оригинала, КБ')
    create_date = models.DateTimeField(auto_now_add=True, verbose_name=u'Дата загрузки')
    tags = models.ManyToManyField(FileTag, verbose_name=u'Теги', blank=True)
    extension = models.ForeignKey(FileExtension, verbose_name=u'Расширение', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'value': self.name}

    class Meta:
        db_table = 'files_user_file'
        verbose_name = u'Файл'
        verbose_name_plural = u'Файлы'

    @staticmethod
    def check_file_exist(path):
        return os.path.isfile(path)

    def get_ext(self):
        file_name, file_ext = os.path.basename(self.file.name).split('.')
        return file_ext.lower()

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

    def save(self, *args, **kwargs):
        extension = None
        try:
            extension = FileExtension.objects.get(name=self.get_ext())
        except ObjectDoesNotExist:
            extension = FileExtension.objects.create(name=self.get_ext())
        except:
            pass

        self.extension = extension
        super(UserFile, self).save(*args, **kwargs)


def auto_delete_file_on_delete(sender, **kwargs):
    instance = kwargs['instance']
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)

models.signals.post_delete.connect(auto_delete_file_on_delete, sender=UserFile)
