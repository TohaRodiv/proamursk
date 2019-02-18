# -*-coding: utf-8 -*-
import re

from django.contrib.auth import authenticate, login
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.template import loader
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import serializers

from applications.mediafiles.cp.serializers import ImageNestedSerializer
from applications.mediafiles.models import MediaFile
from cp_vue.api.fields import ObjectRelatedField
from cp_vue.api.serializers import ModelSerializer
from cp_vue.cp.serializers import CpRoleNestedSerializer
# from applications.tools.utils import filter_number
from cp_vue.models import CpRole
from ..models import User

try:
    from applications.notifications.tasks import send_notification
except ImportError:
    send_notification = None
    try:
        from applications.api.tasks import send_email
    except ImportError:
        send_email = None


class UserListSerializer(ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)
    roles = serializers.SerializerMethodField(read_only=True)
    avatar = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'full_name', 'roles', 'is_active', 'is_staff', 'create_date', 'edit_date', 'avatar')

    def get_roles(self, instance):
        return [i.name for i in instance.roles.all()]

    def get_full_name(self, instance):
        return instance.get_full_name()


class UserNestedSerializer(ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'patronymic', 'is_active', 'is_staff',
                  'is_superuser', 'avatar')

    def get_roles(self, instance):
        return ''

    def get_avatar(self, instance):
        return {
            'min_crop_url': instance.avatar.get_thumbnail_url_by_name('sap_min_crop')
        } if instance.avatar else {}


class UserDetailSerializer(ModelSerializer):
    password1 = serializers.CharField(required=False, allow_blank=True)
    password2 = serializers.CharField(required=False, allow_blank=True)
    avatar = ObjectRelatedField(queryset=MediaFile.objects.all(), serializer_class=ImageNestedSerializer,
                                required=False, allow_null=True)
    roles = ObjectRelatedField(queryset=CpRole.objects.all(), serializer_class=CpRoleNestedSerializer,
                               required=False, many=True)

    class Meta:
        model = User
        fields = ('id', 'avatar', 'username', 'first_name', 'last_name', 'patronymic', 'roles', 'is_active',
                  'request_change_password', 'password1', 'password2', 'is_superuser', 'create_date', 'edit_date',
                  'comment')
        read_only_fields = 'is_superuser',
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True, 'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    # def validate_password1(self, data):
    #     password1 = data
    #     first_re = '^[0-9a-zA-Z]{6,}$'
    #     second_re = '[A-Z]+'
    #     third_re = '[a-z]+'
    #     fourth_re = '\d+'
    #     if (re.match(first_re, password1) is None
    #                 or re.search(second_re, password1) is None
    #                 or re.search(third_re, password1) is None
    #                 or re.search(fourth_re, password1) is None):
    #
    #         raise serializers.ValidationError({'password1': u'Пароль может состоять только из цифр или букв английского алфавита, должен быть не короче шести символов, а также содержать как минимум одну цифру, одну букву в нижнем и одну букву в верхнем регистрах',})
    #     return data

    def validate_username(self, username):
        if self.instance and self.instance.is_superuser:
            pass
        else:
            try:
                validate_email(username)
            except ValidationError as e:
                raise serializers.ValidationError(e)
        return username

    def validate(self, attrs):
        phone = attrs.get('phone', '')
        username = attrs.get('username')
        attrs['email'] = username

        # if self.instance.id and not self.instance.is_superuser and not phone:
        #     raise serializers.ValidationError({'phone': u'Заполните поле'})

        # if self.instance.id and not self.instance.is_superuser:
        #     if filter_number(phone) != username:
        #         raise serializers.ValidationError({'username': u'Имя пользователя не соответствует телефону'})

        password1 = attrs.get('password1')
        password2 = attrs.get('password2')
        if (password1 and not password2) or (not password1 and password2):
            raise serializers.ValidationError({'password2': u'Пароли не совпадают' })

        if password1 and password2 and password1 != password2:
            raise serializers.ValidationError({'password2': u'Пароли не совпадают' })
        return attrs

    def create(self, validated_data):
        password1 = validated_data.pop('password1') if 'password1' in validated_data else None
        password2 = validated_data.pop('password2') if 'password2' in validated_data else None
        validated_data['password'] = 'none'
        instance = super(UserDetailSerializer, self).create(validated_data)
        if password1:
            instance.set_password(password1)
            instance.save()
        return instance

    def update(self, instance, validated_data):
        password1 = validated_data.pop('password1') if 'password1' in validated_data else None
        password2 = validated_data.pop('password2') if 'password2' in validated_data else None
        instance = super(UserDetailSerializer, self).update(instance, validated_data)
        if password1 and password2:
            instance.set_password(self.validated_data['password1'])
            instance.save()
            if self.context['request']._request.user.id == instance.id:
                user = authenticate(username=instance.username, password=self.validated_data['password1'])
                if user is not None and user.is_active:
                    login(self.context['request']._request, user)
        return instance


