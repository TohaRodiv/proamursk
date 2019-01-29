// маска телефона
$('input[type=tel]').mask('+7 (000) 000 00 00');
$('input[name=birthday]').mask('99.99.0000');
$('input[name=date]').mask('00.00.0000');
$('input[name=buy_date]').mask('00.00.0000');
$('input[name=card_number]').mask('0000 0000 0000 0000');

$('input[type=tel]').on('keyup', function () {
    var val = $(this).val();
    if (val.length <= 3) $(this).val('+7 ');
})

$('input[type=tel]').on('focus', function () {
    var val = $(this).val();
    if (val.length == 0) $(this).val('+7 ');
})

$('input[type=tel]').on('click', function () {
    var val = $(this).val();
    if (val == '+7 ') $(this)[0].selectionStart = 3;
})

$('input[type=tel]').on('blur', function () {
    var val = $(this).val();
    if (val == '+7 ') $(this).val('');
})
