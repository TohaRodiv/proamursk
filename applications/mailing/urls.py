from django.urls import path
from . views import subscribe, webhook_handler


urlpatterns = [
    path('subscribe/', subscribe, name='subscribe'),
    path('webhook/', webhook_handler, name='mailing_webhook'),
]
