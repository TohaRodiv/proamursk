# -*- coding: utf-8 -*-
from django.db import models


class CheckRequest(models.Model):
    check_datetime = models.DateTimeField('Дата и время проверки', auto_now=True)
    host = models.CharField('Хост', max_length=255)
    session = models.CharField('Сессия', max_length=255)
    view = models.CharField('Представление', max_length=255)
    url = models.CharField('Ссылка', max_length=255)

    class Meta:
        verbose_name = 'Проверка запроса'
        verbose_name_plural = 'Проверки запросов'


class BanRequest(models.Model):
    start_datetime = models.DateTimeField('Дата и время добавления', auto_now=True)
    host = models.CharField('Хост', max_length=255, blank=True)
    session = models.CharField('Сессия', max_length=255, blank=True)
    view = models.CharField('Представление', max_length=255)
    url = models.CharField('Ссылка', max_length=255)

    class Meta:
        verbose_name = 'Бан'
        verbose_name_plural = 'Бан'
