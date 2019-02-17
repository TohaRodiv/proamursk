from django.core.exceptions import ValidationError
from django.forms.models import ModelForm
from .models import Feedback, PlaceReview, TextError


class FeedbackForm(ModelForm):
    class Meta:
        model = Feedback
        fields = ('subject', 'name', 'email', 'phone', 'text', 'attachment', 'is_agree')

    def clean_is_agree(self):
        is_agree = self.cleaned_data['is_agree']
        if not is_agree:
            raise ValidationError('Требуется подтвердить согласие с правилами обработки данных', code='invalid')
        return is_agree


class PlaceReviewForm(ModelForm):
    class Meta:
        model = PlaceReview
        fields = ('place', 'name', 'email', 'phone', 'text', 'is_agree')

    def clean_is_agree(self):
        is_agree = self.cleaned_data['is_agree']
        if not is_agree:
            raise ValidationError('Требуется подтвердить согласие с правилами обработки данных', code='invalid')
        return is_agree


class TextErrorForm(ModelForm):
    class Meta:
        model = TextError
        fields = ('url', 'text')

    def clean_is_agree(self):
        is_agree = self.cleaned_data['is_agree']
        if not is_agree:
            raise ValidationError('Требуется подтвердить согласие с правилами обработки данных', code='invalid')
        return is_agree
