import json

from django.conf import settings
from django.core.paginator import Paginator, EmptyPage
from django.http import JsonResponse, Http404
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.template.loader import render_to_string
from django.urls import resolve
from django.views.decorators.http import require_POST
from django.views.generic import ListView, DetailView
from django.utils import timezone

from applications.banrequest.views import check
from applications.root.forms import FeedbackForm, PlaceReviewForm, TextErrorForm
from .models import News, Event, Report, History, Person, CityGuide, Place, Special, Film

try:
    from applications.notifications.tasks import send_notification
except ImportError:
    send_notification = None
    try:
        from applications.api.tasks import send_email
    except ImportError:
        send_email = None


def custom_handler404(request, exception):
    return render(request, 'site/404.html', status=404)


class NewsListView(ListView):
    model = News
    allow_empty = True
    queryset = News.objects.filter(is_active=True, publication_date__lte=timezone.now())
    paginate_by = 50
    context_object_name = 'news'
    template_name = 'root/news_list.html'


class NewsDetailView(DetailView):
    model = News
    queryset = News.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'news'
    template_name = 'root/news_detail.html'


class EventsListView(ListView):
    model = Event
    allow_empty = True
    queryset = Event.objects.filter(is_active=True, start_event_date__lte=timezone.now())
    paginate_by = 50
    context_object_name = 'events'
    template_name = 'root/events_list.html'


class EventsListFutureView(ListView):
    model = Event
    allow_empty = True
    queryset = Event.objects.filter(is_active=True, start_event_date__lte=timezone.now(),
                                    start_event_date__gt=timezone.now())
    paginate_by = 50
    context_object_name = 'events'
    template_name = 'root/events_list.html'


class EventsListPastView(ListView):
    model = Event
    allow_empty = True
    queryset = Event.objects.filter(is_active=True, start_event_date__lte=timezone.now(),
                                    start_event_date__lt=timezone.now())
    paginate_by = 16
    context_object_name = 'events'
    template_name = 'root/events_list.html'


class EventsDetailView(DetailView):
    model = Event
    queryset = Event.objects.filter(is_active=True, start_event_date__lte=timezone.now())
    context_object_name = 'event'
    template_name = 'root/events_detail.html'


class ReportsListView(ListView):
    model = Report
    allow_empty = True
    queryset = Report.objects.filter(is_active=True, publication_date__lte=timezone.now())
    paginate_by = 50
    context_object_name = 'reports'
    template_name = 'root/reports_list.html'


class ReportsDetailView(DetailView):
    model = Report
    queryset = Report.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'report'
    template_name = 'root/report_detail.html'


class HistoryListView(ListView):
    model = History
    allow_empty = True
    queryset = History.objects.filter(is_active=True, publication_date__lte=timezone.now())
    paginate_by = 50
    context_object_name = 'histories'
    template_name = 'root/history_list.html'


class HistoryDetailView(DetailView):
    model = History
    queryset = History.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'history'
    template_name = 'root/report_detail.html'


class PersonsListView(ListView):
    model = Person
    allow_empty = True
    queryset = Person.objects.filter(is_active=True, publication_date__lte=timezone.now())
    paginate_by = 50
    context_object_name = 'persons'
    template_name = 'root/persons_list.html'


class PersonsDetailView(DetailView):
    model = Person
    queryset = Person.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'person'
    template_name = 'root/persons_detail.html'


class CityGuidesDetailView(DetailView):
    model = CityGuide
    queryset = CityGuide.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'guide'
    template_name = 'root/city_guides_detail.html'


class PlaceListView(ListView):
    model = Place
    allow_empty = True
    queryset = Place.objects.filter(is_active=True, publication_date__lte=timezone.now())
    paginate_by = 50
    context_object_name = 'places'
    template_name = 'root/places_list.html'


class PlaceDetailView(DetailView):
    model = Place
    queryset = Place.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'place'
    template_name = 'site/event-announcement.html'


class SpecialsListView(ListView):
    model = Special
    allow_empty = True
    queryset = Special.objects.filter(is_active=True, publication_date__lte=timezone.now())
    paginate_by = 50
    context_object_name = 'specials'
    template_name = 'root/specials_list.html'


class SpecialsDetailView(DetailView):
    model = Special
    queryset = Special.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'special'
    template_name = 'root/specials_detail.html'
    slug_field = 'codename'