class PasswordRecoverySerializer(serializers.ModelSerializer):
    """
    Сериализатор для смены пароля, если пользователь забыл свой пароль
    """
    class Meta:
        model = User
        fields = 'email',
        extra_kwargs = {
            'email': {'required': True}
        }

    def validate_email(self, email):
        if not User.objects.filter(email__iexact=email, is_active=True).exists():
            raise serializers.ValidationError('Пользователь с таким email не зарегистрирован на сайте')
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
        email = self.validated_data.get("email")
        active_users = User.objects.filter(email__iexact=email, is_active=True)
        for user in active_users:
            # Make sure that no email is sent to a user that actually has
            # a password marked as unusable
            if not user.has_usable_password():
                continue
            notification_context = {
                'user_name': user.first_name,
                'user_surname': user.last_name,
                'user_email': user.email,
                'password_recovery_link': '{scheme}://{hostname}/api/v1/auth/password-change/{token1}/{token2}/'.format(
                    scheme=request.scheme, hostname=request.get_host(),
                    token1=urlsafe_base64_encode(force_bytes(user.pk)).decode(),
                    token2=token_generator.make_token(user)
                )
            }
            if send_notification:
                try:
                    send_notification.delay('password_recovery',
                                            template_context=notification_context,
                                            recipient_email=[user.email],
                                            recipient_sms=[])
                except Exception as e:
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


class SetPasswordSerializer(serializers.ModelSerializer):
    """
    Сериализатор для установки нового пароля пользователя
    """
    new_password1 = serializers.CharField(write_only=True, required=True)
    new_password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = 'new_password1', 'new_password2'

    def validate(self, attrs):
        new_pass1 = attrs.get('new_password1')
        new_pass2 = attrs.get('new_password2')
        errors = dict()
        if new_pass2 != new_pass1:
            errors['new_password1'] = ['Пароли не совпадают']
            errors['new_password2'] = ['Пароли не совпадают']
        validation_error = password_not_valid(new_pass1)
        if validation_error:
            if 'new_password1' in errors:
                errors['new_password1'].append(validation_error)
            else:
                errors['new_password1'] = [validation_error]
        validation_error = password_not_valid(new_pass1)
        if validation_error:
            if 'new_password2' in errors:
                errors['new_password2'].append(validation_error)
            else:
                errors['new_password2'] = [validation_error]
        if errors:
            raise serializers.ValidationError(errors)
        return super(SetPasswordSerializer, self).validate(attrs)

    def save(self, *args, **kwargs):
        user = self.instance
        user.set_password(self.validated_data.get('new_password1'))
        user.request_change_password = False
        user.save()


def password_not_valid(password):
    first_re = '^[0-9a-zA-Z\!\%\?\&\*\{\}\]\[\(\)\@]{6,}$'
    second_re = '[A-Z]+'
    third_re = '[a-z]+'
    fourth_re = '\d+'
    text_err = ('Пароль может состоять из цифр и букв английского алфавита, символов @!%&?*{}[]()'
                ', должен быть не короче шести символов, а также содержать как минимум одну цифру, '
                'одну букву в нижнем и одну букву в верхнем регистрах')
    if ((re.match(first_re, password) is None or re.search(second_re, password) is None
         or re.search(third_re, password) is None or re.search(fourth_re, password) is None)):
        return text_err
    return False
