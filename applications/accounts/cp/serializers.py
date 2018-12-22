# -*-coding: utf-8 -*-

from django.contrib.auth import authenticate, login
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import serializers

from applications.mediafiles.cp.serializers import ImageNestedSerializer
from applications.mediafiles.models import MediaFile
from cp_vue.api.fields import ObjectRelatedField
from cp_vue.api.serializers import ModelSerializer
from cp_vue.cp.serializers import CpRoleNestedSerializer
# from applications.tools.utils import filter_number
from cp_vue.models import CpRole
from ..models import User


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
            'min_crop_url': instance.avatar.get_thumbnail_url_by_name('avatar_mini')
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
        fields = ('id', 'avatar', 'username', 'first_name', 'last_name', 'patronymic', 'roles', 'is_active', 'is_staff',
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
