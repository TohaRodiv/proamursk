$('.subscribe-form').submit(function(event) {
    event.preventDefault();
    validateFormFields($(this));
    if (validateStatus) {
        ajaxSubscribe($(this));
    }
})

$('.subscribe-form__input').on('input', function () {
    $('.js-subscribe-form__submited').addClass('hidden');
    $('.js-subscribe-form__submit').removeClass('hidden');
})

function updateSubscribeWidget() {
    $('.js-subscribe-form__submited').removeClass('hidden');
    $('.subscribe-form').addClass('hidden');
    $('.subscribe-form')[0].reset();
}