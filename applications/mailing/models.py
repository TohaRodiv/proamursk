from django.db import models

from core.models import BaseModel, IsActiveMixin


class Subscriber(BaseModel, IsActiveMixin):
    email = models.EmailField('E-mail', unique=True)
    mailerlite_id = models.BigIntegerField('Mailer Lite ID', null=True)
    sync_date = models.DateTimeField('Дата и время последней синхронизации', null=True)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Подписчик'
        verbose_name_plural = 'Подписчики'

    def __str__(self):
        return self.email


class Campaign(BaseModel):
    name = models.CharField('Название', max_length=255)
    content = models.TextField('Содержание письма')
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Шаблон рассылки'
        verbose_name_plural = 'Шаблоны рассылок'

    def __str__(self):
        return self.name
