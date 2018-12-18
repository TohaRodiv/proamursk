# -*-coding: utf-8 -*-
from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.contrib.sessions.models import Session
from django.db import models
from django.core import validators
from django.db.models import Q
from django.utils import timezone
from django.core.mail import send_mail
from django.contrib.auth.models import (BaseUserManager, AbstractBaseUser,
                                        PermissionsMixin, Group, Permission)


class AccountManager(BaseUserManager):

    def _create_user(self, username, email, password,
                     is_staff, is_superuser, **extra_fields):
        """
        Creates and saves a User with the given username, email and password.
        """
        now = timezone.now()
        if not username:
            raise ValueError('Не заполнено поле Имя пользователя')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser, last_login=now,
                          create_date=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        return self._create_user(username, email, password, False, False,
                                 **extra_fields)

    def create_superuser(self, username, email, password, **extra_fields):
        return self._create_user(username, email, password, True, True,
                                 **extra_fields)


class AbstractAccount(AbstractBaseUser, PermissionsMixin):
    username = models.CharField('Логин', max_length=255, unique=True)
    first_name = models.CharField('Имя', max_length=255, blank=True)
    last_name = models.CharField('Фамилия', max_length=255, blank=True)
    patronymic = models.CharField('Отчество', max_length=255, blank=True, default='')
    email = models.EmailField('Email', blank=True)
    is_staff = models.BooleanField('Статус персонала', default=True)
    is_active = models.BooleanField('Состояние', default=True)
    avatar = models.ForeignKey('mediafiles.MediaFile', blank=True, null=True, verbose_name='Аватар',
                               on_delete=models.SET_NULL)
    create_date = models.DateTimeField('Дата создания', auto_now_add=True)
    edit_date = models.DateTimeField('Дата изменения', auto_now=True)
    request_change_password = models.BooleanField('Запросить изменение пароля', default=False)
    objects = AccountManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        abstract = True
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['first_name', 'last_name']

    def get_full_name(self):
        full_name = '{} {}'.format(self.last_name, self.first_name)
        return full_name.strip()

    def get_first_last_name(self):
        full_name = '{} {}'.format(self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def __str__(self):
        return '{} {} / {}'.format(self.first_name, self.last_name, self.email)


class User(AbstractAccount):
    roles = models.ManyToManyField('cp_vue.CpRole', related_name='users')

