import json

from collections import OrderedDict
from datetime import date, timedelta, datetime
from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse, Http404, HttpResponse
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from django.db.models import Q, F
from django.template.loader import render_to_string
from django.urls import resolve
from django.views.decorators.http import require_POST
from django.views.generic import ListView, DetailView, View
from django.utils import timezone
from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from django.template import loader
from applications.tools.utils import make_ajax_response
from applications.tools.views import InfinityLoaderListView
from applications.banrequest.views import check
from applications.root.forms import FeedbackForm, PlaceReviewForm, TextErrorForm, UploadForm
from applications.files.utils import get_tags_id, get_file_data
from applications.contentblocks.models import Page
from .models import (
    News, Event, Report, History, Person, CityGuide, Place, Special, Film, Special, WideBanner, Compilation
)

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

    def get_last_materials(self, pined_material=None, compilation_items=None):
        events = Event.objects.filter(
            is_active=True,
            start_event_date__gte=datetime.now()
        ).order_by('-publication_date')
        if pined_material and pined_material.entity == 'event-announcements':
            events = events.exclude(id=pined_material.object_id)

        if compilation_items:
            events = events.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'event']
            )
        events = events[:8]

        reports = Report.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')
        if pined_material and pined_material.entity == 'reports':
            reports = reports.exclude(id=pined_material.object_id)

        if compilation_items:
            reports = reports.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'report']
            )
        reports = reports[:8]

        places = Place.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')
        if pined_material and pined_material.entity == 'places':
            places = places.exclude(id=pined_material.object_id)

        if compilation_items:
            places = places.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'place']
            )
        places = places[:8]

        news = News.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')
        if pined_material and pined_material.entity == 'news':
            news = news.exclude(id=pined_material.object_id)

        if compilation_items:
            news = news.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'news']
            )
        news = news[:8]

        history = History.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')
        if pined_material and pined_material.entity == 'history':
            history = history.exclude(id=pined_material.object_id)

        if compilation_items:
            history = history.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'history']
            )

        history = history[:8]

        persons = Person.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')
        if pined_material and pined_material.entity == 'persons':
            persons = persons.exclude(id=pined_material.object_id)

        if compilation_items:
            persons = persons.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'person']
            )

        persons = persons[:8]

        result = list(events) + list(reports) + list(places) + list(news) + list(history) + list(persons)
        result = sorted(result, key=lambda x: x.publication_date, reverse=True)
        if pined_material:
            result = result[:6]
        else:
            result = result[:8]

        return result

    def get(self, request):
        current_date = date.today()
        page = get_page(request)
        pined_material = page.top_items.all().order_by('weight').first() if page else None
        compilation = page.compilation
        compilation_items = []
        if compilation:
            compilation_items = list(compilation.get_active_items()[:4])

        last_materials = self.get_last_materials(pined_material=pined_material, compilation_items=compilation_items)
        events = Event.objects.filter(
            is_active=True,
            start_event_date__gte=current_date
        ).order_by('-publication_date').exclude(
            id__in=[i.id for i in last_materials if i._meta.model_name == 'event']
        )
        if pined_material and pined_material.entity == 'event-announcements':
            events = events.exclude(id=pined_material.object_id)
        if compilation_items:
            events = events.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'event']
            )
        events = events[:2]

        reports = Report.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date').exclude(
            id__in=[i.id for i in last_materials if i._meta.model_name == 'report']
        )
        if pined_material and pined_material.entity == 'reports':
            reports = reports.exclude(id=pined_material.object_id)
        if compilation_items:
            reports = reports.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'report']
            )
        reports = reports[:2]

        places = Place.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).exclude(
            id__in=[i.id for i in last_materials if i._meta.model_name == 'place']
        ).order_by('?')
        if pined_material and pined_material.entity == 'places':
            places = places.exclude(id=pined_material.object_id)
        if compilation_items:
            places = places.exclude(
                id__in=[i.object_id for i in compilation_items if i.entity == 'place']
            )

        places = places[:(6-len(events)-len(reports))]

        what_to_do = list(events) + list(reports) + list(places)
        films = Film.objects.filter(is_active=True,
                                    sessions__session_time__gte=current_date,
                                    sessions__session_time__lt=current_date + timedelta(days=1)
                                    ).distinct()
        specials = Special.objects.filter(is_active=True, publication_date__lte=datetime.now())
        wide_banner = WideBanner.objects.filter((Q(start_publication_date__isnull=True) | Q(start_publication_date__lte=datetime.now())) &
                                                (Q(end_publication_date__isnull=True) | Q(end_publication_date__gte=datetime.now())),
                                                is_active=True).order_by('?').first()

        return render(request,
                      'site/index.html',
                      dict(
                          last_materials=last_materials,
                          films=films,
                          specials=specials,
                          pined_material=pined_material,
                          what_to_do=what_to_do,
                          wide_banner=wide_banner,
                      )
                      )


