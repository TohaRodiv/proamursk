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
        processData: false,
        contentType: false,

        success: function (response) {
            // console.log(response);

            if (response.status == true) {
                updateSubscribeWidget();
                if (response.message) showNotification(response.message, 'success');
            }
            else {
                if (response.message) showNotification(response.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

function ajaxForms(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = new FormData();

    trimFormFields(jqForm);

    for (var id in queue) {
        dataToSend.append('attachment', queue[id]);
    }

    jqForm.find('input:not([type="submit"]):not(.attachment-input), textarea').each(function () {
        dataToSend.append(this.name, this.value)
    });
    dataToSend.append('csrfmiddlewaretoken', csrfmiddlewaretoken);

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/feedback/',
        method: 'POST',
        cache: false,
        processData: false,
        contentType: false,

        success: function (response) {
            // console.log(response);

            if (response.status == true) {
                hidePopUps();
                if (response.message) showNotification(response.message, 'success');
            }
            else {
                if (response.message) showNotification(response.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

function ajaxPlaceReview(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    trimFormFields(jqForm);

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/place-review/',
        method: 'POST',

        success: function (response) {
            // console.log(response);

            if (response.status == true) {
                hidePopUps();
                if (response.message) showNotification(response.message, 'success');
            }
            else {
                if (response.message) showNotification(response.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

function ajaxBugreport(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    trimFormFields(jqForm);

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/bugreport/',
        method: 'POST',

        success: function (response) {
            // console.log(response);

            if (response.status == true) {
                hidePopUps();
                if (response.message) showNotification(response.message, 'success');
            }
            else {
                if (response.message) showNotification(response.message, 'error');
            }
        },
        complete: function () {
            hideBtnPreloader();
        }
    });
}

function ajaxInfinityLoader(url, templateName, page, category) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;
    if (category) dataToSend = dataToSend + '&category=' + category;

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
                else if (templateName === 'search-result') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.searchResult);
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

    if ($(this).hasClass('js-more-future-events')) {
        url = 'future-announcements';
        templateName = 'announcements';
    }
    else if ($(this).hasClass('js-more-past-events')) {
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
    else if ($(this).hasClass('js-more-search-result')) {
        url = 'search-result';
        templateName = 'search-result';
    }

    ajaxInfinityLoader(url, templateName, pageCount);
    pageCount++;
    $(this).data('page-count', pageCount);
})

$('.js-pop-up__form').submit(function (event) {
    event.preventDefault();
    var requestToDo = $(this).find('.pop-up-form__submit').data('request');

    validateFormFields($(this));

    if (validateStatus) {
        $(this).find('.pop-up-form__submit').blur().addClass('btn_preloader');

        if (requestToDo == 'to-editor') {
            ajaxForms($(this));
            return false;
        }
        else if (requestToDo == 'place-review') {
            ajaxPlaceReview($(this));
            return false;
        }
        else if (requestToDo == 'bugreport') {
            ajaxBugreport($(this));
            return false;
        }
    }
    else {
        return false;
    }
})
