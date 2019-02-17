$('body').on('input', 'input, textarea', function() {
    if ($(this).hasClass('has-error')) {
        var form = $(this).parents('form');

        checkFormField($(this));
        if ($(this).attr('type') == 'password') isPasswordsEqual(form, true);
        if (!$(this).hasClass('has-error')) hideErrorMessage($(this));
    }
})

$('body').on('focus', 'input.has-error, textarea.has-error', function() {
    showErrorMessage($(this));
})

$('body').on('blur', 'input, textarea', function() {
    $(this).addClass('blured');

    checkFormField($(this));
    hideErrorMessage($(this));
})

// Проверяет отдельное поле формы
function checkFormField(jqField, onlyCheck) {
    var onlyCheck = onlyCheck ? onlyCheck : false,
        tagName = jqField.prop('tagName'),
        inputType = (tagName == 'INPUT') ? jqField.attr('type') : undefined,
        name = jqField.attr('name'),
        val = jqField.val(),
        regExp = new RegExp(),
        errorMessage = false;

    if (!jqField.hasClass('disabled')){

        if (tagName == 'INPUT') {
            if (inputType == 'text') {
                if (~name.indexOf('name') || ~name.indexOf('subject')) {
                    if (jqField.hasClass('required-input')) regExp = /^[-–—а-яё\s]+$/i;
                    else regExp = /(^[-–—а-яё\s]*$)|(^$)/i;
                    errorMessage = 'Можно использовать только буквы русского алфавита или дефис';
                }

                if (~name.indexOf('email')) {
                    if (jqField.hasClass('required-input')) regExp = /^[-0-9a-zа-яё_\.]+@[-0-9a-zа-яё_\.]+\.[a-zа-яё]{2,6}$/i;
                    else regExp = /(^[-0-9a-zа-яё_\.]+@[-0-9a-zа-яё_\.]+\.[a-zа-яё]{2,6}$)|(^$)/i;
                    errorMessage = 'Email указан неверно';
                }
            }
            else if (inputType == 'email') {
                if (~name.indexOf('email')) {
                    if (jqField.hasClass('required-input')) regExp = /^[-0-9a-zа-яё_\.]+@[-0-9a-zа-яё_\.]+\.[a-zа-яё]{2,6}$/i;
                    else regExp = /(^[-0-9a-zа-яё_\.]+@[-0-9a-zа-яё_\.]+\.[a-zа-яё]{2,6}$)|(^$)/i;
                    errorMessage = 'Email указан неверно';
                }
            }
            else if (inputType == 'tel') {
                if (~name.indexOf('phone')) {
                    if (jqField.hasClass('required-input')) regExp = /^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/;
                    else regExp = /(^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$)|(^\+7\s$)|(^$)/;
                    errorMessage = 'Номер телефона должен быть в федеральном формате (10 цифр)';
                }
            }
            else if ((inputType == 'checkbox') && (jqField.hasClass('required-input')) && (!jqField.prop('checked'))) {
                $('label[for="' + jqField.attr('id') + '"]').addClass('has-error');
                return false;
            }
        }
        else if (tagName == 'TEXTAREA') {
            if (jqField.hasClass('required-input')) regExp = /^[\w\W]+$/i;
            else regExp = /^[\w\W]*$/i;
        }
    }

    if ((jqField.hasClass('required-input')) && (val == '') && (!jqField.hasClass('disabled'))){
        errorMessage = 'Это поле необходимо заполнить';
        regExp = /^[-–—а-яё\s]+$/i;
    }

    if (regExp instanceof RegExp) {
        if (!regExp.test(val)) {
            if (!onlyCheck) jqField.addClass('has-error').data('error-message', errorMessage);
            return false;
        }
        else {
            if (!onlyCheck) jqField.removeClass('has-error').removeAttr('data-error-message');
            return true;
        }
    }
    else if (regExp instanceof Array) {
        var regExpStatus = true;

        $.each(regExp, function(key, value) {
            if (!value.test(val)) regExpStatus = false;
        });

        if (!regExpStatus) jqField.addClass('has-error').data('error-message', errorMessage);
        else jqField.removeClass('has-error').removeAttr('data-error-message');

        return regExpStatus;
    }
}

// Проверяет значения полей с паролями на соответствие друг другу
function isPasswordsEqual(jqForm, checkOnlyAllBlured) {
    var passwordInputs = jqForm.find('input[type="password"]').filter('input[data-check-password-equal="true"]'),
        passwordValue = passwordInputs.eq(0).val(),
        checkOnlyAllBlured = checkOnlyAllBlured ? checkOnlyAllBlured : false,
        isEqual = true;

    if (passwordInputs.length > 1) {
        passwordInputs.each(function (i) {
            if (checkOnlyAllBlured && !$(this).hasClass('blured')) {
                isEqual = true;
                return false;
            }

            if ($(this).val() != passwordValue) {
                errorMessage = 'Пароли не совпадают';
                isEqual = false;
                return false;
            }
        });

        if (!isEqual) passwordInputs.addClass('has-error').data('error-message', errorMessage);
        else {
            passwordInputs.each(function () {
                if (checkFormField($(this), true)) $(this).removeClass('has-error').removeAttr('data-error-message');
            });
        }
    }

    return isEqual;
}

// Скрывает сообщение об ошибке для поля jqField
function hideErrorMessage(jqField) {
    jqField.parents('.input-wrap').find('.hint').remove();
}

// Показывает сообщение об ошибке для поля jqField
function showErrorMessage(jqField) {
    var parentInputWrap = jqField.parents('.input-wrap'),
        errorMessage = jqField.data('error-message'),
        hint = $('<div/>', {
            class: 'hint hint_error hint_visible'
        }),
        hintText = $('<div/>', {
            class: 'hint__text'
        });

    if (errorMessage) {
        parentInputWrap.find('.hint').remove();
        parentInputWrap.append(hint);
        parentInputWrap.find('.hint').append(hintText)
        parentInputWrap.find('.hint__text').html(errorMessage);
    }
}

// Проверяет все поля формы на валидность
var validateStatus;
function validateFormFields(jqForm) {
    validateStatus = true;

    jqForm.find('input, textarea').not('[type="hidden"]').not('[type="submit"]').not('.disabled').each(function() {
        var fieldValidateStatus = checkFormField($(this));

        if (!fieldValidateStatus) validateStatus = fieldValidateStatus;
    });

    if (!isPasswordsEqual(jqForm)) validateStatus = false;

    return validateStatus;
}