class NewsListView(InfinityLoaderListView):

    template_name = 'site/news-list.html'
    ajax_template_name = 'site/modules/news-list-block.html'
    context_list_name = 'news'
    ajax_context_list_name = 'news'
    items_per_page = 10

    def get_queryset(self):
        queryset = News.objects.select_related('cover').filter(is_active=True,
                                                               publication_date__lte=datetime.now()).order_by('-publication_date')
        return queryset


class NewsDetailView(DetailView):
    model = News
    queryset = News.objects.select_related('cover').filter(is_active=True, publication_date__lte=datetime.now())
    context_object_name = 'news'
    template_name = 'site/news-details.html'

    def get_queryset(self):
        qs = News.objects.select_related('cover').filter(is_active=True, publication_date__lte=timezone.now())
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs


class EventsListView(View):

    def get(self, request):
        current_date = date.today()
        page = get_page(request)
        top_objects = page.top_items.all().order_by('weight') if page else []

        events = list(Event.objects.select_related('cover').filter(
            is_active=True,
            start_event_date__gte=datetime.now()).exclude(id__in=[i.object_id for i in top_objects if i.entity == 'event-announcements']).order_by('start_event_date')[:2])

        reports = Report.objects.select_related('cover').filter(is_active=True,
                                                                publication_date__lte=datetime.now()).order_by('-publication_date')
        reports = reports.exclude(id__in=[i.object_id for i in top_objects if i.entity == 'reports'])
        if len(events) < 2:
            reports = list(reports[:3])
        else:
            reports = list(reports[:2])

        events += reports

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


class EventsListFutureView(InfinityLoaderListView):
    template_name = 'site/future-events.html'
    ajax_template_name = 'site/modules/grid-event-block.html'
    context_list_name = 'events'
    ajax_context_list_name = 'announcements'
    items_per_page = 24

    def get_queryset(self):
        return Event.objects.filter(is_active=True,
                                    start_event_date__gte=datetime.now()).order_by('start_event_date')[16:]

    def get(self, request):
        items = Event.objects.filter(is_active=True,
                                     start_event_date__gte=datetime.now()).order_by('start_event_date')
        has_next = items.count() > 16
        items = items[:16]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class EventsListPastView(InfinityLoaderListView):
    template_name = 'site/past-events.html'
    ajax_template_name = 'site/modules/grid-event-block.html'
    context_list_name = 'events'
    ajax_context_list_name = 'announcements'
    items_per_page = 24

    def get_queryset(self):
        return Event.objects.filter(is_active=True,
                                    start_event_date__lt=datetime.now()).order_by('-start_event_date')[16:]

    def get(self, request):
        items = Event.objects.filter(is_active=True,
                                     start_event_date__lt=datetime.now()).order_by('-start_event_date')
        has_next = items.count() > 16
        items = items[:16]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class EventsDetailView(DetailView):
    model = Event
    queryset = Event.objects.select_related('cover').filter(is_active=True)
    context_object_name = 'event'
    template_name = 'site/event-announcement.html'

    def get_queryset(self):
        qs = Event.objects.select_related('cover').filter(is_active=True)
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs


