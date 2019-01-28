var expires = 1;
$('.js-notice__close').on('click', function() {
    var id = $(this).parents('.notice-wrapper').data('id');

    setCookie('notice-' + id, id, { 'expires' : expires, 'path' : '/'});
    $('.notice-wrapper').empty().remove();

    setStickyCheckoutAsidePosition();
});

$('.js-close-page-loaded-banner').on('click', function() {
    var id = $(this).parents('.page-loaded-banner-popup').data('id');

    setCookie('popupbanner-' + id, id, { 'expires' : expires, 'path' : '/'});
    hidePopUps();
    $('.page-loaded-banner-popup').empty().remove();
});