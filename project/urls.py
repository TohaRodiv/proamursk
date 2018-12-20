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
from django.urls import path, include, re_path
from cp_vue.api.core import cp_api
from applications.root.views import test_view

urlpatterns = [
    path('api/v1/', include(cp_api.urls)),
    path('news/',  test_view, name='news-list'),
    path('news/<int:pk>/',  test_view, name='news-detail'),
    path('events/', test_view, name='events-index'),
    path('events/<int:pk>/', test_view, name='events-detail'),
    path('reports/', test_view, name='reports-list'),
    path('reports/<int:pk>/', test_view, name='reports-detail'),
    path('history/', test_view, name='history-list'),
    path('history/<int:pk>/', test_view, name='history-detail'),
    path('persons/', test_view, name='persons-list'),
    path('persons/<int:pk>/', test_view, name='persons-detail'),
]
