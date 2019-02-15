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


$('body').keydown(function (event) {
    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
        var currentURL = window.location,
            selection = getSelectionText();

        showPopUp('bugreport');
        $('input[name="url"]').val(currentURL);
        $('.js-error-selection-textarea').val(selection);
    }
});


function getSelectionText() {
   return window.getSelection().toString();
}

$('body').on('change', 'input, textarea, .select__value', function () {
    if ($(this).val() === '' || $(this).val() == '+7 ') {
        $(this).removeClass('fill');
    }
    else {
        $(this).addClass('fill');
    }
})