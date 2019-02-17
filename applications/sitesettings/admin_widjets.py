# -*- coding: utf-8 -*-

from cp.widgets import TextareaField


class GoogleCredentialWidget(TextareaField):
    input_type = 'google-credential'

    def __init__(self, attrs=None):
        if attrs is None:
            attrs = {}
        super(GoogleCredentialWidget, self).__init__(attrs)

