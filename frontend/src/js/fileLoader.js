$('.attachment-input').on('click', function() {
    $('.attachment-input').val('');
});

$('.attachment-input').change(function () {
    var filesArr = this.files,
        deleteBtn = $('<button/>', {
        type: 'button',
        class: 'attachment-delete-btn js-attachment-delete icon-close',
    });

    if (filesArr.length < 6) {
        $('.attachment-list').empty();

        for (var i = 0; i < filesArr.length; i++) {
            var currentFile = this.files[i];
            if (currentFile.size > 2097152) {
                console.log(currentFile.name, 'больше 2мб')
                return false;
            }
            else {
                $('<div/>', {
                    class: 'attachment-list__item',
                    append: $('<span/>', {
                        text: currentFile.name,
                        class: 'attachment-list__item-name',
                    })
                }).appendTo('.attachment-list');
            }
        }

        $('.attachment-list__item').each(function () {
            if (!$(this).find('.attachment-delete-btn').length > 0) {
                $(this).append(deleteBtn)
            }
        })
    }
    else {
        showNotification('Можно загрузить не более 5 файлов по 2 Мб', 'error');
        return false;
    }
})

function uploadFile() {
    var data = new FormData();

    data.append('file', $('.attachment-input').prop('files')[0]);

    uploadFileAJAX = $.ajax({
        url: '/api/attachments/',
        data: data,
        processData: false,
        contentType: false,
        type: 'POST',
        headers: {
            'X-CSRFTOKEN': getCookie('csrftoken')
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
