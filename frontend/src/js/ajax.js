// Мгновенный поиск
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
                showSearchResult(responseObj.templates.search_result, q);
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

// Обратный звонок
function getCallback(jqForm) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    trimFormFields(jqForm);
    dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/site/get-callback/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                hidePopUps();
                if (responseObj.message) showNotification(responseObj.message, 'success');
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

// Заказы в ЛК
function ajaxOrders(page, last_year) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&last_year=' + last_year + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    $.ajax({
        data: dataToSend,
        url: '/api/site/profile-orders/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden');
                }
                $('.account-main__orders-list').append(responseObj.templates.orders_list)
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

// История списания/начисления кэшбэков в ЛК
function ajaxMoreCashbackHistory(page) {
    var csrfmiddlewaretoken = getCookie('csrftoken'),
        dataToSend;

    dataToSend = 'page=' + page + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

    $.ajax({
        data: dataToSend,
        url: '/api/site/cashback-history/',
        method: 'POST',

        success: function (response) {
            var responseObj = JSON.parse(response);

            // console.log(responseObj);

            clearInterval(preloaderId);
            if (responseObj.status == true) {
                if (responseObj.data.last) {
                    $('.btn_more').addClass('hidden')
                }
                $('.cashback-history__table').append(responseObj.templates.cashback_history);
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

    if ($(this).hasClass('js-more-products')) {
        ajaxLastCategoryProducts(
            $('.category').data('category-id'),
            pageCount,
            $('.products-filter'),
            showMoreFilterItems
        );
    }
    else if ($(this).hasClass('js-more-search-products')) {
        var q = $('.search-result-page').data('search-query');

        ajaxSearchProducts(
            q,
            $('.categories-list__category-btn.active').data('category-id'),
            pageCount,
            $('.sort-filter'),
            showMoreFilterItems
        );
    }
    else if ($(this).hasClass('js-more-promo-products')) {
        ajaxPromoProducts(
            $('.categories-list__category-btn.active').data('category-id'),
            pageCount,
            $('.sort-filter'),
            showMoreFilterItems
        );
    }
    else if ($(this).hasClass('js-more-brand-products')) {
        var brand_id = $('[data-brand-id]').data('brand-id'),
            category_id = $('.categories-list__category-btn.active').data('category-id');

        ajaxBrandProducts(category_id, brand_id, pageCount, $('.sort-filter'), showMoreFilterItems);
    }
    else if ($(this).hasClass('js-more-account-orders')) {
        var last_year = $('.account-order-wrap:last').data('order-year');
        ajaxOrders(pageCount, last_year);
    }
    else if ($(this).hasClass('js-more-cashback-history')) {
        ajaxMoreCashbackHistory(pageCount);
    }
    else if ($(this).hasClass('js-more-news')) {
        ajaxNews(pageCount);
    }
})