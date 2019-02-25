# -*- coding: utf-8 -*-

from django import template
from django.template import Context, Template

from applications.root.models import News, Event, Place, History, Person, Report, CityGuide, Special

register = template.Library()