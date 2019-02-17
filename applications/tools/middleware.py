import traceback
import sys
import re
#import httpagentparser
from django.conf import settings
from django.shortcuts import render_to_response
from django.db import connection
from logging import getLogger
from django.http import HttpResponseRedirect
from django.middleware.csrf import get_token
from django.utils.deprecation import MiddlewareMixin

logger = getLogger(__name__)


class DetectBrowser(object):

    def process_request(self, request):
        if request.META and 'HTTP_USER_AGENT' in request.META:
            browser = httpagentparser.detect(request.META['HTTP_USER_AGENT']).get('browser', None)
            if browser is not None and hasattr(settings, 'ALLOWED_BROWSER') and isinstance(settings.ALLOWED_BROWSER, dict):
                browser_version = settings.ALLOWED_BROWSER.get(browser['name'], None)
                try:
                    client_version = int(browser['version'].split('.')[0])
                except:
                    client_version = None
                if browser_version is not None and client_version is not None and client_version < browser_version:
                    return render_to_response('badbrowser.html')


class SetCsrfTokenCookieMiddleware(MiddlewareMixin):

    def process_request(self, request):
        if not request.path.startswith('/admin/'):
            get_token(request)


class ProcessExceptionMiddleware(object):

    def process_exception(self, request, exception):
        # Just print the exception object to stdout
        print(exception)

        # Print the familiar Python-style traceback to stderr
        traceback.print_exc()

        # Write the traceback to a file or similar
        #myfile.write(''.join(traceback.format_exception(*sys.exc_info())))


class QueryCountDebugMiddleware(MiddlewareMixin):
    """
    This middleware will log the number of queries run
    and the total time taken for each request (with a
    status code of 200). It does not currently support
    multi-db setups.
    """
    def process_response(self, request, response):
        if response.status_code == 200:
            total_time = 0

            for query in connection.queries:
                query_time = query.get('time')
                if query_time is None:
                    # django-debug-toolbar monkeypatches the connection
                    # cursor wrapper and adds extra information in each
                    # item in connection.queries. The query time is stored
                    # under the key "duration" rather than "time" and is
                    # in milliseconds, not seconds.
                    query_time = query.get('duration', 0) / 1000
                total_time += float(query_time)
            # logger.debug('%s queries run, total %s seconds' % (len(connection.queries), total_time))
            for i in connection.queries:
                print(i['sql'])
            print(len(connection.queries), 'query', total_time)
            #logger.debug('%s queries run, total %s seconds' % (len(connection.queries), total_time))
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        print('=======================================================================================')
        print(request.path)
        print(view_func.__name__ if hasattr(view_func, '__name__') else 'no_name')


class HaystackQueryDebugMiddleware(object):
    """
    This middleware will log the number of queries run
    and the total time taken for each request (with a
    status code of 200). It does not currently support
    multi-db setups.
    """
    def process_response(self, request, response):
        from haystack import connections
        if response.status_code == 200:
            total_time = 0

            for con in connections.all():
                print(dir(con))
                print(dir(con.query))
                print(con.query.build_query())
        return response
