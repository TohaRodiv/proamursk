// TRIM для всех полей формы
function trimFormFields(jqForm) {
    jqForm.find('input, textarea').not(':file').each(function() {
        $(this).val($.trim($(this).val()));
    });
}

// возможность ввода только цифр
$('body').on('keypress', '.filter__price-input, .cashback-form__input, .product-counter__input, input[name=pin], .tire-calculator__speed-input', function(event) {
    if (event.which != 8 && event.which != 0 && (event.which < 48 || event.which > 57)) {
        return false;
    }
})
