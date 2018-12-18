# -*- coding: utf-8 -*-

import re

from django import forms
from django.template import loader
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.apps import apps
from django.conf import settings

try:
    from applications.notifications.tasks import send_notification
except ImportError:
    send_notification = None
    try:
        from applications.api.tasks import send_email
    except ImportError:
        send_email = None


User = apps.get_model(settings.AUTH_USER_MODEL)


class RegForm(forms.ModelForm):
    error_messages = {
        'duplicate_username': _(u' Пользователь с таким email уже зарегистрирован'),
        'duplicate_email': _(u' Пользователь с таким email уже зарегистрирован'),
        'password_mismatch': _(u'Пароли не совпадают'),
    }

    email = forms.EmailField(label=u'E-mail', error_messages={'invalid': _(u'Email введен не верно')})

    password1 = forms.CharField(label=u'Пароль', widget=forms.PasswordInput,
                                error_messages={'required': 'Обязательное поле'})
    password2 = forms.CharField(label=u'Повторить пароль', widget=forms.PasswordInput,
                                error_messages={'required': 'Обязательное поле'})

    i_agree = forms.BooleanField(label=u'Я принимаю условия', required=False)

    def __init__(self, *args, **kwargs):
        super(RegForm, self).__init__(*args, **kwargs)
        self.fields['first_name'].required = True

    class Meta:
        model = User
        fields = ('first_name', 'email',)

    def clean_phone(self):
        phone = self.cleaned_data['phone']
        phone_re = '^\+7\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}$'
        if User.objects.filter(phone=phone).exists():
            raise forms.ValidationError(
                u'Пользователь с таким телефоном уже зарегистрирован',
                code='invalid',
            )
        if re.match(phone_re, phone) is None:
            raise forms.ValidationError(
                u'Номер телефона должен быть в федеральном формате (10 цифр)',
                code='invalid',
            )
        return phone

    def clean_email(self):
        email = self.cleaned_data['email']
        try:
            User._default_manager.get(email=email)
        except User.DoesNotExist:
            return email

        raise forms.ValidationError(
            self.error_messages['duplicate_email'],
            code='duplicate_email',
        )

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        first_re = '^[0-9a-zA-Z]{6,}$'
        second_re = '[A-Z]+'
        third_re = '[a-z]+'
        fourth_re = '\d+'
        if (re.match(first_re, password1) is None
                    or re.search(second_re, password1) is None
                    or re.search(third_re, password1) is None
                    or re.search(fourth_re, password1) is None):

            raise forms.ValidationError(
                u'Пароль может состоять только из цифр или букв английского алфавита, должен быть не короче шести символов, а также содержать как минимум одну цифру, одну букву в нижнем и одну букву в верхнем регистрах',
                code='invalid',
            )
        return password1

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(
                self.error_messages['password_mismatch'],
                code='password_mismatch',
            )
        return password2

    def clean_i_agree(self):
        value = self.cleaned_data['i_agree']
        if not value:
            raise forms.ValidationError(
                u'Вы не подтвердили согласие с пользовательским соглашением',
                code='invalid',
            )

    def save(self, commit=True):
        user = super(RegForm, self).save(commit=False)
        user.username = self.cleaned_data['email']
        user.set_password(self.cleaned_data['password1'])
        if commit:
            user.save()
        return user


class NewSocialUserForm(forms.Form):
    first_name = forms.CharField(label=u'Имя')
    last_name = forms.CharField(label=u'Фамилия')
    email = forms.EmailField(label=u'E-mail', error_messages={'invalid': u'Email введен не верно.'})

    i_agree = forms.BooleanField(label=u'Я принимаю условия', required=False)
    confirm_age = forms.BooleanField(label=u'Мне есть 18', required=False)

    def clean_i_agree(self):
        value = self.cleaned_data['i_agree']
        if not value:
            raise forms.ValidationError(
                _(u'Вы не подтвердили согдасие с пользовательским соглашением'),
                code='invalid',
            )

    def clean_confirm_age(self):
        value = self.cleaned_data['confirm_age']
        if not value:
            raise forms.ValidationError(
                _(u'Вы не подтвердили что вам больше 18 лет'),
                code='invalid',
            )


class RememberPassForm(forms.Form):
    email = forms.EmailField(label=u'Email', error_messages={'invalid': u'Email введен не верно.'})


