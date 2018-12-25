"""project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.urls import path, include, re_path
from django.views.generic import RedirectView

from cp_vue.api.core import cp_api
from applications.root import views as root_views
from applications.sitesettings.views import RobotsTxtView

urlpatterns = [
    path('api/v1/', include(cp_api.urls)),
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
    path('api/site/feedback/', root_views.feedback, name='feedback'),
    path('robots.txt', RobotsTxtView.as_view()),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
