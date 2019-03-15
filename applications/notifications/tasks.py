from celery.task import task
from .views import NotificationSender


@task(max_retries=3)
def send_notification(name, template_context=None, template_tags=None, recipient_email=None,
                      recipient_sms=None, attachments=None):
    notifications = NotificationSender(name,
                                       template_context=template_context,
                                       template_tags=template_tags,
                                       recipient_email=recipient_email,
                                       recipient_sms=recipient_sms,
                                       attachments=attachments)
    notifications.send()
