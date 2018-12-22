from django.views.generic import TemplateView

from .models import Settings


def get_site_settings():
    try:
        site_settings = Settings.objects.get(pk=1)
    except:
        site_settings = None

    return site_settings


class RobotsTxtView(TemplateView):
    template_name = 'sitesettings/robots.txt'

    def render_to_response(self, context, **kwargs):
        return super(RobotsTxtView, self).render_to_response(
            {'content': Settings.objects.first().robots if Settings.objects.exists() else ''},
            content_type='text/plain',
            **kwargs
        )