class ReportsListView(InfinityLoaderListView):
    template_name = 'site/all-reportage.html'
    ajax_template_name = 'site/modules/grid-reports-block.html'
    context_list_name = 'reports'
    ajax_context_list_name = 'reports'
    items_per_page = 24

    def get_queryset(self):
        return Report.objects.select_related(
            'cover'
        ).filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')[16:]

    def get(self, request):
        items = Report.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')
        has_next = items.count() > 16
        items = items[:16]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class ReportsDetailView(DetailView):
    model = Report
    queryset = Report.objects.filter(is_active=True, publication_date__lte=datetime.now())
    context_object_name = 'report'
    template_name = 'site/reportage-details.html'

    def get_queryset(self):
        qs = Report.objects.filter(is_active=True, publication_date__lte=timezone.now())
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs


class HistoryListView(InfinityLoaderListView):
    template_name = 'site/all-history.html'
    ajax_template_name = 'site/modules/grid-history-block.html'
    context_list_name = 'articles'
    ajax_context_list_name = 'articles'
    items_per_page = 24

    def get_queryset(self):
        return History.objects.select_related(
            'cover'
        ).filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')[15:]

    def get(self, request):
        items = History.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')
        has_next = items.count() > 15
        items = items[:15]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class HistoryDetailView(DetailView):
    model = History
    queryset = History.objects.filter(is_active=True, publication_date__lte=datetime.now())
    context_object_name = 'history'
    template_name = 'site/history-details.html'

    def get_queryset(self):
        qs = History.objects.filter(is_active=True, publication_date__lte=timezone.now())
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs


class PersonsListView(InfinityLoaderListView):
    template_name = 'site/all-people.html'
    ajax_template_name = 'site/modules/grid-persons-block.html'
    context_list_name = 'persons'
    ajax_context_list_name = 'articles'
    items_per_page = 24

    def get_queryset(self):
        return Person.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')[15:]

    def get(self, request):
        items = Person.objects.filter(
            is_active=True,
            publication_date__lte=datetime.now()
        ).order_by('-publication_date')
        has_next = items.count() > 15
        items = items[:15]
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'has_next': has_next})


class PersonsDetailView(DetailView):
    model = Person
    queryset = Person.objects.filter(is_active=True, publication_date__lte=timezone.now())
    context_object_name = 'person'
    template_name = 'site/people-details.html'

    def get_queryset(self):
        qs = Person.objects.filter(is_active=True, publication_date__lte=datetime.now())
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs


class CityGuidesDetailView(View):

    def get(self, request, pk):
        try:
            if self.request.user and self.request.user.is_staff:
                guide = CityGuide.objects.get(id=pk)
            else:
                guide = CityGuide.objects.get(id=pk, is_active=True)
        except Exception as e:
            raise Http404

        template_name = 'site/city-guide-%s.html' % guide.guide_format
        if self.request.user and self.request.user.is_staff:
            guides = CityGuide.objects.all()
        else:
            guides = CityGuide.objects.filter(is_active=True)
        formats = OrderedDict(CityGuide.GUIDE_FORMATS)
        formats = list(formats.keys())
        guides = sorted(guides, key=lambda x: formats.index(x.guide_format) if x.guide_format in formats else len(formats))
        guide_items = guide.items.filter(is_active=True).order_by('weight')
        try:
            return render(request, template_name, dict(guide=guide,
                                                       guide_items=guide_items,
                                                       guides=guides))
        except Exception as e:
            raise Http404


class PlaceListView(InfinityLoaderListView):
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
        qs = Place.objects.filter(is_active=True,
                                  publication_date__lte=datetime.now()).order_by('-publication_date')
        if top_objects:
            qs = qs.exclude(id__in=[i.object_id for i in top_objects if i.entity == 'places'])
        return qs[11:]

    def get(self, request):
        page = get_page(request)
        top_objects = page.top_items.all().order_by('weight') if page else []

        items = Place.objects.filter(is_active=True,
                                     publication_date__lte=datetime.now()).order_by('-publication_date')

        if top_objects:
            items = items.exclude(id__in=[i.object_id for i in top_objects if i.entity == 'places'])
        has_next = items.count() > 11
        items = items[:11]
        guides = CityGuide.objects.filter(is_active=True)
        formats = OrderedDict(CityGuide.GUIDE_FORMATS)
        formats = list(formats.keys())
        guides = sorted(guides,
                        key=lambda x: formats.index(x.guide_format) if x.guide_format in formats else len(formats))
        return render(request, self.template_name, {self.context_list_name: items,
                                                    'guides': guides,
                                                    'top_objects': top_objects,
                                                    'has_next': has_next})


