$('.show-pop-up').on('click', function () {
    var popUp = $(this).data('pop-up');

    console.log(popUp)
    showPopUp(popUp);
});

$('body').on('click', '.body-cover .back, .js-pop-up__close', function () {
    if (!$(this).hasClass('always-visible')) {
        hidePopUps();
    }
});

function popUpDetected() {
    return ($('.body-cover').hasClass('visible') && $('.pop-up-wrapper.visible').length > 0) ? true : false;
}

function showPopUp(popUpName) {
    var popUpOuterWrap = $('.pop-up-wrapper.' + popUpName);

    hidePopUps();
    showBodyCover();
    popUpOuterWrap.addClass('visible');
    popUpAlwaysVisible();
    $('body').addClass('popup-open');
}

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

function showBodyCover() {
    var cover = $('.body-cover');

    cover.addClass('visible');
}

function hideBodyCover() {
    var cover = $('.body-cover');

    cover.removeClass('visible');
    cover.find('.pop-up-wrapper').removeClass('visible');
    cover.removeClass('body-cover_img');
}

function popUpAlwaysVisible() {
    var visiblePopUp = $('.pop-up-wrapper.visible');

    if (visiblePopUp.hasClass('success-cart-constructor')) {
        $('.body-cover').addClass('always-visible');
        $('.body-cover .back').addClass('always-visible');
    }
}