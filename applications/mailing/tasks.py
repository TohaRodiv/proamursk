from celery.task import task

from applications.mailing.models import Subscriber
from . mailer import mailer_api


@task
def create_subscriber(subscriber_id):
    try:
        subscriber = Subscriber.objects.get(id=subscriber_id)
    except Subscriber.DoesNotExist:
        pass
    else:
        if not subscriber.mailerlite_id:
            mailer_api.create_subscriber(subscriber)


@task
def update_subscribers(subscriber_ids):
    subscribers = Subscriber.objects.filter(id__in=subscriber_ids)
    non_sync_subscribers = subscribers.filter(mailerlite_id__isnull=True)
    if non_sync_subscribers.exists():
        for subscriber in non_sync_subscribers:
            mailer_api.create_subscriber(subscriber)
    mailer_api.update_subscribers(subscribers)

