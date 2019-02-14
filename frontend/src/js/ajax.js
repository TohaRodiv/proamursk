function ajaxInstantSearch(q) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'q=' + q + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/instant-search/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                showSearchResult(responseObj.templates.search_result);
                setSearchQueryInURL(q);
            }
            else {
                removeSearchResult();
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        }
    });
}

function ajaxSubscribe(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(jqForm);
    dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/subscribe/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            if (responseObj.status == true) {
                updateSubscribeWidget();
                if (responseObj.message) showNotification(responseObj.message, 'success');
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }

        }
    });
}

function ajaxInfinityLoader(url, templateName, page) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/' + url + '/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }

                if (templateName === 'news') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.news);
                }
                else if (templateName === 'announcements') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.announcements);
                }
                else if (templateName === 'reports') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.reports);
                }
                else if (templateName === 'history') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.articles);
                }
                else if (templateName === 'places') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.places);
                }
                else if (templateName === 'persons') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.articles);
                }
                else if (templateName === 'reviews') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.reviews);
                }
                else if (templateName === 'special-projects') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.specialProjects);
                }
            }
            else {
                if (responseObj.message) showNotification(responseObj.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

$('body').on('click', '.btn_more', function () {
    var pageCount = $(this).data('page-count'),
        url, templateName;

    $(this).addClass('btn_preloader');

    if ($(this).hasClass('js-more-past-events')) {
        url = 'announcements';
        templateName = 'announcements';
    }
    else if ($(this).hasClass('js-more-reportage')) {
        url = 'reports';
        templateName = 'reports';
    }
    else if ($(this).hasClass('js-more-history')) {
        url = 'history';
        templateName = 'articles';
    }
    else if ($(this).hasClass('js-more-places')) {
        url = 'places';
        templateName = 'places';
    }
    else if ($(this).hasClass('js-more-people')) {
        url = 'persons';
        templateName = 'articles';
    }
    else if ($(this).hasClass('js-more-special-projects')) {
        url = 'special-projects';
        templateName = 'special-projects';
    }
    else if ($(this).hasClass('js-more-news')) {
        url = 'news';
        templateName = 'news';
    }
    else if ($(this).hasClass('js-more-reviews')) {
        url = 'reviews';
        templateName = 'reviews';
    }

    ajaxInfinityLoader(url, templateName, pageCount);
    pageCount++;
    $(this).data('page-count', pageCount);
})