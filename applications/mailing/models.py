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


class MailingGroup(BaseModel, IsActiveMixin):
    name = models.CharField('Название', max_length=255)
    subscribers = models.ManyToManyField(Subscriber, related_name='groups')
    mailerlite_id = models.BigIntegerField('Mailer Lite ID', null=True)
    sync_date = models.DateTimeField('Дата и время последней синхронизации', null=True)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Группа подписчиков'
        verbose_name_plural = 'Группы подписчиков'

    def __str__(self):
        return self.name


class Campaign(BaseModel, IsActiveMixin):
    name = models.CharField('Название', max_length=255)
    send_date = models.DateTimeField('Дата и время отправки')
    subject = models.CharField('Тема письма', max_length=255)
    content = models.TextField('Содержание письма')
    mailerlite_id = models.BigIntegerField('Mailer Lite ID', null=True)
    subscribers = models.ManyToManyField(Subscriber, related_name='campaigns')
    groups = models.ManyToManyField(MailingGroup, related_name='campaigns')
    sync_date = models.DateTimeField('Дата и время последней синхронизации', null=True)
    comment = models.CharField('Комментарий', max_length=255, blank=True, default='')

    class Meta:
        verbose_name = 'Кампания рассылки'
        verbose_name_plural = 'Кампании рассылки'

    def __str__(self):
        return self.name

