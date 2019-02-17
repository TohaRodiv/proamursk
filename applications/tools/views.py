import json

from django.conf import settings
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import Http404, HttpResponse
from django.shortcuts import render
from django.views.generic import View
from django.template import loader
from applications.tools.utils import make_ajax_response


class InfinityLoaderListView(View):
    template_name = None
    ajax_template_name = None
    queryset = None
    context_list_name = 'items'
    ajax_context_list_name = 'items'
    items_per_page = 10

    def get_queryset(self):
        return self.queryset.all()

    def get_items_page(self, page=1):
        paginator = Paginator(self.get_queryset(), self.items_per_page)
        try:
            page_data = paginator.page(page)
        except PageNotAnInteger:
            page_data = paginator.page(1)
        except EmptyPage:
            page_data = paginator.page(1)

        return page_data

    def get(self, request):
        items = self.get_items_page()
        return render(request, self.template_name, {self.context_list_name: items})

    def post(self, request):
        if request.is_ajax():
            try:
                page = int(request.POST.get('page', 1))
            except:
                page = 1
            items = self.get_items_page(page=page)

            if page <= items.paginator.page_range[-1]:
                response = dict(templates={self.ajax_context_list_name: loader.render_to_string(self.ajax_template_name,
                                                                                                {self.context_list_name: items},
                                                                                                request=request)},
                                data={'last': not items.has_next()})
                return HttpResponse(make_ajax_response(True, response))

            response = dict(message=settings.COMMON_ERROR_MESSAGE)
            return HttpResponse(make_ajax_response(False, response))
        else:
            raise Http404

