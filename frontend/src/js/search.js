function showSearch() {
    if ($('.instant-search__input').val() !== '') {
        ajaxInstantSearch($('.instant-search__input').val())
        $('.js-instant-search__clear-btn').removeClass('hidden');
    }
    hideHeaderBasket();
    hideDesktopCatalog();
    hideMobileNav();

    $('.header__instant-search').addClass('active visible');
    $('.body-overlay').removeClass('hidden');
}

function hideSearch() {
    if ($('.instant-search__input').val() !== '') {
        window.history.pushState(null, null, window.location.origin + window.location.pathname);
    }
    $('.header__instant-search').removeClass('active visible');
    $('.instant-search__input').val('');
    $('.js-instant-search__clear-btn').addClass('hidden');
    removeSearchResult();
}

function clearSearch() {
    $('.instant-search__input').val('');
    removeSearchResult();
    $('.js-instant-search__clear-btn').addClass('hidden');
    window.history.pushState(null, null, window.location.origin+window.location.pathname);
}

function removeSearchResult() {
    $('.instant-search__result-block').empty();
}

function showSearchResult(template, q) {
    removeSearchResult();
    $('.instant-search__result-block').append(template).addClass('visible');

    if ($('.instant-search__result_full').length === 1) {
        $('.js-instant-search__btn-close').removeClass('hidden');
    }
    else {
        $('.js-instant-search__btn-close').addClass('hidden');
    }

    // подстановка поискового запроса в url
    window.history.pushState(null, null, '?q=' + q);
}

// переход на страницу результатов поиска
$('.instant-search').submit(function (event) {
    event.preventDefault();
    var q = $('.instant-search__input').val();

    if (!$('.search-item').hasClass('active')) {
        window.location.replace('/search/?q='+q);
    }
})

// показать поиск
$('body').on('focus', '.instant-search__input', function(){
    hideDesktopCatalog();
    hideMobileNav();
    showSearch()
});
$('body').on('click', '.js-instant-search__show-btn', function(){
    hideDesktopCatalog();
    hideMobileNav();
    showSearch()
});

// очистить поиск
$('body').on('click', '.js-instant-search__clear-btn', clearSearch);

// скрыть поиск
$('body').on('click', '.js-instant-search__close-btn', function () {
    hideSearch();
    $('.body-overlay').addClass('hidden');
});

$('body').on('input', '.instant-search__input', function () {
    if ($(this).val() !== '') {
        $('.js-instant-search__clear-btn').removeClass('hidden');
    }
    else {
        $('.js-instant-search__clear-btn').addClass('hidden');
    }
})
// запрос и переключение между результатами поиска с помощью стрелок вверх/вниз
$('body').on('keyup', '.instant-search__input', function (event) {
    var keyCode = event.keyCode,
        q = $(this).val();

    // навигация по результатам: 40 - вниз, 38 - вверх
    if ((keyCode == 40) || (keyCode == 38)) {
        if ($('.instant-search__result-block').find('.search-item')) {
            if (keyCode == 40) {
                if ($('.search-item').hasClass('active')) {
                    var focusEq = $('.search-item').index($('.search-item.active'));

                    if (focusEq == ($('.search-item').length - 1)) {
                        $('.search-item').removeClass('active');
                        $('.search-item').eq(0).addClass('active');
                    }
                    else {
                        $('.search-item').removeClass('active');
                        $('.search-item').eq(focusEq + 1).addClass('active');
                    }
                }
                else {
                    $('.search-item').eq(0).addClass('active');
                }
            }
            if (keyCode == 38) {
                if ($('.search-item').hasClass('active')) {
                    var focusEq = $('.search-item').index($('.search-item.active'));

                    $('.search-item').removeClass('active');
                    $('.search-item').eq(focusEq - 1).addClass('active');
                }
                else {
                    $('.search-item').eq(-1).addClass('active');
                }
            }
        }
    }
    // переход по ссылке на элементе по Enter
    else if (keyCode == 13) {
        if ($('.search-item').hasClass('active')) {
            var link = $('.search-item.active').attr('href');

            window.location.replace(link);
        }
    }
    // отправление поискового запроса
    else {
        setTimeout(ajaxInstantSearch(q), 500);
    }
})