import json

import requests
from django.utils import timezone
from requests_toolbelt import MultipartEncoder

from applications.sitesettings.models import Settings


class MailerApi:
    LIMIT_BATCH_REQUESTS = 50

    def __init__(self):
        self.api_key = Settings.objects.first().mailer_lite_api_key
        self.base_url = 'http://api.mailerlite.com/api/v2'
        self.headers = {'X-MailerLite-ApiKey': self.api_key, 'Content-Type': 'application/json'}

    def _batch_request(self, data):
        # url = '{base}/batch'.format(base=self.base_url)
        # # payload = MultipartEncoder({'requests': data})
        # # payload = {'requests': json.dumps(data)}
        # files = {
        #     'requests': (None, data)
        # }
        # response = requests.post(url, headers=self.headers, files=json.dumps(files))
        # print(response.status_code)
        files = {
            'requests': (None, '[{"method":"GET", "path": "/api/v2/groups"}]'),
        }

        response = requests.post('https://api.mailerlite.com/api/v2/batch', headers=self.headers, files=files)
        print(response)


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

    def update_subscriber(self, subscriber):
        if self.api_key:
            if subscriber.is_active:
                payload = json.dumps({'email': subscriber.email, 'type': 'active'})
            else:
                payload = json.dumps({'email': subscriber.email, 'type': 'unsubscribed'})
            url = '{base}/subscribers/{email}'.format(base=self.base_url, email=subscriber.email)
            response = requests.put(url, data=payload, headers=self.headers)
            if response.status_code == 200:
                subscriber.sync_date = timezone.now()
                subscriber.save()

    def deactivate_subscribers(self, queryset):
        if self.api_key:
            queryset = queryset.filter(mailerlite_id__isnull=False)
            counter = queryset.count()
            subscribers_ids = list(queryset.values_list('mailerlite_id', flat=True))
            if counter <= self.LIMIT_BATCH_REQUESTS:
                data = [{
                    'method': 'PUT',
                    'path': '/api/v2/subscribers/{}'.format(subscriber_id),
                    'body': {'type': 'unsubscribed'}
                } for subscriber_id in subscribers_ids]
                self._batch_request(data)
            else:
                start, end = 0, self.LIMIT_BATCH_REQUESTS
                while start < counter:
                    current_subscribers = subscribers_ids[start:end]
                    data = [{
                        'method': 'PUT',
                        'path': '/api/v2/subscribers/{}'.format(subscriber_id),
                        'body': {'type': 'unsubscribed'}
                    } for subscriber_id in current_subscribers]
                    self._batch_request(data)
                    start, end = end, end + self.LIMIT_BATCH_REQUESTS

    def activate_subscribers(self, queryset):
        if self.api_key:
            queryset = queryset.filter(mailerlite_id__isnull=False)
            counter = queryset.count()
            subscribers_ids = list(queryset.values_list('mailerlite_id', flat=True))
            if counter <= self.LIMIT_BATCH_REQUESTS:
                data = [{
                    'method': 'PUT',
                    'path': '/api/v2/subscribers/{}'.format(subscriber_id),
                    'body': {'type': 'active'}
                } for subscriber_id in subscribers_ids]
                self._batch_request(data)
            else:
                start, end = 0, self.LIMIT_BATCH_REQUESTS
                while start < counter:
                    current_subscribers = subscribers_ids[start:end]
                    data = [{
                        'method': 'PUT',
                        'path': '/api/v2/subscribers/{}'.format(subscriber_id),
                        'body': {'type': 'active'}
                    } for subscriber_id in current_subscribers]
                    self._batch_request(data)
                    start, end = end, end + self.LIMIT_BATCH_REQUESTS

    def create_group(self, group):
        '{"id":10934346,"name":"Test Group","total":0,"active":0,"unsubscribed":0,"bounced":0,"unconfirmed":0,"junk":0,"sent":0,"opened":0,"clicked":0,"date_created":"2018-12-26 17:08:41","date_updated":"2018-12-26 17:08:41"}'
        if self.api_key:
            payload = json.dumps({'name': group.name})
            url = '{base}/groups'.format(base=self.base_url)
            response = requests.post(url, data=payload, headers=self.headers)
            if response.status_code == 201:
                data = json.loads(response.text)
                group.mailerlite_id = data.get('id')
                group.sync_date = timezone.now()
                group.save()

    def update_group(self, group):
        if self.api_key:
            payload = json.dumps({'name': group.name})
            if group.mailerlite_id:
                url = '{base}/groups/{id}'.format(base=self.base_url, id=group.mailerlite_id)
                response = requests.put(url, data=payload, headers=self.headers)
                if response.status_code == 200:
                    group.sync_date = timezone.now()
                    group.save()
            else:
                self.create_group(group)

    def delete_group(self, group_mailer_lite_id):
        if self.api_key:
            url = '{base}/groups/{id}'.format(base=self.base_url, id=group_mailer_lite_id)
            requests.delete(url, headers=self.headers)

    def update_subscribers_in_group(self, group):

        actual_subscribers = group.subscribers.filter(subscriber_mailerlite_id__isnull=False)

        def _add_subscribers_to_group(subscribers):
            payload = json.dumps({'subscribers': [{'email': subscriber.email} for subscriber in subscribers]})
            url = '{base}/groups/{id}/subscribers/import'.format(base=self.base_url, id=group.mailerlite_id)
            response = requests.post(url, data=payload, headers=self.headers)
            if response.status_code == 200:
                group.sync_date = timezone.now()
                group.save()

        if self.api_key:
            if group.mailerlite_id:
                url = '{base}/groups/{id}/subscribers'.format(base=self.base_url, id=group.mailerlite_id)
                response = requests.get(url, headers=self.headers)
                if response.status_code == 200:
                    data = response.json()
                    received_subscribers = set(item['id'] for item in data)
                    subscribers_to_delete = received_subscribers.difference(set(actual_subscribers.values_list('mailerlite_id', flat=True)))
                    subscribers_to_add = actual_subscribers.exclude(mailerlite_id__in=received_subscribers)
                    if subscribers_to_add:
                        _add_subscribers_to_group(subscribers_to_add)

                    if subscribers_to_delete:
                        counter = len(subscribers_to_delete)
                        if counter <= self.LIMIT_BATCH_REQUESTS:
                            data = [{
                                'method': 'DELETE',
                                'path': '/api/v2/groups/{group_id}/subscribers/{s_id}'.format(
                                    group_id=group.mailer_lite_id, s_id=s_id)
                            } for s_id in subscribers_to_delete]
                            self._batch_request(data)
                        else:
                            subscribers_to_delete = list(subscribers_to_delete)
                            start, end = 0, self.LIMIT_BATCH_REQUESTS
                            while start < counter:
                                current_ids = subscribers_to_delete[start:end]
                                data = [{
                                    'method': 'DELETE',
                                    'path': '/api/v2/groups/{group_id}/subscribers/{s_id}'.format(
                                        group_id=group.mailer_lite_id, s_id=s_id)
                                } for s_id in current_ids]
                                self._batch_request(data)
                                start, end = end, end + self.LIMIT_BATCH_REQUESTS


mailer_api = MailerApi()

