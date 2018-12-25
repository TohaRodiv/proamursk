import json

from django.conf import settings
from django.core.paginator import Paginator, EmptyPage
from django.http import JsonResponse, Http404
from django.shortcuts import render
from django.template.loader import render_to_string
from django.views.decorators.http import require_POST
from django.views.generic import ListView, DetailView
from django.utils import timezone

from applications.root.forms import FeedbackForm, PlaceReviewForm
from .models import News, Event, Report, History, Person, CityGuide, Place, Special, Film


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
    queryset = Event.objects.filter(is_active=True, publication_date__lte=timezone.now())
    paginate_by = 50
    context_object_name = 'events'
    template_name = 'root/events_list.html'


class EventsListFutureView(ListView):
    model = Event
    allow_empty = True
    queryset = Event.objects.filter(is_active=True, publication_date__lte=timezone.now(),
                                    start_event_date__gt=timezone.now())
    paginate_by = 50
    context_object_name = 'events'
    template_name = 'root/events_list.html'


class EventsListPastView(ListView):
    model = Event
    allow_empty = True
    queryset = Event.objects.filter(is_active=True, publication_date__lte=timezone.now(),
                                    start_event_date__lt=timezone.now())
    paginate_by = 16
    context_object_name = 'events'
    template_name = 'root/events_list.html'


class EventsDetailView(DetailView):
    model = Event
    queryset = Event.objects.filter(is_active=True, publication_date__lte=timezone.now())
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
    template_name = 'root/places_detail.html'


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
        form = FeedbackForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': True, 'message': 'Обращение отправлено, скоро мы с вами свяжемся'})
        return JsonResponse({'status': False, 'message': 'Одно или несколько полей формы содержат ошибки'})
    else:
        raise Http404


@require_POST
def place_review(request):
    if request.is_ajax():
        form = PlaceReviewForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': True,
                                 'message': 'Отзыв отправлен, он появится на сайте после прохождения модерации'})
        return JsonResponse({'status': False, 'message': 'Одно или несколько полей формы содержат ошибки'})
    else:
        raise Http404


@require_POST
def announcements(request):
    result = {'status': False, 'message': settings.COMMON_FORM_ERROR_MESSAGE}
    if request.is_ajax():
        page_number = request.POST.get('page')
        if page_number:
            try:
                page_number = int(page_number)
            except ValueError:
                pass
            else:
                now = timezone.now()
                main_page_event_ids = list(Event.objects.values_list('id', flat=True).filter(
                    start_event_date__lt=now).order_by('-start_event_date')[:16])
                event_announcements = Event.objects.filter(start_event_date__lt=now).exclude(
                    id__in=main_page_event_ids).order_by('-start_event_date')
                paginator = Paginator(event_announcements, 24)
                if page_number in paginator.page_range:
                    page = paginator.page(page_number)
                    rendered_html = render_to_string('root/ajax_past_events_list.html', context={'events': page})
                    result = {
                        'status': True,
                        'data': {'last': not page.has_next()},
                        'templates':
                            {'announcements': rendered_html.replace('\n', '')}
                    }
                else:
                    pass
        return JsonResponse(result)

    else:
        raise Http404








