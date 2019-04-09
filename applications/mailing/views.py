from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from . models import Subscriber
from . forms import SubscribeForm
try:
    from .tasks import update_subscribers, create_subscriber
except:
    pass

try:
    from applications.notifications.tasks import send_notification
except ImportError:
    send_notification = None


def send_subscriber_email(request, instance):
    if send_notification is not None:
        template_context = {
            'subscriber_email': instance.email,
            'subscriber_cp_link': '{scheme}://{host}/admin/subscribers/{id}/'.format(
                scheme=request.scheme, host=request.get_host(), id=instance.id
            )
        }
        try:
            send_notification.delay('newsletters_subscription', template_context=template_context, recipient_sms=[],
                                    recipient_email=[instance.email], template_tags=['site_tags'])
        except Exception as e:
            pass


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
            if form.is_valid():
                form.save()
                create_subscriber.delay(form.instance.id)
                send_subscriber_email(request, form.instance)
                return JsonResponse({'status': True, 'message': 'Вы успешно подписались на рассылку'})
            else:
                return JsonResponse({'status': False, 'message': form.errors['email'][0]})
        else:
            subscriber.is_active = True
            subscriber.save()
            update_subscribers([subscriber.id])
            send_subscriber_email(request, subscriber)
            return JsonResponse({'status': True, 'message': 'Вы успешно восстановили подписку на рассылку'})
    else:
        return JsonResponse({'status':False, 'message': settings.COMMON_ERROR_MESSAGE})



