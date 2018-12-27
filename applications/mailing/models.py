from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import BaseModel, IsActiveMixin
from applications.mailing.mailer import mailer_api


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


@receiver(post_save, sender=Subscriber)
def call_subscriber_api(sender, instance, created, **kwargs):
    post_save.disconnect(call_subscriber_api, sender=sender)
    if created and not instance.mailerlite_id:
        mailer_api.create_subscriber(instance)
    else:
        mailer_api.update_subscriber(instance)
    post_save.connect(call_subscriber_api, sender=sender)


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


@receiver(post_save, sender=MailingGroup)
def call_groups_api(sender, instance, created, **kwargs):
    post_save.disconnect(call_groups_api, sender=sender)
    if created and not instance.mailerlite_id:
        mailer_api.create_group(instance)
    else:
        mailer_api.update_group(instance)
    post_save.connect(call_groups_api, sender=sender)


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

