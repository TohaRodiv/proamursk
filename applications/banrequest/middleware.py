class BanRequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if hasattr(request, 'session') and 'ban' not in request.session:
            request.session['ban'] = 0
        response = self.get_response(request)
        return response
