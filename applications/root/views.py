import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from django.views.generic import ListView, DetailView
from django.utils import timezone

from applications.root.forms import FeedbackForm
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
    paginate_by = 50
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
    form = FeedbackForm(request.POST, request.FILES)
    if form.is_valid():
        form.save()
        return JsonResponse({'status': True, 'message': 'Обращение отправлено, скоро мы с вами свяжемся'})
    return JsonResponse({'status': False, 'message': 'Одно или несколько полей формы содержат ошибки'})

