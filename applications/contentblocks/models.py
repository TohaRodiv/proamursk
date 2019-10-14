# -*-coding: utf-8 -*-

from django.db import models
from django.urls import reverse
from applications.mediafiles.models import MediaFile
from core.models import BaseModel, BaseSeoMixin


class Page(BaseModel, BaseSeoMixin):
    name = models.CharField(u'Название', max_length=255)
    codename = models.CharField(u'Кодовое название страницы', max_length=255)
    have_content = models.BooleanField(u'Имеет контент для редактирования', default=False)
    admin_form_config = models.TextField(u'Конфиг формы для админки', blank=True)
    _field_blocks = []

    def __str__(self):
        return self.name

    def __getattr__(self, name):
        if not name.startswith('_'):
            if name in self.get_fields_names():
                return dict([(i.codename, i.content) for i in self.get_available_fields()]).get(name, '')

        raise AttributeError('%s does not have attribute named "%s".' %
                             (self._meta.object_name, name))

    def __init__(self, *args, **kwargs):
        super(Page, self).__init__(*args, **kwargs)
        self._field_blocks = list(self.blocks.all())

    def get_available_fields(self):
        return self._field_blocks

    def get_fields_names(self):
        fields = self.get_available_fields()
        return [i.codename for i in fields]

    def get_absolute_url(self):
        try:
            return reverse(self.codename)
        except:
            return ''

    class Meta:
        verbose_name = u'Статическая страница'
        verbose_name_plural = u'Статические страницы'
        ordering = ['name']


class ContentBlock(models.Model):
    TYPES = (
        (u'string', u'Короткий текст'),
        (u'text', u'Длинный текст'),
        (u'url', u'Ссылка'),
        (u'mediafile', u'Изображение'),
        (u'bool', u'Бул'),
    )
    codename = models.CharField(u'Кодовое название', max_length=255)
    page = models.ForeignKey(Page, related_name='blocks', verbose_name=u'Страница', on_delete=models.CASCADE)
    data_type = models.CharField(u'Тип блока', max_length=255, choices=TYPES)
    content_string = models.CharField(u'Текст', max_length=255, blank=True)
    content_text = models.TextField(u'Параграф', blank=True)
    content_url = models.URLField(u'Ссылка', blank=True)
    content_bool = models.BooleanField(u'Бул', blank=True, default=False)
    content_mediafile = models.ForeignKey(MediaFile, verbose_name=u'Медиафайл', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.codename

    class Meta:
        verbose_name = u'Контент блок'
        verbose_name_plural = u'Контент блоки'
        ordering = ['codename']
        unique_together = ['page', 'codename']

    def get_attribute_name(self):
        return 'content_%s' % self.data_type

    def _get_value(self):
        attribute = self.get_attribute_name()
        if attribute:
            attribute = getattr(self, attribute)
        return attribute

    def _set_value(self, new_value):
        attribute = self.get_attribute_name()
        if attribute:
            setattr(self, attribute, new_value)

    content = property(_get_value, _set_value)

