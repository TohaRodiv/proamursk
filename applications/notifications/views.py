# -*-coding:utf-8 -*-

import re
import requests
import hashlib
import itertools

from django.conf import settings
from django.core import mail
from django.core.mail import EmailMessage
from django.template import Context, Template
from django.template.loader import get_template
from django.utils.safestring import mark_safe
from django.utils.text import normalize_newlines
from applications.accounts.models import User
from .models import Notifications, Variable


class NotificationSender(object):

    def __init__(self, name, template_context=None, template_tags=None, **kwargs):
        self.notifications = {}
        self.params = kwargs
        self.name = name

        if template_context:
            assert isinstance(template_context, dict), '"template_context" argument must be a dict'
            self.template_context = template_context
        else:
            self.template_context = {}

        if template_tags:
            assert isinstance(template_tags, (list, tuple)), '"template_tags" argument must be a list or tuple'
            self.template_tags = template_tags
        else:
            self.template_tags = []
        self.template_tags.append('notification_tags')

        action_variables = Variable.objects.select_related('action').filter(action__codename=name)
        self.allowed_variables = {}
        for variable in action_variables:
            self.allowed_variables[variable.codename] = {'content_type': variable.content_type,
                                                         'construction_type': variable.construction_type}
        self.set_notifications()

    def set_notifications(self):
        notifications = Notifications.objects.prefetch_related(
            'users', 'roles').select_related().filter(is_active=True, action__is_active=True, action__codename=self.name)

        for notification in notifications:
            self.add_notification(notification)

    def add_notification(self, notification):
        if notification.channel.codename not in self.notifications:
            self.notifications[notification.channel.codename] = []
        notification_obj = self.make_notification(notification)

        if notification_obj:
            self.notifications[notification.channel.codename].append(notification_obj)

    def make_notification(self, notification):
        context = dict(domain=settings.ROOT_LINK if hasattr(settings, 'ROOT_LINK') else '')
        result = None
        recipients = self.get_notification_recipients(notification)
        if not recipients:
            return None

        if notification.channel.codename == 'email':
            for k, v in self.template_context.items():
                # if k.startswith('__') or k in self.allowed_variables:
                context[k] = v
            subject = self.render_string(notification.subject, context)
            text = self.render_string(self.linebreaksbr(notification.text), context)
            template = get_template("notifications/email/email.html")
            context = dict(text=text, domain=settings.ROOT_LINK if hasattr(settings, 'ROOT_LINK') else '')
            result = EmailMessage(subject, template.render(context), settings.DEFAULT_FROM_EMAIL, recipients)
            # if 'attachments' in self.params and isinstance(self.params['attachments'], (list, tuple)):
            #     for a in self.params['attachments']:
            #         try:
            #             file_path = a['path']
            #             file_type = a['type']
            #             file_name = a['name']
            #             attachment = open(file_path, 'rb')
            #         except:
            #             pass
            #         else:
            #             result.attach(file_name, attachment.read(), file_type)
            result.content_subtype = 'html'
        elif notification.channel.codename == 'sms':
            context = dict([(k, v) for k, v in self.template_context.items() if k in self.allowed_variables])
            text = self.render_string(notification.text, context)
            result = SmsCenterMessage(recipients, text)

        return result

    def get_notification_recipients(self, notification):
        users = notification.users.filter(is_staff=True, is_active=True)
        groups = notification.roles.all()
        other_recipients = notification.recipients.filter(is_active=True)
        group_users = User.objects.filter(roles__in=groups, is_staff=True, is_active=True)

        users_for_send = list(itertools.chain(users, group_users, other_recipients))
        is_client_notification = not notification.users.all().exists() and not notification.roles.all().exists() and not notification.recipients.all().exists()

        recipients = []
        if users_for_send:
            if notification.channel.codename == 'sms':
                recipients = list(
                    set([self.make_phone_number(u.phone) for u in users_for_send if u.phone and u.is_active]))
            elif notification.channel.codename == 'email':
                recipients = list(set([u.email for u in users_for_send if u.email and u.is_active]))
        elif is_client_notification:
            key = 'recipient_%s' % notification.channel.codename
            recipients = self.params.get(key, [])
            if notification.channel.codename == 'sms':
                clear_recipients = []
                for recipient in recipients:
                    phone = self.make_phone_number(recipient)
                    if phone is not None:
                        clear_recipients.append(phone)

                recipients = clear_recipients
        return recipients

    def make_phone_number(self, number):
        phone = ''.join(i for i in number if i.isdigit())
        if not (phone.startswith('7') and len(phone) == 11):
            phone = None
        return phone

    def render_string(self, string, context):
        load_string = r''
        if self.template_tags:
            for tag in self.template_tags:
                load_string += r'{{% load {} %}}'.format(tag)

        string = load_string + string
        template = Template(string)
        context = Context(context)
        return template.render(context)

    def linebreaksbr(self, value):
        value = normalize_newlines(value)
        return mark_safe(value.replace('\n', '<br />\n'))

    def send(self):
        for channel, notifications in self.notifications.items():
            if channel == 'email':
                connection = mail.get_connection()
                connection.send_messages(notifications)
            elif channel == 'sms':
                for notification in notifications:
                    notification.send()


