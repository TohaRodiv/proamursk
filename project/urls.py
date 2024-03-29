from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include, re_path
from django.views.generic import RedirectView, TemplateView
from django.contrib.sitemaps.views import sitemap
from cp_vue.api.core import cp_api
from applications.root import views as root_views
from applications.sitesettings.views import RobotsTxtView


sitemaps = {
    'base': root_views.BaseSitemap,
    'news': root_views.NewsSitemap,
    'events': root_views.EventsSitemap,
    'reports': root_views.ReportsSitemap,
    'history': root_views.HistorySitemap,
    'persons': root_views.PersonsSitemap,
    'city_guides': root_views.CityGuidesSitemap,
    'specials': root_views.SpecialsSitemap,
    'films': root_views.FilmsSitemap,
    'places': root_views.PlacesSitemap,
    'compilation': root_views.CompilationSitemap,
}


urlpatterns = [
    re_path(r'^sitemap.xml$', sitemap, {'sitemaps': sitemaps}),
]


urlpatterns += [
    re_path(r'^admin/', TemplateView.as_view(template_name="cp_vue/index.html")),
    re_path(r'^links1062917.html', TemplateView.as_view(template_name="links1062917.html")),
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
    path('s-specials/', RedirectView.as_view(url='/specials/'), name='s-specials-list'),
    path('s-specials/<str:slug>/', root_views.SpecSpecialsDetailView.as_view(), name='s-specials-detail'),
    path('specials/', root_views.SpecialsListView.as_view(), name='specials-list'),
    path('specials/<str:slug>/', root_views.SpecialsDetailView.as_view(), name='specials-detail'),
    path('search/', root_views.SearchView.as_view(), name='search'),
    path('films/', RedirectView.as_view(url='/')),
    path('films/<int:pk>/', root_views.FilmDetailView.as_view(), name='films-detail'),
    path('compilations/', RedirectView.as_view(url='/')),
    path('compilations/<str:codename>/', root_views.CompilationDetailView.as_view(), name='compilation-detail'),
    path('api/site/news/', root_views.NewsListView.as_view(), name='api-news'),
    path('api/site/place-review/', root_views.place_review, name='place-review'),
    path('api/site/feedback/', root_views.feedback, name='feedback'),
    path('api/site/announcements/', root_views.EventsListPastView.as_view(), name='ajax-announcements'),
    path('api/site/future-announcements/', root_views.EventsListFutureView.as_view(), name='ajax-announcements'),
    path('api/site/reports/', root_views.ReportsListView.as_view(), name='ajax-reports'),
    path('api/site/persons/', root_views.PersonsListView.as_view(), name='ajax-persons'),
    path('api/site/places/', root_views.PlaceListView.as_view(), name='ajax-places'),
    path('api/site/history/', root_views.HistoryListView.as_view(), name='ajax-history'),
    path('api/site/bugreport/', root_views.bugreport, name='ajax-bugreport'),
    path('api/site/specials/', root_views.SpecialsListView.as_view(), name='ajax-specials'),
    path('api/site/search-result/', root_views.SearchView.as_view(), name='ajax-search-result'),
    path('api/site/instant-search/', root_views.SearchView.as_view(), dict(is_instant_search=True), name='ajax-instant-search'),
    path('api/site/upload-file/', root_views.UploadFile.as_view(), name='ajax-upload-file'),
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
