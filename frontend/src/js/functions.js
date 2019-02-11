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


$('.attachment-input').change(function () {
    if (this.files[0] && this.files[0].size > 2097152) {
        showNotification('Файл слишком велик. Максимальный размер - 2 МБ', 'error');
        return false;
    }
    else {
        uploadFile();
    }
})

function uploadFile() {
    var data = new FormData();

    data.append('file', $('.attachment-input').prop('files')[0]);

    uploadFileAJAX = $.ajax({
        url: '/api/v1/feedback-attachments/',
        data: data,
        processData: false,
        contentType: false,
        type: 'POST',
        headers: {
            'X-CSRFTOKEN': getCookie('csrftoken')
        },
        beforeSend: function() {
            $('.feedback-attachment-status_init').addClass('hidden');
            $('.feedback-attachment-status_process').removeClass('hidden');
        },
        complete: function(){
            $('.feedback-attachment-status_process').addClass('hidden');
        },
        statusCode: {
            201: function (response) {
                $('.uploaded-file-name').text(response.original_name);
                $('.feedback-attachment-status_init, .feedback-attachment-status_process').addClass('hidden');
                $('.feedback-attachment-status_loaded').removeClass('hidden');
            },
            400: function (response) {
                $('.feedback-attachment-status_init, .feedback-attachment-status_process, .feedback-attachment-status_loaded').addClass('hidden');
                $('.feedback-attachment-status_error').removeClass('hidden');
                if (response.file) {
                    showNotification(response.file, 'error');
                }
                if (response.responseJSON.non_field_errors) {
                    showNotification(response.responseJSON.non_field_errors, 'error');
                }
            }
        }
    });
}

var uploadFileAJAX;

$('.feedback-form').submit(function() {
    validateFormFields($(this));

    if (validateStatus) {
        $(this).find('.js-form-submit').blur().addClass('btn_preloader');

        ajaxFeedback($(this));
        return false;
    }
})

function ajaxFeedback(jqForm) {
    var dataToSend;

    trimFormFields(jqForm);

    dataToSend = JSON.stringify(objectifyForm(jqForm.serializeArray()));

    // console.log(dataToSend);

    $.ajax({
        data: dataToSend,
        url: '/api/v1/feedback-messages/',
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        statusCode: {
            201: function () {
                showNotification('Обращение отправлено', 'success');
                $('.feedback-form')[0].reset();
            }
        },
        complete: function () {
            clearInterval(preloaderId);
            setTimeout(function () { $(jqForm).find('.btn_preloader').removeClass('btn_preloader') }, preloaderHideTime);
            if (response.responseJSON.non_field_errors) {
                showNotification(response.responseJSON.non_field_errors, 'error');
            }
        }
    });
}
