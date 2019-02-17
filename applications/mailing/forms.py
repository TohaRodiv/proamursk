from django.core.exceptions import ValidationError
from django.forms.models import ModelForm
from .models import Subscriber


class SubscribeForm(ModelForm):
    class Meta:
        model = Subscriber
        fields = 'email',
