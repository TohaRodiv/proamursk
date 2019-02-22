$('.attachment-input').on('click', function() {
    $('.attachment-input').val('');
});

$('.attachment-input').change(function () {
    var filesArr = this.files,
        filesList = $(this).parents('.attachment').find('.attachment-list');

    handleFiles(filesArr, filesList)
})

$('body').on('click', '.js-attachment-delete', function () {
    var attachmentItem = $(this).parents('.attachment-item'),
        attachmentItemList = attachmentItem.parents('.attachment-list');

    attachmentItem.remove();

    checkfilesListLength(attachmentItemList);
})

$('body').on('click', '.js-abort-attachment-uploading', function () {
    abortFileUploading();

    var attachmentItem = $(this).parents('.attachment-item'),
        attachmentItemList = attachmentItem.parents('.attachment-list');

    attachmentItem.remove();

    checkfilesListLength(attachmentItemList);
})

var filesIdToSend = [];
function handleFiles(files, filesList) {
    var attachmentItemTemplate = $('.attachment-item_template').clone().removeClass('attachment-item_template hidden'),
    filesListLengthBefore = filesList.find('.attachment-item').length;

    if (files.length < (6 - filesListLengthBefore)) {
        for (var i = 0; i < files.length; i++) {
            var currentFile = files[i];
            if (currentFile.size > 2097152) {
                showNotification('Файл ' + currentFile.name + ' больше 2 Мб', 'error');
                return false;
            }
            else {
                var currentAttachment = attachmentItemTemplate.clone();

                currentAttachment.data('id', currentFile.name);
                currentAttachment.find('.attachment-item__name').text(currentFile.name);
                currentAttachment.appendTo(filesList);

                ajaxUploadFile(files[i], currentAttachment)
            }
        }
    }
    else {
        showNotification('Можно загрузить не более ' + (5 - filesListLengthBefore) + ' файлов по 2 Мб', 'error');
        return false;
    }

    checkfilesListLength(filesList);
}


function abortFileUploading() {
    uploadFileAJAX.abort();
    clearFileInput();
    $('.feedback-attachment-status_loaded, .feedback-attachment-status_error, .feedback-attachment-status_process').addClass('hidden');
    $('.feedback-attachment-status_init').removeClass('hidden');
}

function clearFileInput() {
    $('.attachment-input').val('');
    $('.attachment-list').empty();
}

function checkfilesListLength(filesList) {
    var filesListLength = filesList.find('.attachment-item').length;

    if (filesListLength === 5) {
        filesList.siblings('.attachment-btn').find('.attachment-label').addClass('disabled');
        filesList.parents('.js-drop-area').addClass('disabledDrag');
    }
    else {
        filesList.siblings('.attachment-btn').find('.attachment-label').removeClass('disabled');
        filesList.parents('.js-drop-area').removeClass('disabledDrag');
    }
}

function fileUploadingProgress(attachmentItem) {
    var xhr = new window.XMLHttpRequest(),
        progressBar = attachmentItem.find('.attachment-item__progress');

    xhr.upload.addEventListener("progress", function(event){
        if (event.lengthComputable) {
            var percentComplete = event.loaded / event.total;
            percentComplete = (percentComplete * 100).toFixed();

            progressBar.text(percentComplete + '%');
        }
    }, false);

    return xhr;
}