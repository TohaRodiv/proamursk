from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from applications.mailing.tasks import create_subscriber, update_subscribers
from . models import Subscriber
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
            update_subscribers([subscriber.id])
            return JsonResponse({'status': True, 'message': 'Вы успешно восстановили подписку на рассылку'})
        if form.is_valid():
            form.save()
            create_subscriber.delay(form.instance.id)
            return JsonResponse({'status': True, 'message': 'Вы успешно подписались на рассылку'})
        else:
            return JsonResponse({'status': False, 'message': form.errors['email'][0]})
    else:
        return JsonResponse({'status':False, 'message': settings.COMMON_ERROR_MESSAGE})



