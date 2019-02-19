import json

from datetime import date, timedelta, datetime
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse, Http404, HttpResponse
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.db.models import Q
from django.template.loader import render_to_string
from django.urls import resolve
from django.views.decorators.http import require_POST
from django.views.generic import ListView, DetailView, View
from django.utils import timezone

from django.template import loader
from applications.tools.utils import make_ajax_response
from applications.tools.views import InfinityLoaderListView
from applications.banrequest.views import check
from applications.root.forms import FeedbackForm, PlaceReviewForm, TextErrorForm
from applications.contentblocks.models import Page
from .models import News, Event, Report, History, Person, CityGuide, Place, Special, Film, Special, WideBanner

try:
    from applications.notifications.tasks import send_notification
except ImportError:
    send_notification = None
    try:
        from applications.api.tasks import send_email
    except ImportError:
        send_email = None


def custom_handler404(request, exception):
    return render(request, '404.html', status=404)


def get_page(request):
    page = None
    try:
        url_name = request.resolver_match.url_name
    except:
        pass
    else:
        try:
            page = Page.objects.select_related().get(codename=url_name)
        except:
            pass

    return page


class IndexView(View):

    def get(self, request):
        current_date = date.today()
        page = get_page(request)
        top_objects = page.top_items.all().order_by('weight') if page else []
        events = Event.objects.filter(is_active=True,
                                      start_event_date__gte=current_date).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'event-announcements']).order_by('start_event_date')[:2]
        reports = Report.objects.filter(is_active=True,
                                       publication_date__lte=timezone.now()).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'reports']).order_by('-publication_date')[:2]
        places = Place.objects.filter(is_active=True, publication_date__lte=timezone.now()).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'places']).order_by('-publication_date')[:(6-len(events)-len(reports))]
        what_to_do = list(events) + list(reports) + list(places)
        films = Film.objects.filter(is_active=True,
                                    sessions__session_time__gte=current_date,
                                    sessions__session_time__lt=current_date + timedelta(days=1)
                                    ).distinct()
        specials = Special.objects.filter(is_active=True, publication_date__lte=timezone.now())
        wide_banner = WideBanner.objects.filter((Q(start_publication_date__isnull=True) | Q(start_publication_date__lte=datetime.now())) &
                                                (Q(end_publication_date__isnull=True) | Q(end_publication_date__gte=datetime.now())),
                                                is_active=True).order_by('?').first()
        return render(request, 'site/index.html', dict(films=films,
                                                       specials=specials,
                                                       top_objects=top_objects,
                                                       what_to_do=what_to_do,
                                                       wide_banner=wide_banner))


class NewsListView(InfinityLoaderListView):
    queryset = News.objects.filter(is_active=True, publication_date__lte=timezone.now()).order_by('-publication_date')
    template_name = 'site/news-list.html'
    ajax_template_name = 'site/modules/news-list-block.html'
    context_list_name = 'news'
    ajax_context_list_name = 'news'
    items_per_page = 1


class NewsDetailView(DetailView):
    model = News
    queryset = News.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'news'
    template_name = 'site/news-details.html'


class EventsListView(View):

    def get(self, request):
        current_date = date.today()
        page = get_page(request)
        top_objects = page.top_items.all().order_by('weight') if page else []

        events = list(Event.objects.filter(is_active=True,
                                           start_event_date__gte=timezone.now()).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'event-announcements']).order_by('-start_event_date')[:4])

        today_films = Film.objects.filter(is_active=True,
                                    sessions__session_time__gte=current_date,
                                    sessions__session_time__lt=current_date + timedelta(days=1)
                                    ).distinct()
        tomorrow_films = Film.objects.filter(is_active=True,
                                          sessions__session_time__gte=current_date + timedelta(days=1),
                                          sessions__session_time__lt=current_date + timedelta(days=2)
                                          ).distinct()
        future_films = Film.objects.filter(is_active=True,
                                           sessions__session_time__gte=current_date,
                                           ).distinct()
        return render(request, 'site/all-events.html',
                      dict(
                          top_objects=top_objects,
                          events=events,
                          today_films=today_films,
                          tomorrow_films=tomorrow_films,
                          future_films=future_films
                      )
                     )


class EventsListFutureView(View):

    def get(self, request):
        items = Event.objects.filter(is_active=True,
                                     start_event_date__gte=timezone.now()).order_by('-start_event_date')
        return render(request, 'site/future-events.html', {'events': items})


class EventsListPastView(InfinityLoaderListView):
    queryset = Event.objects.filter(is_active=True,
                                    start_event_date__lt=timezone.now()).order_by('-start_event_date')[16:]

    template_name = 'site/past-events.html'
    ajax_template_name = 'site/modules/grid-event-block.html'
    context_list_name = 'events'
    ajax_context_list_name = 'announcements'
    items_per_page = 24

    def get(self, request):
        items = Event.objects.filter(is_active=True,
                                     start_event_date__lt=timezone.now()).order_by('-start_event_date')
        has_next = items.count() > 16
        items = items[:16]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class EventsDetailView(DetailView):
    model = Event
    queryset = Event.objects.filter(is_active=True)
    context_object_name = 'event'
    template_name = 'site/event-announcement.html'


