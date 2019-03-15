import json

import requests
from celery.task import task
from django.utils import timezone
from django.conf import settings
from django.core import mail
from django.core.mail import EmailMessage
from applications.mailing.models import Subscriber
from applications.sitesettings.models import Settings


if Settings.objects.exists() and Settings.objects.first().mailer_lite_api_key:
    API_KEY = Settings.objects.first().mailer_lite_api_key
else:
    API_KEY = None

BASE_URL = 'http://api.mailerlite.com/api/v2'
HEADERS = {'X-MailerLite-ApiKey': API_KEY, 'Content-Type': 'application/json'}


@task
def create_subscriber(subscriber_id):
    try:
        subscriber = Subscriber.objects.get(id=subscriber_id)
    except Subscriber.DoesNotExist:
        pass
    else:
        if not subscriber.mailerlite_id:
            if API_KEY is not None:
                payload = json.dumps({'email': subscriber.email})
                url = '{base}/subscribers'.format(base=BASE_URL)
                response = requests.post(url, data=payload, headers=HEADERS)
                if response.status_code == 200:
                    data = json.loads(response.text)
                    subscriber.mailerlite_id = data.get('id')
                    subscriber.sync_date = timezone.now()
                    subscriber.save()


@task
def update_subscribers(subscriber_ids):
    if API_KEY is not None:
        subscribers = Subscriber.objects.filter(id__in=subscriber_ids)
        non_sync_subscribers = subscribers.filter(mailerlite_id__isnull=True)
        if non_sync_subscribers.exists():
            for subscriber in non_sync_subscribers:
                create_subscriber(subscriber)

        for subscriber in subscribers:
            if subscriber.is_active:
                payload = json.dumps({'email': subscriber.email, 'type': 'active'})
            else:
                payload = json.dumps({'email': subscriber.email, 'type': 'unsubscribed'})
            url = '{base}/subscribers/{email}'.format(base=BASE_URL, email=subscriber.email)
            response = requests.put(url, data=payload, headers=HEADERS)
            if response.status_code == 200:
                subscriber.sync_date = timezone.now()
                subscriber.save()


@task(max_retries=3)
def send_email(subject, template, emails):
    msg = EmailMessage(subject, template, settings.DEFAULT_FROM_EMAIL, emails)
    msg.content_subtype = 'html'
    connection = mail.get_connection()
    connection.send_messages([msg])