class PlaceDetailView(DetailView):
    model = Place
    queryset = Place.objects.filter(is_active=True, publication_date__lte=datetime.now())
    context_object_name = 'place'
    template_name = 'site/place-details.html'

    def get_queryset(self):
        qs = Place.objects.filter(is_active=True, publication_date__lte=timezone.now())
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs


class SpecialsListView(InfinityLoaderListView):
    template_name = 'site/all-special-projects.html'
    ajax_template_name = 'site/modules/special-projects-block.html'
    context_list_name = 'specials'
    ajax_context_list_name = 'specials'
    items_per_page = 5

    def get_queryset(self):
        queryset = Special.objects.filter(is_active=True,
                                    publication_date__lte=datetime.now()).order_by('-publication_date')
        return queryset


class SpecialsDetailView(DetailView):
    model = Special
    context_object_name = 'special'
    template_name = 'site/special-project.html'
    slug_field = 'codename'

    def get_queryset(self):
        qs = Special.objects.filter(is_active=True, publication_date__lte=timezone.now())
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs

    def get_context_data(self, **kwargs):
        context = super(SpecialsDetailView, self).get_context_data(**kwargs)

        obj = context.get('object')
        try:
            template_name = 'site/special-project/%s.html' % obj.codename
            loader.get_template(template_name)
        except Exception as e:
            raise Http404
        else:
            context["template_name"] = template_name
            return context


class SpecSpecialsDetailView(DetailView):
    model = Special
    context_object_name = 'special'
    template_name = 'site/s-special-project.html'
    slug_field = 'codename'

    def get_queryset(self):
        qs = Special.objects.filter(is_active=True, publication_date__lte=timezone.now())
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs

    def get_context_data(self, **kwargs):
        context = super(SpecSpecialsDetailView, self).get_context_data(**kwargs)

        obj = context.get('object')
        try:
            template_name = 'site/special-projects-desktop/%s.html' % obj.codename
            loader.get_template(template_name)
        except Exception as e:
            raise Http404
        else:
            context["template_name"] = template_name
            return context


class FilmDetailView(DetailView):
    model = Film
    context_object_name = 'film'
    template_name = 'site/film-announcement.html'

    def get_queryset(self):
        qs = Film.objects.filter(is_active=True).prefetch_related('sessions')
        if self.request.user and self.request.user.is_staff:
            qs = self.model.objects.select_related('cover').all()
        return qs

    def get_context_data(self, **kwargs):
        context = super(FilmDetailView, self).get_context_data(**kwargs)
        current_date = date.today()

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

        context["today_films"] = today_films
        context["tomorrow_films"] = tomorrow_films
        context["future_films"] = future_films

        return context


class PolicyView(View):

    def get(self, request):
        return render(request, "site/privacy.html", dict())