class FilmDetailView(DetailView):
    model = Film
    queryset = Film.objects.filter(is_active=True).prefetch_related('sessions')
    context_object_name = 'film'
    template_name = 'root/film_detail.html'


@require_POST
def feedback(request):
    if request.is_ajax():
        current_url = resolve(request.path_info).url_name
        if not check(request, current_url):
            return JsonResponse({'status': False, 'message': settings.BAN_MESSAGE})
        form = FeedbackForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            if send_notification is not None:
                instance = form.instance
                template_context = {
                    'subject': dict(instance.SUBJECTS).get(instance.subject),
                    'sender_name': instance.name,
                    'sender_email': instance.email,
                    'sender_phone': instance.email,
                    'feedback_content': instance.content,
                    'feedback_cp_link': '{scheme}:{host}/admin/feedbacks/{id}/'.format(
                        scheme=request.scheme, host=request.get_host(), id=instance.id
                    )
                }
                if instance.attachment:
                    template_context['attachment_title'] = instance.attachment.original_name
                    template_context['attachment_link'] = request.build_absolute_uri(instance.attachment.file.url)
                try:
                    send_notification.delay('feedback', template_context=template_context, recipient_sms=[],
                                            recipient_email=[instance.email])
                except Exception as e:
                    pass
            return JsonResponse({'status': True, 'message': 'Обращение отправлено, скоро мы с вами свяжемся'})
        return JsonResponse({'status': False, 'message': settings.COMMON_FORM_ERROR_MESSAGE})
    else:
        raise Http404


@require_POST
def place_review(request):
    if request.is_ajax():
        current_url = resolve(request.path_info).url_name
        if not check(request, current_url):
            return JsonResponse({'status': False, 'message': settings.BAN_MESSAGE})
        form = PlaceReviewForm(request.POST)
        if form.is_valid():
            form.save()
            if send_notification is not None:
                instance = form.instance
                template_context = {
                    'place': instance.place.title,
                    'sender_name': instance.name,
                    'sender_email': instance.email,
                    'sender_phone': instance.email,
                    'review_content': instance.content,
                    'review_cp_link': '{scheme}:{host}/admin/reviews/{id}/'.format(
                        scheme=request.scheme, host=request.get_host(), id=instance.id
                    )
                }
                try:
                    send_notification.delay('place_review', template_context=template_context, recipient_sms=[],
                                            recipient_email=[instance.email])
                except Exception as e:
                    pass
            return JsonResponse({'status': True,
                                 'message': 'Отзыв отправлен, он появится на сайте после прохождения модерации'})
        return JsonResponse({'status': False, 'message': settings.COMMON_FORM_ERROR_MESSAGE})
    else:
        raise Http404


@require_POST
def announcements(request):
    result = {'status': False, 'message': settings.COMMON_ERROR_MESSAGE}
    if request.is_ajax():
        page_number = request.POST.get('page')
        if page_number:
            try:
                page_number = int(page_number)
            except ValueError:
                pass
            else:
                now = timezone.now()
                main_page_ids = list(Event.objects.filter(
                    publication_date__lte=now, is_active=True).values_list('id', flat=True).filter(
                    start_event_date__lt=now).order_by('-start_event_date')[:16])
                event_announcements = Event.objects.filter(
                    publication_date__lte=now, start_event_date__lt=now, is_active=True).exclude(
                    id__in=main_page_ids).order_by('-start_event_date')
                paginator = Paginator(event_announcements, 24)
                if page_number in paginator.page_range:
                    page = paginator.page(page_number)
                    rendered_html = render_to_string('root/ajax_infinity_loader.html', context={'objects': page})
                    result = {
                        'status': True,
                        'data': {'last': not page.has_next()},
                        'templates':
                            {'announcements': rendered_html.replace('\n', '')}
                    }
        return JsonResponse(result)

    else:
        raise Http404


@require_POST
def reports(request):
    result = {'status': False, 'message': settings.COMMON_ERROR_MESSAGE}
    if request.is_ajax():
        page_number = request.POST.get('page')
        if page_number:
            try:
                page_number = int(page_number)
            except ValueError:
                pass
            else:
                now = timezone.now()
                main_page_ids = list(Report.objects.filter(
                    publication_date__lte=now, is_active=True).values_list('id', flat=True).order_by('-publication_date')[:16])
                reports_objects = Report.objects.filter(publication_date__lte=now, is_active=True).exclude(
                    id__in=main_page_ids).order_by('-publication_date')
                paginator = Paginator(reports_objects, 24)
                if page_number in paginator.page_range:
                    page = paginator.page(page_number)
                    rendered_html = render_to_string('root/ajax_infinity_loader.html', context={'objects': page})
                    result = {
                        'status': True,
                        'data': {'last': not page.has_next()},
                        'templates':
                            {'reports': rendered_html.replace('\n', '')}
                    }
        return JsonResponse(result)

    else:
        raise Http404