class ProfileSetNewPasswordForm(forms.ModelForm):
    error_messages = {
        'duplicate_username': _(u'Пользователь с таким email уже зарегистрирован'),
        'duplicate_email': _(u'Пользователь с таким email уже зарегистрирован'),
        'password_mismatch': _(u'Пароли не совпадают'),
    }

    new_password1 = forms.CharField(label=u'Пароль', widget=forms.PasswordInput, required=False)
    new_password2 = forms.CharField(label=u'Повторить пароль', widget=forms.PasswordInput, required=False)

    class Meta:
        model = User
        fields = ()

    def clean_new_password1(self):
        password1 = self.cleaned_data.get('new_password1')
        first_re = '^[0-9a-zA-Z]{6,}$'
        second_re = '[A-Z]+'
        third_re = '[a-z]+'
        fourth_re = '\d+'
        if password1 and (re.match(first_re, password1) is None
                or re.search(second_re, password1) is None
                or re.search(third_re, password1) is None
                or re.search(fourth_re, password1) is None):

            raise forms.ValidationError(
                ('Пароль может состоять только из цифр или букв английского алфавита, должен быть не короче шести '
                 'символов, а также содержать как минимум одну цифру, одну букву в нижнем и одну букву в верхнем '
                 'регистрах'),
                code='invalid',
            )
        return password1

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    u'Пароли не совпадают',
                    code='password_mismatch',
                )
        return password2

    def save(self, commit=True):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')

        if password1 and password2:
            self.instance.set_password(password1)

        self.instance.save()
        return self.instance


class ProfileForm(forms.ModelForm):
    error_messages = {
    }

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.fields['first_name'].required = True

    def save(self, commit=True):
        user = super(ProfileForm, self).save(commit=False)

        if commit:
            user.save()

        return user


class PasswordResetForm(forms.Form):
    email = forms.EmailField(label=_("Email"), max_length=254)

    def clean_email(self):
        email = self.cleaned_data.get('email')
        UserModel = get_user_model()
        if not UserModel._default_manager.filter(email__iexact=email, is_active=True).exists():
            raise forms.ValidationError(
                'Пользователь с таким email не зарегистрирован на сайте',
                code='invalid',
            )
        return email

    def save(self, domain_override=None,
             subject_template_name='registration/password_reset_subject.txt',
             email_template_name='registration/password_reset_email.html',
             use_https=False, token_generator=default_token_generator,
             from_email=None, request=None, html_email_template_name=None):
        """
        Generates a one-use only link for resetting password and sends to the
        user.
        """
        from django.core.mail import send_mail
        UserModel = get_user_model()
        email = self.cleaned_data["email"]
        active_users = UserModel._default_manager.filter(
            email__iexact=email, is_active=True)
        for user in active_users:
            # Make sure that no email is sent to a user that actually has
            # a password marked as unusable
            if not user.has_usable_password():
                continue
            notification_context = {
                'user_name': user.first_name,
                'user_surname': user.last_name,
                'user_email': user.email,
                'password_recovery_link': 'http://%s/%s/%s/%s/%s/' % (request.get_host(), 'accounts', 'password-change',
                                                                      urlsafe_base64_encode(force_bytes(user.pk)).decode(),
                                                                      token_generator.make_token(user))
            }
            if send_notification:
                try:
                    send_notification.delay('password_recovery',
                                            template_context=notification_context,
                                            recipient_email=[user.email],
                                            recipient_sms=[user.phone])
                except:
                    pass
            else:
                subject = 'Восстановление пароля'
                email = loader.render_to_string(email_template_name, notification_context)
                if send_email:
                    try:
                        send_email.delay(subject, email, from_email, [user.email])
                    except:
                        send_mail(subject, email, from_email, [user.email])
                else:
                    try:
                        send_mail(subject, email, from_email, [user.email])
                    except:
                        pass


class SetPasswordForm(forms.Form):
    """
    A form that lets a user change set their password without entering the old
    password
    """
    error_messages = {
        'password_mismatch': _("The two password fields didn't match."),
    }
    new_password1 = forms.CharField(label=_("New password"),
                                    widget=forms.PasswordInput)
    new_password2 = forms.CharField(label=_("New password confirmation"),
                                    widget=forms.PasswordInput)

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super(SetPasswordForm, self).__init__(*args, **kwargs)

    def clean_new_password1(self):
        password1 = self.cleaned_data.get('new_password1')
        first_re = '^[0-9a-zA-Z]{6,}$'
        second_re = '[A-Z]+'
        third_re = '[a-z]+'
        fourth_re = '\d+'
        if (re.match(first_re, password1) is None
                or re.search(second_re, password1) is None
                or re.search(third_re, password1) is None
                or re.search(fourth_re, password1) is None):

            raise forms.ValidationError(
                'Пароль может состоять только из цифр или букв английского алфавита, должен быть не короче шести символов, а также содержать как минимум одну цифру, одну букву в нижнем и одну букву в верхнем регистрах',
                code='invalid',
            )
        return password1

    def clean_new_password2(self):
        password1 = self.cleaned_data.get('new_password1')
        password2 = self.cleaned_data.get('new_password2')
        if password1 and password2:
            if password1 != password2:
                raise forms.ValidationError(
                    'Пароли не совпадают',
                    code='password_mismatch',
                )
        return password2

    def save(self, commit=True):
        self.user.set_password(self.cleaned_data['new_password1'])
        self.user.request_change_password = False
        if commit:
            self.user.save()
        return self.user
