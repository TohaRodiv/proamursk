import json

import requests
from django.utils import timezone

from applications.sitesettings.models import Settings


class MailerApi:

    def __init__(self):
        self.api_key = Settings.objects.first().mailer_lite_api_key
        self.base_url = 'http://api.mailerlite.com/api/v2'
        self.headers = {'X-MailerLite-ApiKey': self.api_key, 'Content-Type': 'application/json'}

    def create_subscriber(self, subscriber):
        if self.api_key:
            payload = json.dumps({'email': subscriber.email})
            url = '{base}/subscribers'.format(base=self.base_url)
            response = requests.post(url, data=payload, headers=self.headers)
            if response.status_code == 200:
                data = json.loads(response.text)
                subscriber.mailerlite_id = data.get('id')
                subscriber.sync_date = timezone.now()
                subscriber.save()

    def update_subscribers(self, subscribers):
        if self.api_key:
            for subscriber in subscribers:
                if subscriber.is_active:
                    payload = json.dumps({'email': subscriber.email, 'type': 'active'})
                else:
                    payload = json.dumps({'email': subscriber.email, 'type': 'unsubscribed'})
                url = '{base}/subscribers/{email}'.format(base=self.base_url, email=subscriber.email)
                response = requests.put(url, data=payload, headers=self.headers)
                if response.status_code == 200:
                    subscriber.sync_date = timezone.now()
                    subscriber.save()


mailer_api = MailerApi()

