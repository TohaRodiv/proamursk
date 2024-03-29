function hideSearch() {
    $('.js-close-search').addClass('hidden');
    $('.header__search-btn').removeClass('visually-hidden');
    clearSearch();
    hidePopUps();
}

function clearSearch() {
    $('.search-form__input').val('');
    $('.js-search__clear-btn').addClass('hidden');
    removeSearchResult();
    window.history.pushState(null, null, window.location.origin+window.location.pathname);
}

function removeSearchResult() {
    $('.search__result-block').empty();
}

function showSearchResult(template) {
    removeSearchResult();
    $('.search__result-block').append(template).removeClass('hidden');
}

function setSearchQueryInURL(q) {
    window.history.pushState(null, null, '?q=' + q);
}

// переход на страницу результатов поиска
$('.instant-search-form').submit(function (event) {
    event.preventDefault();
    var q = $(this).find('.search-form__input').val();

    if (!$('.search-item').hasClass('focus')) {
        window.location.replace('/search/?q='+q);
    }
})

$('.search-form').submit(function (event) {
    event.preventDefault();
    var q = $(this).find('.search-form__input').val();

    if (q.length > 2) window.location.replace('/search/?q='+q);
})


$('body').on('click', '.header__search-btn', function () {
    showPopUp('search');
    $('.instant-search-form .search-form__input').focus();
    $('.js-close-search').removeClass('hidden');
    $('.header__search-btn').addClass('visually-hidden');
});

$('body').on('click', '.js-close-search, .search .back', hideSearch);
$('body').on('click', '.js-search__clear-btn', clearSearch);

$('body').on('input', '.search-form__input', function () {
    if ($(this).val() !== '') {
        $('.js-search__clear-btn').removeClass('hidden');
    }
    else {
        $('.js-search__clear-btn').addClass('hidden');
    }
})

// запрос и переключение между результатами поиска с помощью стрелок вверх/вниз
$('body').on('keyup', '.instant-search-form__input', function (event) {
    var keyCode = event.keyCode,
        q = $(this).val();

    // навигация по результатам: 40 - вниз, 38 - вверх
    if ((keyCode == 40) || (keyCode == 38)) {
        if ($('.search__result-block').find('.search-item')) {
            if (keyCode == 40) {
                if ($('.search-item').hasClass('focus')) {
                    var focusEq = $('.search-item').index($('.search-item.focus'));

                    if (focusEq == ($('.search-item').length - 1)) {
                        $('.search-item').removeClass('focus');
                        $('.search-item').eq(0).addClass('focus');
                    }
                    else {
                        $('.search-item').removeClass('focus');
                        $('.search-item').eq(focusEq + 1).addClass('focus');
                    }
                }
                else {
                    $('.search-item').eq(0).addClass('focus');
                }
            }
            if (keyCode == 38) {
                if ($('.search-item').hasClass('focus')) {
                    var focusEq = $('.search-item').index($('.search-item.focus'));

                    $('.search-item').removeClass('focus');
                    $('.search-item').eq(focusEq - 1).addClass('focus');
                }
                else {
                    $('.search-item').eq(-1).addClass('focus');
                }
            }
        }
    }
    // переход по ссылке на элементе по Enter
    else if (keyCode == 13) {
        if ($('.search-item').hasClass('focus')) {
            var link = $('.search-item.focus').attr('href');

            window.location.replace(link);
        }
    }
    // закрыть поиск по Esc
    else if (keyCode == 27) {
        hideSearch();
    }
    // отправление поискового запроса
    else {
        if (q.length > 2) setTimeout(ajaxInstantSearch(q), 500);
    }
})