// Мгновенный поиск
function ajaxInstantSearch(q) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'q=' + q + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/search/',
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

// Подписаться на рассылку
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

// Новости
function ajaxNews(page) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/news/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                $('.news-list').append(responseObj.templates.goods_grid);
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

// Запросы по кнопке "Показать больше"
$('body').on('click', '.btn_more', function () {
    var pageCount = $(this).data('page-count');

    pageCount++;
    $(this).data('page-count', pageCount);
    $(this).addClass('btn_preloader');

    if ($(this).hasClass('js-more-cashback-history')) {
        ajaxMoreCashbackHistory(pageCount);
    }
    else if ($(this).hasClass('js-more-news')) {
        ajaxNews(pageCount);
    }
})