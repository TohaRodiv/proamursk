# -*-coding: utf-8 -*-

from datetime import datetime
from django.conf import settings
from django.db import models
from django.contrib.postgres.fields import JSONField
from core.models import BaseModel, IsActiveMixin
from cp_vue.models import CpRole


class Action(BaseModel, IsActiveMixin):
    name = models.CharField('Название', max_length=255)
    codename = models.CharField('Кодовое имя', max_length=255, unique=True)
    comment = models.TextField('Комментарий', blank=True)

    class Meta:
        verbose_name = 'Тип уведомления'
        verbose_name_plural = 'Типы уведомлений'

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'name': self.name}


class Channel(models.Model):
    name = models.CharField('Шаблон', max_length=255)
    codename = models.CharField('Кодовое имя', max_length=255, unique=True)

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'name': self.name}

    class Meta:
        verbose_name = 'Способ отправки'
        verbose_name_plural = 'Способы отправки'


class Variable(models.Model):
    VAR_TYPES = (
        ('var', 'Переменная'),
        ('tag', 'Шаблонный тег')
    )
    CONTENT_TYPES = (
        ('text', 'Текст'),
        ('link', 'Ссылка'),
        ('email', 'Email')
    )
    action = models.ForeignKey(Action, on_delete=models.CASCADE, verbose_name='Событие', related_name='variables')
    channels = models.ManyToManyField(Channel, verbose_name='Канал', blank=True)
    name = models.CharField('Название', max_length=255)
    codename = models.CharField('Кодовое имя', max_length=255)
    construction_type = models.CharField('Тип конструкции', max_length=255, choices=VAR_TYPES)
    content_type = models.CharField('Тип содержимого', max_length=255, choices=CONTENT_TYPES, blank=True)
    weight = models.PositiveIntegerField('Порядок', default=0)
    comment = models.TextField('Комментарий', blank=True)

    def __str__(self):
        if self.construction_type == 'var':
            name = '{{ %s }} — %s%s' % (self.codename, self.name, (' / %s' % dict(self.CONTENT_TYPES).get(
                self.content_type)) if self.content_type and self.content_type != 'text' else '')
        else:
            name = '{{% {} %}} — {}{}'.format(self.codename, self.name, (' / %s' % dict(self.CONTENT_TYPES).get(
                self.content_type)) if self.content_type and self.content_type != 'text' else '')

        return name

    def natural_key(self):
        return {'id': self.pk, 'name': self.action.name}

    class Meta:
        verbose_name = 'Переменная'
        verbose_name_plural = 'Переменные'
        ordering = ['weight']


class Recipient(BaseModel, IsActiveMixin):
    name = models.CharField('Название', max_length=255)
    channel = models.ForeignKey(Channel, verbose_name='Способ отправки', on_delete=models.CASCADE)
    email = models.EmailField('Email', max_length=255, blank=True)
    phone = models.CharField('Телефон', max_length=255, blank=True)
    telegram_chat_id = models.CharField('Telegram Chat ID', max_length=255, blank=True)
    comment = models.TextField('Комментарий', blank=True)

    def __str__(self):
        return '%s / %s' % (self.name, self.phone if self.phone else self.email)

    def natural_key(self):
        return {'id': self.pk, 'name': self.name}

    class Meta:
        verbose_name = 'Получатель уведомлений'
        verbose_name_plural = 'Получатели уведомлений'


class Notifications(BaseModel, IsActiveMixin):
    name = models.CharField('Шаблон', max_length=255)
    action = models.ForeignKey(Action, verbose_name='Событие', on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, verbose_name='Способ отправки', on_delete=models.CASCADE)
    subject = models.CharField('Тема письма', max_length=255, blank=True)
    text = models.TextField(verbose_name='Текст сообщения')
    roles = models.ManyToManyField(CpRole, verbose_name='Роли пользователей', blank=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, verbose_name='Пользователи', blank=True)
    recipients = models.ManyToManyField(Recipient, verbose_name='Получатели', blank=True)
    comment = models.TextField('Комментарий', blank=True)

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'name': self.name}

    class Meta:
        verbose_name = 'Шаблон уведомления'
        verbose_name_plural = 'Шаблоны уведомлений'


class HtmlTemplate(BaseModel):
    name = models.CharField('Название', max_length=255)
    text = models.TextField(verbose_name='HTML код')
    comment = models.TextField('Комментарий', blank=True)

    def __str__(self):
        return self.name

    def natural_key(self):
        return {'id': self.pk, 'name': self.name}

    class Meta:
        db_table = 'notifications_html_template'
        verbose_name = 'HTML шаблон'
        verbose_name_plural = 'HTML шаблоны'