import json
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt

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
            return JsonResponse({'status': True, 'message': 'Вы успешно восстановили подписку на рассылку'})
    else:
        return JsonResponse({'status':False, 'message': settings.COMMON_ERROR_MESSAGE})

@csrf_exempt
@require_POST
def webhook_handler(request):
    try:
        payload = json.loads(request.body)
    except:
        return HttpResponse(status=400)
    else:

        send_mail(
            'url_data',
            'DATA:\n%s \n\n' % (payload,),
            'no-reply@perfectura.ru',
            ['scamp.khb@list.ru'],
            fail_silently=True,
        )

        events = payload.get('events', [])

        for e in events:
            e_type = e.get('type')
            data = e.get('data')
            subscriber = data.get('subscriber')

            if e_type == 'subscriber.create':
                Subscriber.objects.create(email=subscriber.get('email'), mailerlite_id=subscriber.get('id'),
                                          is_active=True)
            elif e_type == 'subscriber.update':
                try:
                    obj = Subscriber.objects.get(mailerlite_id=subscriber.get('id'))
                except:
                    pass
                else:
                    email = subscriber.get('email')
                    subscriber_type = subscriber.get('type')
                    if email:
                        obj.email = subscriber.get('email')

                    if subscriber_type:
                        if subscriber_type == 'active':
                            obj.is_active = True
                        else:
                            obj.is_active = False
                    obj.save()

            elif e_type == 'subscriber.unsubscribe':
                try:
                    obj = Subscriber.objects.get(mailerlite_id=subscriber.get('id'))
                except:
                    pass
                else:
                    obj.is_active = False
                    obj.save()

        return HttpResponse('ok')
