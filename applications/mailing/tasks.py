from celery.task import task

from applications.mailing.models import Subscriber, MailingGroup
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


@task
def create_group(group_id):
    try:
        group = MailingGroup.objects.get(id=group_id)
    except MailingGroup.DoesNotExist:
        pass
    else:
        if not group.mailerlite_id:
            mailer_api.create_group(group)


@task
def update_group(group_id, name_updated=False, subscribers_updated=False):
    try:
        group = MailingGroup.objects.get(id=group_id)
    except MailingGroup.DoesNotExist:
        pass
    else:
        if group.mailerlite_id:
            if name_updated:
                mailer_api.update_group_name(group)
            if subscribers_updated:
                mailer_api.update_subscribers_in_group(group)


@task
def delete_groups(mailerlite_ids):
    mailer_api.delete_groups(mailerlite_ids)