@require_POST
def persons(request):
    result = {'status': False, 'message': settings.COMMON_ERROR_MESSAGE}
    if request.is_ajax():
        page_number = request.POST.get('page')
        if page_number:
            try:
                page_number = int(page_number)
            except ValueError:
                pass
            else:
                now = timezone.now()
                main_page_ids = list(Person.objects.filter(
                    publication_date__lte=now, is_active=True).values_list('id', flat=True).order_by('-publication_date')[:15])
                persons_objects = Person.objects.filter(publication_date__lte=now, is_active=True).exclude(
                    id__in=main_page_ids).order_by('-publication_date')
                paginator = Paginator(persons_objects, 24)
                if page_number in paginator.page_range:
                    page = paginator.page(page_number)
                    rendered_html = render_to_string('root/ajax_infinity_loader.html', context={'objects': page})
                    result = {
                        'status': True,
                        'data': {'last': not page.has_next()},
                        'templates':
                            {'articles': rendered_html.replace('\n', '')}
                    }
        return JsonResponse(result)

    else:
        raise Http404


@require_POST
def places(request):
    result = {'status': False, 'message': settings.COMMON_ERROR_MESSAGE}
    if request.is_ajax():
        page_number = request.POST.get('page')
        if page_number:
            try:
                page_number = int(page_number)
            except ValueError:
                pass
            else:
                now = timezone.now()
                main_page_places_ids = list(Place.objects.filter(
                    publication_date__lte=now, is_active=True).values_list('id', flat=True).order_by('-publication_date')[:15])
                places_objects = Place.objects.filter(publication_date__lte=now, is_active=True).exclude(
                    id__in=main_page_places_ids).order_by('-publication_date')
                paginator = Paginator(places_objects, 24)
                if page_number in paginator.page_range:
                    page = paginator.page(page_number)
                    rendered_html = render_to_string('root/ajax_infinity_loader.html', context={'objects': page})
                    result = {
                        'status': True,
                        'data': {'last': not page.has_next()},
                        'templates':
                            {'places': rendered_html.replace('\n', '')}
                    }
        return JsonResponse(result)

    else:
        raise Http404


@require_POST
def history(request):
    result = {'status': False, 'message': settings.COMMON_ERROR_MESSAGE}
    if request.is_ajax():
        page_number = request.POST.get('page')
        if page_number:
            try:
                page_number = int(page_number)
            except ValueError:
                pass
            else:
                now = timezone.now()
                main_page_places_ids = list(History.objects.filter(
                    publication_date__lte=now, is_active=True).values_list('id', flat=True).order_by('-publication_date')[:15])
                history_objects = History.objects.filter(publication_date__lte=now, is_active=True).exclude(
                    id__in=main_page_places_ids).order_by('-publication_date')
                paginator = Paginator(history_objects, 24)
                if page_number in paginator.page_range:
                    page = paginator.page(page_number)
                    rendered_html = render_to_string('root/ajax_infinity_loader.html', context={'objects': page})
                    result = {
                        'status': True,
                        'data': {'last': not page.has_next()},
                        'templates':
                            {'articles': rendered_html.replace('\n', '')}
                    }
        return JsonResponse(result)

    else:
        raise Http404


@require_POST
def bugreport(request):
    result = {'status': False, 'message': settings.COMMON_ERROR_MESSAGE}
    if request.is_ajax():
        form = TextErrorForm(request.POST)
        if form.is_active():
            obj = form.save()
            template_context = {
                'page_url': obj.url,
                'text': obj.text,
            }

            try:
                send_notification.delay('bugreport',
                                        template_context=template_context,
                                        recipient_sms=[],
                                        recipient_email=[])
            except Exception as e:
                pass
            result = {
                'status': True,
                'message': 'Сообщение отправлено, спасибо за помощь'
            }
        else:
            result = {'status': False, 'message': settings.COMMON_FORM_ERROR_MESSAGE}
        return JsonResponse(result)
    else:
        raise Http404
