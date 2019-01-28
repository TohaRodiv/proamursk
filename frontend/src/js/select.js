$('body').on('click', '.select__arrow', function() {
    var select = $(this).parents('.select'),
        selectValue = select.find('.select__value_visible'),
        optionsList = select.find('.select__options-list');

    if (!selectValue.hasClass('focus')) {
        $('.select').find('.select__value_visible').removeClass('focus');
        $('.select__options-list').addClass('hidden');
    }
    selectValue.toggleClass('focus');
    optionsList.toggleClass('hidden');
})

$('body').on('focus', '.select__value', function() {
    var select = $(this).parents('.select'),
        selectValue = $(this).val(),
        optionsList = select.find('.select__options-list');

    $('.select').find('.select__value_visible').removeClass('focus');
    $('.select__options-list').addClass('hidden');

    if (selectValue !== '') {
        select.find('.select__clear').removeClass('hidden');
    }

    $(this).toggleClass('focus');
    optionsList.toggleClass('hidden');
})

// выбор пункта селекта
$('body').on('click', '.select__option', function() {
    var select = $(this).parents('.select'),
        optionValue = $(this).text(),
        optionDataToSend = $(this).data('value-to-send'),
        selectValueVisible = select.find('.select__value_visible'),
        selectValueHidden = select.find('.select__value_hidden'),
        optionsList = select.find('.select__options-list'),
        clearSelect = select.find('.select__clear');

    optionsList.find('.select__option').removeClass('select__option_choosen');
    $(this).addClass('select__option_choosen');
    optionsList.addClass('hidden');

    selectValueHidden.val(optionDataToSend).removeClass('has-error');
    if (selectValueVisible.prop('tagName') == 'DIV') {
        selectValueVisible.text(optionValue).removeClass('focus');
    }
    else if (selectValueVisible.prop('tagName') == 'INPUT'){
        selectValueVisible.val(optionValue).removeClass('has-error focus');
    }

    selectValueHidden.change();

    clearSelect.removeClass('hidden');
})

// очистка поля по клику на крестик
$('body').on('click', '.select__clear', function() {
    var select = $(this).parents('.select'),
        selectValueVisible = select.find('.select__value_visible'),
        selectValueHidden = select.find('.select__value_hidden'),
        optionsList = select.find('.select__options-list');

    optionsList.find('.select__option').removeClass('select__option_choosen hidden');
    selectValueVisible.val('').text('').focus();
    selectValueHidden.val('');
    $(this).addClass('hidden');
})

// закрытие select при клике в любое место
$('body').click(function(event) {
    if($(event.target).parents('.select').length == 0) {
        $('.select__options-list').addClass('hidden');
        $('.select__value_visible').removeClass('focus');
    }
})

// закрытие select при фокусе на любом элементе
$('body').on('focus', 'button, input', function(event) {
    if($(event.target).parents('.select').length == 0) {
        $('.select__options-list').addClass('hidden');
        $('.select__value_visible').removeClass('focus');
    }
})