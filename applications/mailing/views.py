import json

import requests
from requests_toolbelt import MultipartEncoder
from django.conf import settings
from django.http import Http404, JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.http import require_POST

from applications.mailing.models import Subscriber
from applications.sitesettings.models import Settings
from . forms import SubscribeForm


@require_POST
def subscribe(request):
    if request.is_ajax():
        form = SubscribeForm(request.POST)
        email = form.data.get('email')
        if not email:
            return JsonResponse({'status': False, 'message': 'Введите Ваш E-mail'})
        try:
            subscriber = Subscriber.objects.get(email=email, is_active=False)
        except Subscriber.DoesNotExist:
            pass
        else:
            subscriber.is_active = True
            subscriber.save()
            return JsonResponse({'status': True, 'message': 'Вы успешно восстановили подписку на рассылку'})
        if form.is_valid():
            form.save()
            mailer_api = MailerApi()
            mailer_api.create_subscriber(form.instance)
            return JsonResponse({'status': True, 'message': 'Вы успешно подписались на рассылку'})
        else:
            return JsonResponse({'status': False, 'message': form.errors['email'][0]})
    else:
        return JsonResponse({'status':False, 'message': settings.COMMON_ERROR_MESSAGE})


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

        def _delete_subscribers_from_group(subscribers_ids):
            """
            curl -v https://api.mailerlite.com/api/v2/batch \
            -F 'requests=[{"method":"GET", "path": "/api/v2/groups"}, {"method":"POST", "path": "/api/v2/groups", "body": {"name": "New group"}}]' \
            -H "x-mailerlite-apikey: fc7b8c5b32067bcd47cafb5f475d2fe9"

            """
            _data = [{
                'method': 'DELETE',
                'path': '/api/v2/groups/{group_id}/subscribers/{s_id}'.format(group_id=group.mailer_lite_id, s_id=s_id)
            } for s_id in subscribers_ids]
            _url = '{base}/batch'.format(base=self.base_url)
            _payload = MultipartEncoder({'requests': _data})
            _response = requests.post(_url, data=_payload, headers=self.headers)
            if _response.status_code == 200:
                group.sync_date = timezone.now()
                group.save()

        def _add_subscribers_to_group(subscribers):
            _payload = json.dumps({'subscribers': [{'email': subscriber.email} for subscriber in subscribers]})
            _url = '{base}/groups/{id}/subscribers/import'.format(base=self.base_url, id=group.mailerlite_id)
            _response = requests.post(_url, data=_payload, headers=self.headers)
            if _response.status_code == 200:
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
                            _delete_subscribers_from_group(subscribers_to_delete)
                        else:
                            subscribers_to_delete = list(subscribers_to_delete)
                            start = 0
                            end = self.LIMIT_BATCH_REQUESTS
                            while start < counter:
                                current_emails = subscribers_to_delete[start:end]
                                _delete_subscribers_from_group(current_emails)
                                start, end = end, end + self.LIMIT_BATCH_REQUESTS











