# -*- coding: utf-8 -*-

from datetime import datetime, timedelta

from django.conf import settings
from django.db.models import Count, Max, Q
from django.utils import timezone

from .models import CheckRequest, BanRequest


def check(request, view):
    now = timezone.now()
    ban_settings = {}
    ssid = request.session.session_key if hasattr(request, 'session') and request.session.session_key else None

    if not ssid:
        return False

    if hasattr(settings, 'BAN_REQUEST') and isinstance(settings.BAN_REQUEST, dict):
        ban_settings = settings.BAN_REQUEST
        ban_settings.update({'default_ban_params': {'min': {'count': 10, 'minutes': 60}, 'ban_minutes': 120}})

    ban_delta = ban_settings[view].get(
        'ban_minutes', ban_settings['default_ban_params']['ban_minutes']
    ) if view in ban_settings else ban_settings['default_ban_params']['ban_minutes']
    start_date = now - timedelta(minutes=ban_delta)

    ip = request.META['REMOTE_ADDR']
    if (not ip or ip == '127.0.0.1') and 'HTTP_X_FORWARDED_FOR' in request.META:
        ip = request.META['HTTP_X_FORWARDED_FOR']

    ban_qs = BanRequest.objects.filter((Q(session=ssid) | Q(host=ip)),
                                       start_datetime__gte=start_date,
                                       start_datetime__lte=now,
                                       view=view,
                                       url=request.path_info)

    if ban_qs.exists():
        return False
    else:
        add_session_to_ban = False

        max_ssid_count_for_ip = 7

        min_data = ban_settings[view].get('min', {'count': 10, 'minutes': 60})

        min_count = min_data['count']
        min_delta = min_data['minutes']
        min_check_url = min_data['check_url']
        min_date = now - timedelta(minutes=min_delta)

        min_ssid_request_data = CheckRequest.objects.filter(check_datetime__gte=min_date,
                                                            check_datetime__lte=now,
                                                            view=view,
                                                            session=ssid)

        if min_check_url:
            min_ssid_request_data = min_ssid_request_data.filter(url=request.path_info)

        min_ssid_request_data = min_ssid_request_data.aggregate(request_count=Count('id'),
                                                                request_last_time=Max('check_datetime'))

        if min_ssid_request_data['request_count'] >= min_count:
            add_session_to_ban = True

        max_data = ban_settings[view].get('max')
        if not add_session_to_ban and max_data:
            max_count = max_data['count']
            max_delta = max_data['minutes']
            max_check_url = max_data['check_url']
            max_date = now - timedelta(minutes=max_delta)

            max_ssid_request_data = CheckRequest.objects.filter(check_datetime__gte=max_date,
                                                                check_datetime__lte=now,
                                                                view=view,
                                                                session=ssid)

            if max_check_url:
                max_ssid_request_data = max_ssid_request_data.filter(url=request.path_info)

            max_ssid_request_data = max_ssid_request_data.aggregate(request_count=Count('id'),
                                                                    request_last_time=Max('check_datetime'))

            if max_ssid_request_data['request_count'] >= max_count:
                add_session_to_ban = True

        if add_session_to_ban:
            BanRequest.objects.create(start_datetime=now, session=ssid, view=view, url=request.path_info)
            return False

        count_ssid_for_ip = CheckRequest.objects.filter(check_datetime__gte=now - timedelta(minutes=60),
                                                        check_datetime__lte=now,
                                                        view=view,
                                                        url=request.path_info,
                                                        host=ip).values('session').distinct().count()

        if count_ssid_for_ip >= max_ssid_count_for_ip:
            BanRequest.objects.create(start_datetime=now, host=ip, view=view, url=request.path_info)
            return False

        CheckRequest.objects.create(check_datetime=now, session=ssid, host=ip, view=view, url=request.path_info)

        return True
