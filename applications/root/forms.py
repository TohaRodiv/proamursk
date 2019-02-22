from django.core.exceptions import ValidationError
from django.forms.models import ModelForm
from .models import Feedback, PlaceReview, TextError
from applications.files.models import UserFile


class FeedbackForm(ModelForm):
    class Meta:
        model = Feedback
        fields = ('subject', 'name', 'email', 'phone', 'text', 'attachment')


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
