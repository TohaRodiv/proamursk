$('body').on('input', 'input, textarea', function() {
    if ($(this).parents('.products-filter').length == 0) {
        if ($(this).hasClass('has-error')) {
            var form = $(this).parents('form');

            checkFormField($(this));
            if ($(this).attr('type') == 'password') isPasswordsEqual(form, true);
            if (!$(this).hasClass('has-error')) hideErrorMessage($(this));
        }
    }
})

$('body').on('change', 'input[name=date], input[type=radio], input[type=checkbox]', function() {
    if ($(this).parents('.products-filter').length == 0) {
        checkFormField($(this));
    }
})

$('body').on('focus', 'input.has-error, textarea.has-error', function() {
    showErrorMessage($(this));
})

$('body').on('blur', 'input, textarea', function() {
    var form = $(this).parents('form');

    $(this).addClass('blured');

    if ($(this).parents('.products-filter').length == 0) {
        checkFormField($(this));
        if ($(this).attr('type') == 'password') {
            isPasswordsEqual(form, true);
        }
        hideErrorMessage($(this));
    }
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

    if (!jqField.hasClass('disabled') && !jqField.hasClass('product-counter__input')){

        if (tagName == 'INPUT') {
            if (inputType == 'text') {
                if ((~name.indexOf('username') || ~name.indexOf('first_name') || ~name.indexOf('last_name')) || ~name.indexOf('patronymic')) {
                    if (!jqField.hasClass('item-counter__amount')) {
                        if (jqField.hasClass('required-input')) regExp = /^[-–—а-яё\s]+$/i;
                        else regExp = /(^[-–—а-яё\s]*$)|(^$)/i;
                        errorMessage = 'Можно использовать только буквы русского алфавита или дефис';
                    }
                }

                if (~name.indexOf('cashback')) {
                    if (jqField.hasClass('required-input')) regExp = /^[0-9]*$/i;
                    else regExp = /(^[0-9]*$)|(^$)/i;
                    errorMessage = 'Можно использовать только цифры';
                }

                if (~name.indexOf('build')) {
                    if (jqField.hasClass('required-input')) regExp = /^[-–—а-яё0-9\s]+$/i;
                    else regExp = /(^[-–—а-яё0-9\s]*$)|(^$)/i;
                    errorMessage = 'Можно использовать только буквы русского алфавита, цифры или дефис';
                }

                if (~name.indexOf('birthday') || (~name.indexOf('date')) && ~~name.indexOf('receiving_date')) {
                    if (jqField.hasClass('required-input')) regExp = /^\d{1,2}\.\d{1,2}\.\d\d\d\d$/i;
                    else regExp = /(^\d\d\.\d\d\.\d\d\d\d$)|(^$)/i;
                    errorMessage = 'Можно использовать только цифры, в формате дд.мм.гггг';
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
            else if (inputType == 'password') {
                if (~name.indexOf('password') || ~name.indexOf('password1') || ~name.indexOf('password2') || ~name.indexOf('new_password1') || ~name.indexOf('new_password2')) {
                    if (jqField.hasClass('required-input')) {
                        if (jqField.hasClass('strict')) {
                            regExp = [
                                /^[0-9a-zA-Z]{6,}$/i,
                                /[a-z]+/,
                                /\d+/
                            ];
                            errorMessage = 'Пароль может состоять только из цифр или букв английского алфавита, должен быть не короче шести символов, а также содержать как минимум одну цифру и одну букву в любом регистре, например: 8goods';
                        }
                        else regExp = /^.+$/i;
                    }
                    else regExp = /^.*$/i;
                }
            }
            else if ((inputType == 'checkbox') && (jqField.hasClass('required-input')) && (!jqField.prop('checked'))) {
                $('label[for="' + jqField.attr('id') + '"]').addClass('has-error');
                return false;
            }
            else if ((inputType == 'radio') && (jqField.hasClass('required-input'))) {

                var parent = jqField.parents('.radio-set'),
                    checkedRadiolength = parent.find($('input[type=radio]:checked')).length;

                // если не выбран ни один radio из группы
                if (checkedRadiolength == 0){
                    $('label[for="' + jqField.attr('id') + '"]').addClass('has-error');
                    return false;
                }
                else {
                    parent.find('.has-error').removeClass('has-error');
                    return true;
                }
            }
        }
        else if (tagName == 'TEXTAREA') {
            if (jqField.hasClass('required-input')) regExp = /^[\w\W]+$/i;
            else regExp = /^[\w\W]*$/i;
        }
    }

    if ((jqField.hasClass('required-input')) && (val == '') && (!jqField.hasClass('disabled'))){
        errorMessage = 'Это поле является обязательным и не может быть пустым';
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