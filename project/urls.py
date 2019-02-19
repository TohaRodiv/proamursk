from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include, re_path
from django.views.generic import RedirectView, TemplateView

from cp_vue.api.core import cp_api
from applications.root import views as root_views
from applications.sitesettings.views import RobotsTxtView

urlpatterns = [
    re_path(r'^admin/', TemplateView.as_view(template_name="cp_vue/index.html")),
    path('api/v1/', include(cp_api.urls)),
    path('',  root_views.IndexView.as_view(), name='index'),
    path('policy/',  root_views.PolicyView.as_view(), name='policy'),
    path('news/',  root_views.NewsListView.as_view(), name='news-list'),
    path('news/<int:pk>/',  root_views.NewsDetailView.as_view(), name='news-detail'),
    path('events/', root_views.EventsListView.as_view(), name='events-index'),
    path('events/future/', root_views.EventsListFutureView.as_view(), name='events-list-future'),
    path('events/past/', root_views.EventsListPastView.as_view(), name='events-list-past'),
    path('events/<int:pk>/', root_views.EventsDetailView.as_view(), name='events-detail'),
    path('reports/', root_views.ReportsListView.as_view(), name='reports-list'),
    path('reports/<int:pk>/', root_views.ReportsDetailView.as_view(), name='reports-detail'),
    path('history/', root_views.HistoryListView.as_view(), name='history-list'),
    path('history/<int:pk>/', root_views.HistoryDetailView.as_view(), name='history-detail'),
    path('persons/', root_views.PersonsListView.as_view(), name='persons-list'),
    path('persons/<int:pk>/', root_views.PersonsDetailView.as_view(), name='persons-detail'),
    path('city-guides/', RedirectView.as_view(url='/')),
    path('city-guides/<int:pk>/', root_views.CityGuidesDetailView.as_view(), name='city-guides-detail'),
    path('places/', root_views.PlaceListView.as_view(), name='places-list'),
    path('places/<int:pk>/', root_views.PlaceDetailView.as_view(), name='places-detail'),
    path('specials/', root_views.SpecialsListView.as_view(), name='specials-list'),
    path('specials/<str:slug>/', root_views.SpecialsDetailView.as_view(), name='specials-detail'),
    path('films/', RedirectView.as_view(url='/')),
    path('films/<int:pk>/', root_views.FilmDetailView.as_view(), name='films-detail'),
    path('api/site/news/', root_views.NewsListView.as_view(), name='api-news'),
    path('api/site/place-review/', root_views.place_review, name='place-review'),
    path('api/site/feedback/', root_views.feedback, name='feedback'),
    path('api/site/announcements/', root_views.EventsListPastView.as_view(), name='ajax-announcements'),
    path('api/site/reports/', root_views.ReportsListView.as_view(), name='ajax-reports'),
    path('api/site/persons/', root_views.PersonsListView.as_view(), name='ajax-persons'),
    path('api/site/places/', root_views.PlaceListView.as_view(), name='ajax-places'),
    path('api/site/history/', root_views.HistoryListView.as_view(), name='ajax-history'),
    path('api/site/bugreport/', root_views.bugreport, name='ajax-bugreport'),
    path('api/site/specials/', root_views.SpecialsListView.as_view(), name='ajax-specials'),
    path('api/mailing/', include('applications.mailing.urls')),
    path('robots.txt', RobotsTxtView.as_view())
]

if settings.DEBUG:
    # import debug_toolbar
    # urlpatterns = [
    #     path('__debug__/', include(debug_toolbar.urls)),
    # ] + urlpatterns
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = root_views.custom_handler404
