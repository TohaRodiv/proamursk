# -*-coding:utf-8 -*-

import re
import requests

from django.conf import settings
from django.core import mail
from django.core.mail import EmailMessage
from django.template import Context, Template
from django.template.loader import get_template
from django.utils.safestring import mark_safe
from django.utils.text import normalize_newlines


class SmsCenterMessage(object):
    phone_re = r'^7\d{10}$'
    api_link = 'https://smsc.ru/sys/'
    recipients = []
    login = u''
    password = u''

    def __init__(self, recipients, message):
        self.recipients = self.clear_recipients(recipients)
        self.message = str(message).encode('utf-8')
        self.set_api_params()

    def clear_recipients(self, recipients):
        clear_data = []
        if isinstance(recipients, (list, tuple)):
            for recipient in recipients:
                recipient = ''.join(i for i in recipient if i.isdigit())
                if re.match(self.phone_re, recipient) is not None:
                    clear_data.append(recipient)
        elif isinstance(recipients, (str, int)):
            recipients = str(''.join(i for i in recipients if i.isdigit()))
            if re.match(self.phone_re, recipients) is not None:
                    clear_data.append(recipients)
        return clear_data

    def set_api_params(self):
        if not hasattr(settings, 'SMSCENTER_LOGIN') and not hasattr(settings, 'SMSCENTER_PASSWORD') and settings.SMSCENTER_LOGIN and settings.SMSCENTER_PASSWORD:
            raise TypeError('Empty SMSCENTER_LOGIN and SMSCENTER_LOGIN')
        else:
            self.login = settings.SMSCENTER_LOGIN
            self.password = settings.SMSCENTER_PASSWORD

    def send(self):
        if self.recipients:
            for r in self.recipients:
                self.send_message(r)

    def send_message(self, to):
        query = {'login': self.login,
                 'psw': self.password,
                 'phones': to,
                 'charset': 'utf-8',
                 'mes': self.message}
        if hasattr(settings, 'SMSCENTER_SENDER'):
            query['sender'] = settings.SMSCENTER_SENDER
        url = self.api_link + 'send.php'
        try:
            request = requests.get(url, params=query)
        except requests.exceptions.RequestException as e:
            pass
        else:
            pass


class SmsCenterContacts(object):
    phone_re = r'^7\d{10}$'
    api_link = 'https://smsc.ru/sys/'
    login = u''
    password = u''

    def __init__(self):
        self.set_api_params()

    def set_api_params(self):
        if not hasattr(settings, 'SMSCENTER_LOGIN') and not hasattr(settings, 'SMSCENTER_PASSWORD') and settings.SMSCENTER_LOGIN and settings.SMSCENTER_PASSWORD:
            raise TypeError('Empty SMSCENTER_LOGIN and SMSCENTER_LOGIN')
        else:
            self.login = settings.SMSCENTER_LOGIN
            self.password = settings.SMSCENTER_PASSWORD

    def send_request(self, method, api_url, params={}, data={}, files={}, headers={}):
        response = None
        try:
            func = getattr(requests, method)
            kwargs = dict()
            if params:
                kwargs['params'] = params
            if data:
                kwargs['data'] = data
            if files:
                kwargs['files'] = files
            response = func(api_url,
                            headers=headers,
                            timeout=10,
                            **kwargs)
        except Exception as e:
            pass

        return response

    def clear_phone(self, phone):
        return u''.join([i for i in phone if i.isdigit()])

    def add_contact(self, phone, name):
        phone = self.clear_phone(phone)
        query = {
            'login': self.login,
            'psw': self.password,
            'add': 1,
            'phone': phone,
            'name': str(name),
            'charset': 'utf-8',
            'fmt': 3
        }
        url = self.api_link + 'phones.php'
        response = self.send_request('post', url, query)

    def add_group(self, name):
        query = {
            'login': self.login,
            'psw': self.password,
            'add_group': 1,
            'name': name,
            'charset': 'utf-8',
            'fmt': 3
        }
        url = self.api_link + 'phones.php'
        response = self.send_request('post', url, query)
        try:
            data = response.json()
        except Exception as e:
            data = None

        return data

    def get_groups(self):
        query = {
            'login': self.login,
            'psw': self.password,
            'get_group': 1,
            'charset': 'utf-8',
            'fmt': 3
        }
        url = self.api_link + 'phones.php'
        response = self.send_request('post', url, query)
        try:
            data = response.json()
        except Exception as e:
            data = None

        return data

    def add_contact_to_group(self, phone, group_id):
        phone = self.clear_phone(phone)
        query = {
            'login': self.login,
            'psw': self.password,
            'move_group': 2,
            'phone': phone,
            'grp': group_id,
            'charset': 'utf-8',
            'fmt': 3
        }
        url = self.api_link + 'phones.php'
        response = self.send_request('post', url, query)