class SearchView(View):

    def get_items(self, qs, table_name, query):
        items = qs.extra(
            select=dict(rank="ts_rank('%s.search_vector', to_tsquery('ru_fts', '%s'))" % (table_name, query)),
            where=["%s.search_vector @@ to_tsquery('ru_fts', '%s')" % (table_name, query)],

        )
        items = items.order_by('-rank')
        return items

    def search_news(self, query):
        items = News.objects.select_related('cover').filter(is_active=True,
                                                            publication_date__lte=datetime.now())
        return self.get_items(items, 'root_news', query)


    def search_events(self, query):
        items = Event.objects.select_related('cover').filter(is_active=True)
        return self.get_items(items, 'root_event', query)


    def search_reports(self, query):
        items = Report.objects.select_related('cover').filter(is_active=True, publication_date__lte=datetime.now())
        return self.get_items(items, 'root_report', query)


    def search_history(self, query):
        items = History.objects.select_related('cover').filter(is_active=True, publication_date__lte=datetime.now())
        return self.get_items(items, 'root_history', query)


    def search_place(self, query):
        items = Place.objects.select_related('cover').filter(is_active=True, publication_date__lte=datetime.now())
        return self.get_items(items, 'root_place', query)


    def search_guides(self, query):
        items = CityGuide.objects.filter(is_active=True)
        return self.get_items(items, 'root_cityguide', query)


    def search_persons(self, query):
        items = Person.objects.select_related('cover').filter(is_active=True, publication_date__lte=datetime.now())
        return self.get_items(items, 'root_person', query)


    def search_specials(self, query):
        items = Special.objects.select_related('cover').filter(is_active=True, publication_date__lte=datetime.now())
        return self.get_items(items, 'root_special', query)

    def get_context(self, request):
        context = dict()
        items = []
        page = 1

        if request.method == 'GET':
            search_text = request.GET.get('q', '')
            section = request.GET.get('section')

        elif request.method == 'POST':
            search_text = request.POST.get('q', '')
            section = request.POST.get('section')
            page = request.POST.get('page', None)
            try:
                page = int(page)
            except:
                page = 0
        else:
            raise Http404

        if len(search_text) > 2:

            query = u' & '.join(['%s:*' % s for s in search_text.split(' ') if s])

            news = self.search_news(query)
            news_count = news.count()
            events = self.search_events(query)
            events_count = events.count()
            reports = self.search_reports(query)
            reports_count = reports.count()
            history = self.search_history(query)
            history_count = history.count()
            place = self.search_place(query)
            place_count = place.count()
            guides = self.search_guides(query)
            guides_count = guides.count()
            persons = self.search_persons(query)
            persons_count = persons.count()
            specials = self.search_specials(query)
            specials_count = specials.count()

            result = OrderedDict(
                news=dict(qs=news, count=news_count, name='Новости'),
                events=dict(qs=events, count=events_count, name='События'),
                reports=dict(qs=reports, count=reports_count, name='Репортажи'),
                history=dict(qs=history, count=history_count, name='История'),
                place=dict(qs=place, count=place_count, name='Места'),
                guides=dict(qs=guides, count=guides_count, name='Гид по городу'),
                persons=dict(qs=persons, count=persons_count, name='Люди'),
                specials=dict(qs=specials, count=specials_count, name='Спецпроекты'),
            )

            if not section:
                for k, v in result.items():
                    if v.get('count', 0) > 0:
                        section = k
                        break

            items = result.get(section, dict()).get('qs', [])

            paginator = Paginator(items, 12)

            try:
                items = paginator.page(page)
            except PageNotAnInteger:
                items = paginator.page(1)
            except EmptyPage:
                items = paginator.page(1)

            context.update({
                'search_text': search_text,
                'result': result,
                'section': section,
                'items': items,
                'paginator': items.paginator,
                'has_next': items.has_next(),
            })

        context.update({
            'search_text': search_text,
            'items': items,
        })

        return context

    def instant_search(self, request):
        common_context = self.get_context(request)
        search_result = common_context.get('result', dict())

        items = []
        all_amount = 0
        for i in search_result.values():
            if i.get('count', 0) > 0:
                qs = i.get('qs', [])
                all_amount += i.get('count', 0)
                cl = list(qs[:7])
                for c in cl:
                    setattr(c, 'search_section', i.get('name', ''))
                items += cl

        items = sorted(items, key=lambda x: x.rank, reverse=True)
        items = items[:7]

        response = dict(
            templates=dict(search_result=loader.render_to_string('site/modules/instant-search.html',
                                                                 dict(items=items, all_amount=all_amount,
                                                                      search_text=common_context.get('search_text')),
                                                                 request=request),
                           )
        )
        return HttpResponse(make_ajax_response(True, response))

    def get(self, request):
        context = self.get_context(request)
        return render(request, 'site/search-result.html', context)

    def post(self, request, is_instant_search=False):
        if is_instant_search:
            return self.instant_search(request)
        else:
            context = self.get_context(request)
            response = dict(
                data={'last': not context.get('has_next')},
                templates=dict(search_result=loader.render_to_string('site/modules/search-result-grid.html',
                                                                     context,
                                                                     request=request),
                               )
            )
            return HttpResponse(make_ajax_response(True, response))


