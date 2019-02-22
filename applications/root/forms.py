from django.core.exceptions import ValidationError
from django.forms.models import ModelForm
from django import forms
from .models import Feedback, PlaceReview, TextError
from applications.files.models import UserFile


class FeedbackForm(ModelForm):
    attachments = forms.ModelMultipleChoiceField(label='Файлы', queryset=UserFile.objects.all())

    class Meta:
        model = Feedback
        fields = ('subject', 'name', 'email', 'phone', 'text', 'attachments')


class PlaceReviewForm(ModelForm):
    class Meta:
        model = PlaceReview
        fields = ('place', 'name', 'email', 'phone', 'text')


class TextErrorForm(ModelForm):
    class Meta:
        model = TextError
        fields = ('url', 'text')


class UploadForm(ModelForm):

    class Meta:
        model = UserFile
        exclude = ()