class ReportsListView(InfinityLoaderListView):
    queryset = Report.objects.filter(is_active=True,
                                     publication_date__lte=timezone.now()).order_by('-publication_date')[12:]

    template_name = 'site/all-reportage.html'
    ajax_template_name = 'site/modules/grid-reports-block.html'
    context_list_name = 'reports'
    ajax_context_list_name = 'reports'
    items_per_page = 24

    def get_queryset(self):
        try:
            page = Page.objects.select_related().get(codename="reports-list")
        except:
            page = None

        top_objects = page.top_items.all().order_by('weight') if page else []
        return self.queryset.all().exclude(id__in=[i.object_id for i in top_objects if i.codename == 'reports'])

    def get(self, request):
        page = get_page(request)
        top_objects = page.top_items.all().order_by('weight') if page else []

        items = Report.objects.filter(is_active=True,
                                      publication_date__lte=timezone.now()).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'reports']).order_by('-publication_date')
        has_next = items.count() > 12
        items = items[:12]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class ReportsDetailView(DetailView):
    model = Report
    queryset = Report.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'report'
    template_name = 'site/reportage-details.html'


class HistoryListView(InfinityLoaderListView):
    queryset = History.objects.filter(is_active=True,
                                      publication_date__lte=timezone.now()).order_by('-publication_date')[12:]

    template_name = 'site/all-history.html'
    ajax_template_name = 'site/modules/grid-history-block.html'
    context_list_name = 'articles'
    ajax_context_list_name = 'articles'
    items_per_page = 24

    def get_queryset(self):
        try:
            page = Page.objects.select_related().get(codename="history-list")
        except:
            page = None

        top_objects = page.top_items.all().order_by('weight') if page else []
        return self.queryset.all().exclude(id__in=[i.object_id for i in top_objects if i.codename == 'history'])

    def get(self, request):
        page = get_page(request)
        top_objects = page.top_items.all().order_by('weight') if page else []
        items = History.objects.filter(is_active=True,
                                       publication_date__lte=timezone.now()).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'history']).order_by('-publication_date')
        has_next = items.count() > 12
        items = items[:12]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class HistoryDetailView(DetailView):
    model = History
    queryset = History.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'history'
    template_name = 'site/history-details.html'


class PersonsListView(InfinityLoaderListView):
    queryset = Person.objects.filter(is_active=True,
                                     publication_date__lte=timezone.now()).order_by('-publication_date')[11:]

    template_name = 'site/all-people.html'
    ajax_template_name = 'site/modules/grid-persons-block.html'
    context_list_name = 'persons'
    ajax_context_list_name = 'articles'
    items_per_page = 24

    def get_queryset(self):
        try:
            page = Page.objects.select_related().get(codename="persons-list")
        except:
            page = None

        top_objects = page.top_items.all().order_by('weight') if page else []
        return self.queryset.all().exclude(id__in=[i.object_id for i in top_objects if i.codename == 'persons'])

    def get(self, request):
        page = get_page(request)
        top_objects = page.top_items.all().order_by('weight') if page else []

        items = Person.objects.filter(is_active=True,
                                      publication_date__lte=timezone.now()).exclude(id__in=[i.object_id for i in top_objects if i.codename == 'persons']).order_by('-publication_date')
        has_next = items.count() > 11
        items = items[:11]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class PersonsDetailView(DetailView):
    model = Person
    queryset = Person.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'person'
    template_name = 'site/people-details.html'


class CityGuidesDetailView(DetailView):
    model = CityGuide
    queryset = CityGuide.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'guide'
    template_name = 'root/city_guides_detail.html'


class PlaceListView(InfinityLoaderListView):
    queryset = Place.objects.filter(is_active=True,
                                      publication_date__lte=timezone.now()).order_by('-publication_date')[11:]

    template_name = 'site/all-places.html'
    ajax_template_name = 'site/modules/grid-places-block.html'
    context_list_name = 'places'
    ajax_context_list_name = 'places'
    items_per_page = 24

    def get_queryset(self):
        try:
            page = Page.objects.select_related().get(codename="places-list")
        except:
            page = None

        top_objects = page.top_items.all().order_by('weight') if page else []
        return self.queryset.all().exclude(id__in=[i.object_id for i in top_objects if i.codename == 'places'])

    def get(self, request):
        items = Place.objects.filter(is_active=True,
                                     publication_date__lte=timezone.now()).order_by('-publication_date')
        has_next = items.count() > 11
        items = items[:11]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class PlaceDetailView(DetailView):
    model = Place
    queryset = Place.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'place'
    template_name = 'site/place-details.html'


class SpecialsListView(InfinityLoaderListView):
    queryset = Special.objects.filter(is_active=True,
                                    publication_date__lte=timezone.now()).order_by('-publication_date')

    template_name = 'site/all-special-projects.html'
    ajax_template_name = 'site/modules/special-projects-block.html'
    context_list_name = 'specials'
    ajax_context_list_name = 'specials'
    items_per_page = 1


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
    template_name = 'site/film-announcement.html'


class PolicyView(View):

    def get(self, request):
        return render(request, "site/privacy.html", dict())


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
def bugreport(request):
    result = {'status': False, 'message': settings.COMMON_ERROR_MESSAGE}
    if request.is_ajax():
        form = TextErrorForm(request.POST)
        if form.is_valid():
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