class CompilationDetailView(View):

    def get(self, request, codename):
        try:
            compilation = Compilation.objects.get(codename=codename, is_active=True)
        except:
            raise Http404
        else:
            materials = compilation.get_active_items()
            context = dict(
                compilation=compilation,
                materials=materials
            )
            return render(request, "site/selection.html", context)


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
                    'sender_phone': instance.phone,
                    'has_attachments': instance.attachments.all().exists(),
                    'feedback_id': instance.id,
                    'feedback_content': instance.text,
                    'feedback_cp_link': '{scheme}://{host}/admin/feedbacks/{id}/'.format(
                        scheme=request.scheme, host=request.get_host(), id=instance.id
                    )
                }
                try:
                    send_notification.delay('feedback', template_context=template_context, recipient_sms=[],
                                            recipient_email=[instance.email], template_tags=['site_tags'])
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
                    'sender_phone': instance.phone,
                    'review_content': instance.text,
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
                'message_cp_link': '{scheme}:{host}/admin/text-errors/{id}/'.format(
                        scheme=request.scheme, host=request.get_host(), id=obj.id
                    ),
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


class UploadFile(View):

    def post(self, request):
        current_url = resolve(request.path_info).url_name
        if not check(request, current_url):
            return JsonResponse({'status': False, 'message': settings.BAN_MESSAGE})
        file_obj = request.FILES['file']
        ext = file_obj.name.split('.')[-1]

        if file_obj.size == 0 or int(round(float(file_obj.size) / 1024, 0)) > 2048:
            result = {'status': False, 'message': settings.COMMON_FORM_ERROR_MESSAGE}
            return JsonResponse(result)

        if ext not in ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip']:
            result = {'status': False, 'message': settings.COMMON_FORM_ERROR_MESSAGE}
            return JsonResponse(result)

        tags = ['Обратная связь / Обращения в редакцию']
        data = get_file_data(file_obj)
        data['tags'] = get_tags_id(tags)
        form = UploadForm(data, request.FILES)
        if form.is_valid():
            form.save()
            obj = form.instance
            result = {
                'status': True,
                'data': dict(file_id=obj.id)
            }
            return JsonResponse(result)
        else:
            result = {'status': False, 'message': settings.COMMON_FORM_ERROR_MESSAGE}
            return JsonResponse(result)


class BaseSitemap(Sitemap):

    def items(self):
        return ['index', 'policy', 'news-list', 'events-index', 'events-list-future', 'events-list-past', 'reports-list',
                'history-list', 'persons-list', 'places-list', 'specials-list',]

    def location(self, item):
        return reverse(item)


class NewsSitemap(Sitemap):

    def items(self):
        return News.objects.select_related('cover').filter(is_active=True,
                                                           publication_date__lte=datetime.now()).order_by('-publication_date')

    def lastmod(self, obj):
        return obj.edit_date


class EventsSitemap(Sitemap):

    def items(self):
        return Event.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.edit_date


class ReportsSitemap(Sitemap):

    def items(self):
        return Report.objects.filter(is_active=True, publication_date__lte=datetime.now())

    def lastmod(self, obj):
        return obj.edit_date


class HistorySitemap(Sitemap):

    def items(self):
        return History.objects.filter(is_active=True, publication_date__lte=datetime.now())

    def lastmod(self, obj):
        return obj.edit_date


class PersonsSitemap(Sitemap):

    def items(self):
        return Person.objects.filter(is_active=True, publication_date__lte=datetime.now())

    def lastmod(self, obj):
        return obj.edit_date


class CityGuidesSitemap(Sitemap):

    def items(self):
        return CityGuide.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.edit_date


class PlacesSitemap(Sitemap):

    def items(self):
        return Place.objects.filter(is_active=True, publication_date__lte=datetime.now())

    def lastmod(self, obj):
        return obj.edit_date


class SpecialsSitemap(Sitemap):

    def items(self):
        return Special.objects.filter(is_active=True, publication_date__lte=datetime.now())

    def lastmod(self, obj):
        return obj.edit_date


class FilmsSitemap(Sitemap):

    def items(self):
        return Film.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.edit_date


class CompilationSitemap(Sitemap):

    def items(self):
        return Compilation.objects.filter(is_active=True)

    def lastmod(self, obj):
        return obj.edit_date
