# -*- coding: utf-8 -*-
from django.conf import settings
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.conf.urls import url
from django.urls import resolve, path
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

# from applications.api.views import PasswordRecoveryAPIView
from applications.banrequest.views import check
from cp_vue.api.permissions import SapPermissions
from cp_vue.api.views import CpViewSet
from cp_vue.api.core import cp_api
from .serializers import UserDetailSerializer, UserListSerializer, UserNestedSerializer, PasswordRecoverySerializer, \
    SetPasswordSerializer
from .filters import UserFilter
from ..models import User

try:
    from applications.notifications.tasks import send_notification
except ImportError:
    send_notification = None
    try:
        from applications.api.tasks import send_email
    except ImportError:
        send_email = None


class SelfUserPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        return request.user.pk == obj.pk


class UserDetailAPIView(APIView):
    model = User
    serializer_class = UserDetailSerializer
    queryset = User.objects.all()
    permission_classes = (SapPermissions, SelfUserPermission)

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            data = UserNestedSerializer(request.user).data
            return Response(data, status=200)
        else:
            return Response(status=400)

    @classmethod
    def get_urls(self):
        urlpatterns = [
            url(r'^user-info/$', self.as_view(http_method_names=['get']), name='api-user-info'),
        ]
        return urlpatterns


class SigninAPIView(APIView):

    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')

        user = authenticate(username=username, password=password)

        if user is not None and user.is_active:
            login(request, user)
            response = {}
            response = Response(response)
            response.set_cookie('user_id', value=user.id, httponly=False)
            return response
        else:
            message = u'Логин или пароль указаны неверно'
            response = dict(message=message)
            return Response(response, status=400)

    @classmethod
    def get_urls(self):
        urlpatterns = [
            url(r'^auth/signin/', self.as_view(), name='api-auth-signin'),
        ]
        return urlpatterns


class PasswordRecoveryAPIView(APIView):

    def post(self, request):
        current_url = resolve(request.path_info).url_name
        if not check(request, current_url):
            return Response(data={'non_field_errors': [settings.BAN_MESSAGE]}, status=status.HTTP_400_BAD_REQUEST)
        serializer = PasswordRecoverySerializer(data=request.data)
        if serializer.is_valid():
            opts = {
                'use_https': request.is_secure(),
                'token_generator': default_token_generator,
                'email_template_name': 'accounts/password_reset_email.html',
                'subject_template_name': 'accounts/password_reset_subject.txt',
                'request': request,
            }
            serializer.save(**opts)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(data=serializer.errors, status=400)

    @classmethod
    def get_urls(self):
        urlpatterns = [
            url(r'^auth/password-recovery/', self.as_view(), name='api-password-recovery'),
        ]
        return urlpatterns


class PasswordChangeAPIView(APIView):

    def post(self, request, uidb64=None, token=None):
        UserModel = get_user_model()
        assert uidb64 is not None and token is not None
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            data = request.data
            serializer = SetPasswordSerializer(instance=user, data=data)
            if serializer.is_valid():
                serializer.save()
                notification_context = {
                    'user_name': user.first_name,
                    'user_surname': user.last_name,
                    'user_email': user.email,
                    'site_link': 'http://%s' % request.get_host()
                }
                if send_notification is not None:
                    try:
                        send_notification.delay('password_recovery_complete',
                                                template_context=notification_context,
                                                recipient_email=[user.email],
                                                recipient_sms=[user.phone])
                    except:
                        pass
                return Response(status=status.HTTP_200_OK)

            else:
                return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(data={'non_field_errors': ['Срок действия токена для восстановления истек']},
                            status=status.HTTP_400_BAD_REQUEST)

    @classmethod
    def get_urls(self):
        urlpatterns = [
            path('auth/password-change/<str:uidb64>/<str:token>/', self.as_view(), name='api-password-change'),
        ]
        return urlpatterns



class LogoutAPIView(APIView):

    def post(self, request):
        logout(request)
        response = Response(dict())
        response.delete_cookie('user_id')
        return response

    @classmethod
    def get_urls(self):
        urlpatterns = [
            url(r'^auth/logout/', self.as_view(), name='api-auth-logout'),
        ]
        return urlpatterns


class UsersCpViewSet(CpViewSet):
    path = 'users'
    model = User
    queryset = User.objects.all()
    available_actions = dict(activate='Активация и Деактивация', delete='Удаление')
    serializer_class = UserDetailSerializer
    list_serializer_class = UserListSerializer
    filter_class = UserFilter
    ordering_fields = ('id', 'username', 'company__name', 'first_name', 'last_name', 'edit_date', 'create_date',
                       'last_seen')

    def get_queryset(self):
        queryset = super(UsersCpViewSet, self).get_queryset()

        if self.request and self.request.user and not self.request.user.is_superuser:
            queryset = queryset.filter(is_superuser=False)

        return queryset

    def perform_create(self, serializer, token_generator=default_token_generator):
        serializer.save()
        user = serializer.instance
        if send_notification is not None:
            notification_context = {
                'user_name': user.first_name,
                'user_company': user.company.name,
                'user_email': user.email,
                'password_recovery_link': '%s://%s/%s/%s/%s/' % (self.request.scheme, self.request.get_host(),
                                                                 'password-change',
                                                                 urlsafe_base64_encode(force_bytes(user.pk)).decode(),
                                                                 token_generator.make_token(user))
            }
            if send_notification:
                try:
                    send_notification.delay('create_user',
                                            template_context=notification_context,
                                            recipient_email=[user.email],
                                            recipient_sms=[])
                except Exception as e:
                    pass


cp_api.register(UsersCpViewSet)
cp_api.register(SigninAPIView)
cp_api.register(LogoutAPIView)
cp_api.register(PasswordRecoveryAPIView)
cp_api.register(PasswordChangeAPIView)
cp_api.register(UserDetailAPIView)
