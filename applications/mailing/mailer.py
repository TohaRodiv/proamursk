import json

import requests
from django.utils import timezone

from applications.sitesettings.models import Settings


class MailerApi:
    LIMIT_BATCH_REQUESTS = 50

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

    def create_group(self, group):
        if self.api_key:
            payload = json.dumps({'name': group.name})
            url = '{base}/groups'.format(base=self.base_url)
            response = requests.post(url, data=payload, headers=self.headers)
            if response.status_code == 201:
                data = json.loads(response.text)
                group.mailerlite_id = data.get('id')
                group.sync_date = timezone.now()
                group.save()
                if group.subscribers.exists():
                    self.update_subscribers_in_group(group)

    def update_group_name(self, group):
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

    def delete_groups(self, group_mailerlite_ids):
        if self.api_key and group_mailerlite_ids and isinstance(group_mailerlite_ids, list):
            for group_id in group_mailerlite_ids:
                url = '{base}/groups/{id}'.format(base=self.base_url, id=group_id)
                requests.delete(url, headers=self.headers)

    def update_subscribers_in_group(self, group):

        def _add_subscribers_to_group(subscribers):
            payload = json.dumps({'subscribers': [{'email': subscriber.email} for subscriber in subscribers]})
            url = '{base}/groups/{id}/subscribers/import'.format(base=self.base_url, id=group.mailerlite_id)
            requests.post(url, data=payload, headers=self.headers)

        def _delete_subscriber_from_group(subscriber_id):
            url = '{base}/groups/{group_id}/subscribers/{subscriber_id}'.format(base=self.base_url,
                                                                                group_id=group.mailerlite_id,
                                                                                subscriber_id=subscriber_id)
            requests.delete(url, headers=self.headers)

        if self.api_key:
            if group.mailerlite_id:
                subscribers = group.subscribers.all()
                url = '{base}/groups/{id}/subscribers'.format(base=self.base_url, id=group.mailerlite_id)
                response = requests.get(url, headers=self.headers)
                if response.status_code == 200:
                    data = response.json()
                    received_subscribers = set(item['id'] for item in data)

                    if not subscribers.exists():
                        for subscriber_id in received_subscribers:
                            _delete_subscriber_from_group(subscriber_id)

                    else:
                        non_sync_subscribers = subscribers.filter(mailerlite_id__isnull=True)

                        if non_sync_subscribers.exists():
                            for subscriber in non_sync_subscribers:
                                self.create_subscriber(subscriber)

                        subscribers_to_delete = received_subscribers.difference(
                            set(subscribers.values_list('mailerlite_id', flat=True)))
                        subscribers_to_add = subscribers.exclude(mailerlite_id__in=received_subscribers)
                        if subscribers_to_add:
                            _add_subscribers_to_group(subscribers_to_add)

                        if subscribers_to_delete:
                            for subscriber_id in subscribers_to_delete:
                                _delete_subscriber_from_group(subscriber_id)
                    group.sync_date = timezone.now()
                    group.save()


mailer_api = MailerApi()

