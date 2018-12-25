from django.core.exceptions import ValidationError
from django.forms.models import ModelForm
from . models import Feedback


class FeedbackForm(ModelForm):
    class Meta:
        model = Feedback
        fields = ('subject', 'name', 'email', 'phone', 'text', 'attachment', 'is_agree')

    def clean_is_agree(self):
        is_agree = self.cleaned_data['is_agree']
        if not is_agree:
            raise ValidationError('Требуется подтвердить согласие с правилами обработки данных', code='invalid')
        return is_agree
