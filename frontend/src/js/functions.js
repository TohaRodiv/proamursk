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
        $('input, textarea').addClass('fill');
        resizeTextarea($('.bugreport').find('.variable-height-textarea'), 27, 120)
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


$('.variable-height-textarea').on('keyup', function () {
    resizeTextarea($(this), 27, 120);
});


function resizeTextarea(visibleTextarea, minHeight, maxHeight) {
    if (visibleTextarea.val() == '') {
        visibleTextarea.height(minHeight + 'px');
    }
    else {
        var variableTextareaWrap = visibleTextarea.parent('.variable-height-textarea-wrap'),
            hiddenTextarea = variableTextareaWrap.find('.variable-height-textarea_hidden'),
            text = '';

        visibleTextarea.val().replace(/[<>]/g, '_').split('\n').forEach(function (s) {
            text = text + '<div>' + s.replace(/\s\s/g, ' &nbsp;') + '&nbsp;</div>' + '\n';
        });
        hiddenTextarea.html(text);
        var hiddenTextareaHeight = hiddenTextarea.height();
        hiddenTextareaHeight = Math.max(minHeight, hiddenTextareaHeight);
        hiddenTextareaHeight = Math.min(maxHeight, hiddenTextareaHeight);
        visibleTextarea.height(hiddenTextareaHeight + 'px');
    }
}