class SmsRuMessage(object):
    """
    Add to settings.py parameters:
    SMSRU_API_ID - Api id for account
    SMSAERO_FROM - name for sms sender
    """
    phone_re = r'^7\d{10}$'
    api_link = 'http://sms.ru/sms/send'
    recipients = []
    api_id = None
    sms_from = None

    def __init__(self, recipients, message):
        self.recipients = self.clear_recipients(recipients)
        self.message = str(message)
        self.set_api_params()

    def clear_recipients(self, recipients):
        clear_data = []
        if isinstance(recipients, (list, tuple)):
            for recipient in recipients:
                if re.match(self.phone_re, recipient) is not None:
                    clear_data.append(recipient)
        elif isinstance(recipients, (str, int)):
            recipients = str(recipients)
            if re.match(self.phone_re, recipients) is not None:
                    clear_data.append(recipients)
        return clear_data

    def set_api_params(self):
        if not hasattr(settings, 'SMSRU_API_ID'):
            raise TypeError('Empty API_ID for SMSRU')

        if hasattr(settings, 'SMSRU_FROM'):
            self.sms_from = settings.SMSRU_FROM

        self.api_id = settings.SMSRU_API_ID

    def send(self):
        if self.recipients:
            if len(self.recipients) > 100:
                x = 0
                while x < len(self.recipients):
                    self.send_message(self.recipients[x:x+100])
                    x += 100
            else:
                self.send_message(self.recipients)

    def send_message(self, to):
        to = ','.join(to)
        query = {'api_id': self.api_id,
                 'to': to,
                 'text': self.message}
        if self.sms_from:
            query['from'] = self.sms_from
        try:
            request = requests.get(self.api_link, params=query)
        except requests.exceptions.RequestException as e:
            pass
        else:
            pass


class SmsAeroMessage(object):
    phone_re = r'^7\d{10}$'
    api_link = 'https://gate.smsaero.ru/send/'
    recipients = []
    user = None
    password = None
    sms_from = None

    def __init__(self, recipients, message):
        self.recipients = self.clear_recipients(recipients)
        self.message = str(message)
        self.set_api_params()

    def clear_recipients(self, recipients):
        clear_data = []
        if isinstance(recipients, (list, tuple)):
            for recipient in recipients:
                if re.match(self.phone_re, recipient) is not None:
                    clear_data.append(recipient)
        elif isinstance(recipients, (str, int)):
            recipients = str(recipients)
            if re.match(self.phone_re, recipients) is not None:
                    clear_data.append(recipients)
        return clear_data

    def set_api_params(self):
        if not hasattr(settings, 'SMSAERO_USER') and not hasattr(settings, 'SMSAERO_PASSWORD'):
            raise TypeError('Empty user and password for SMSAERO')

        if not hasattr(settings, 'SMSAERO_FROM'):
            raise TypeError('Empty from parameter for SMSAERO')

        self.user = settings.SMSAERO_USER
        self.password = hashlib.md5(settings.SMSAERO_PASSWORD).hexdigest()
        self.sms_from = settings.SMSAERO_FROM

    def send(self):
        if self.recipients:
            for recipient in self.recipients:
                self.send_message(recipient)

    def send_message(self, to):
        query = {'answer': 'json',
                 'user': self.user,
                 'password': self.password,
                 'to': to,
                 'from': self.sms_from,
                 'text': self.message}
        try:
            request = requests.get(self.api_link, params=query)
        except requests.exceptions.RequestException as e:
            pass
        else:
            pass


class ArambaSmsMessage(object):
    """
    Add to settings.py parameters:
    ARAMBA_API_KEY - Api id for account
    ARAMBA_FROM - name for sms sender
    """
    phone_re = r'^7\d{10}$'
    api_link = 'https://api.aramba.ru'
    recipients = []
    api_key = None
    sms_from = None

    def __init__(self, recipients, message):
        self.recipients = self.clear_recipients(recipients)
        self.message = str(message)
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
        if not hasattr(settings, 'ARAMBA_API_KEY'):
            raise TypeError('Empty API_KEY for ARAMBA')

        if hasattr(settings, 'ARAMBA_FROM'):
            self.sms_from = settings.ARAMBA_FROM

        self.api_key = settings.ARAMBA_API_KEY

    def send(self):
        if self.recipients:
            for r in self.recipients:
                self.send_message(r)

    def send_message(self, to):
        query = {'apiKey': self.api_key,
                 'PhoneNumber': to,
                 'Text': self.message}
        if self.sms_from:
            query['SenderId'] = self.sms_from
        url = self.api_link + '/singleSms'
        try:
            request = requests.get(url, params=query)
        except requests.exceptions.RequestException as e:
            pass
        else:
            pass


class SmsCenterMessage(object):
    phone_re = r'^7\d{10}$'
    api_link = 'https://smsc.ru/sys/'
    recipients = []
    login = u''
    password = u''

    def __init__(self, recipients, message):
        self.recipients = self.clear_recipients(recipients)
        self.message = str(message)
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
        if (not hasattr(settings, 'SMSCENTER_LOGIN') and not hasattr(settings, 'SMSCENTER_PASSWORD')
                and settings.SMSCENTER_LOGIN and settings.SMSCENTER_PASSWORD):
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