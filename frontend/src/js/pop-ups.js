$('.show-pop-up').on('click', function () {
    var popUp = $(this).data('pop-up');

    showPopUp(popUp);
})

$('body').on('click', '.body-cover .back, .js-pop-up__close', function () {
    if (!$(this).hasClass('always-visible')) {
        hidePopUps();
    }
})

// Проверка на существование видимого поп-апа
function popUpDetected() {
    return ($('.body-cover').hasClass('visible') && $('.pop-up-wrapper.visible').length > 0) ? true : false;
}

// Показывает поп-ап
function showPopUp(popUpName) {
    var popUpOuterWrap = $('.pop-up-wrapper.' + popUpName);

    hidePopUps();
    showBodyCover();
    popUpOuterWrap.addClass('visible');
    popUpAddBackImage();
    popUpAlwaysVisible();
    $('body').addClass('popup-open');
}

// Скрывает все поп-апы
function hidePopUps() {
    $('body').removeClass('popup-open');
    hideBodyCover();
    $('.pop-up-wrapper').removeClass('visible');
    $('.pop-up-wrapper form').find('input, textarea').not('[type="hidden"]').not('[type="checkbox"]').not('[type="radio"]').not('[readonly]').not('.disabled').not('[type="submit"]').val('');
    $('.pop-up-wrapper form').find('[type="checkbox"], [type="radio"]').prop('checked', false);
    $('.pop-up-wrapper form').find('input, textarea, label').removeClass('has-error fill');
    resizeTextarea($('.variable-height-textarea'), 27, 120);
    clearAllSelect();
    clearFileInput();
    filesIdToSend.splice(0, filesIdToSend.length);
    abortAllFileUploading();
    if (formsAjaxQuery) formsAjaxQuery.abort();
}

// Показывает туман войны
function showBodyCover() {
    var cover = $('.body-cover');

    cover.addClass('visible');
}

// Скрывает туман войны
function hideBodyCover() {
    var cover = $('.body-cover');

    cover.removeClass('visible');
    cover.find('.pop-up-wrapper').removeClass('visible');
    cover.removeClass('body-cover_img');
}

// Добавляет фоновое изображение у поп-апа
function popUpAddBackImage() {
    var visiblePopUp = $('.pop-up-wrapper.visible');

    if ((visiblePopUp.hasClass('pop-up-wrapper_with-img')) && (!visiblePopUp.hasClass('pop-up-wrapper_without-img'))) {
        $('.body-cover').addClass('body-cover_img');
        $('.body-cover .back').addClass('back_img');
    }
}

// Всегда видимый поп-ап
function popUpAlwaysVisible() {
    var visiblePopUp = $('.pop-up-wrapper.visible');

    if (visiblePopUp.hasClass('success-cart-constructor')) {
        $('.body-cover').addClass('always-visible');
        $('.body-cover .back').addClass('always-visible');
    }
}