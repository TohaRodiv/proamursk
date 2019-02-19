# -*-coding: utf-8 -*-

import uuid
from datetime import datetime
from django.db import models
from core.models import BaseModel
from applications.mediafiles.models import MediaFile


def get_file_path(instance, filename):
    file_name = '%s.%s' % (str(format(uuid.uuid4())), filename.split('.')[-1])
    dir_name = str(format(uuid.uuid4()))
    path = '/'.join(['files', dir_name, file_name])
    return path


class Settings(BaseModel):
    mailer_lite_api_key = models.CharField('Mailer Lite API key', max_length=255, blank=True)
    instagram = models.CharField('Профиль в Instagram', max_length=255, blank=True)
    odnoklassniki = models.CharField('Группа в Одноклассниках', max_length=255, blank=True)

    copyright = models.TextField('Копирайт', blank=True)

    yandex_count = models.TextField('Код счетчика Yandex', blank=True)
    google_count = models.TextField('Код счетчика Google', blank=True)
    meta_tags = models.TextField('Дополнительные Мета-теги', blank=True)
    robots = models.TextField('Содержимое файла robots.txt', blank=True)

    disable_site = models.BooleanField('Включить режим разработки', default=False)
    disable_title = models.CharField('Заголовок', max_length=255, blank=True)
    disable_text = models.TextField('Текст сообщения', blank=True)

    def __str__(self):
        return 'Settings'

    def natural_key(self):
        return {'id': self.pk, 'name': 'Settings'}

    class Meta:
        verbose_name = 'Настройки сайта'
        verbose_name_plural = 'Настройки сайта'
