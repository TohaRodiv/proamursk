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
        url: '/api/mailing/subscribe/',
        method: 'POST',

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

var uploadFileAjaxObj = {};
function ajaxUploadFile(file, attachmentItem) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        formData = new FormData();

    formData.append('file', file);
    formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);

    // console.log(data);

    uploadFileAjaxObj[file.name] = $.ajax({
        data: formData,
        url: '/api/site/upload-file/',
        method: 'POST',
        cache: false,
        processData: false,
        contentType: false,
        xhr: function() {
            var xhr = new window.XMLHttpRequest(),
                progressBar = attachmentItem.find('.attachment-item__progress');

            xhr.upload.addEventListener("progress", function(event){
                if (event.lengthComputable) {
                    var percentComplete = event.loaded / event.total;
                    percentComplete = (percentComplete * 100).toFixed();

                    progressBar.text(percentComplete + '%');
                }
            }, false);

            return xhr;
        },

        success: function (response) {
            // console.log(response);
            if (response.status == true) {
                attachmentItem.find('.js-abort-attachment-uploading').addClass('js-attachment-delete');
                attachmentItem.find('.js-abort-attachment-uploading').removeClass('js-abort-attachment-uploading');

                attachmentItem.data('id', response.data.file_id)

                attachmentItem.find('.attachment-item__progress').remove();

                filesIdToSend.push(response.data.file_id);


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

var formsAjaxQuery;
function ajaxForms(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(jqForm);
    dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    if (filesIdToSend.length > 0) {
        filesIdToSend.forEach(function(id) {
            dataToSend = dataToSend + '&attachments=' + id
        });
    }
    // console.log(dataToSend);

    formsAjaxQuery = $.ajax({
        data: dataToSend,
        url: '/api/site/feedback/',
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
                else if (templateName === 'search-result') {
                    $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.search_result);
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

function ajaxSearchResultInfinityLoader(page, q, section) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&q=' + q + '&section=' + section + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/search-result/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }

                $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.search_result);
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

$('body').on('click', '.js-btn_more', function () {
    var pageCount = $(this).data('page-count'),
        url, templateName;

    $(this).blur().addClass('btn_preloader');

    if ($(this).hasClass('js-more-search-result')) {
        var section = $('.search-result-page__btn.active').data('section'),
            q = $('.search-form .search-form__input').val();

        ajaxSearchResultInfinityLoader(pageCount, q, section);
    }
    else {
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
        ajaxInfinityLoader(url, templateName, pageCount);
    }

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
