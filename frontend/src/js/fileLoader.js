$('.attachment-input').on('click', function() {
    $('.attachment-input').val('');
});

$('.attachment-input').change(function () {
    var filesArr = this.files,
        filesList = $(this).parents('.attachment').find('.attachment-list');

    handleFiles(filesArr, filesList)
})

var filesIdToSend = [];

$('body').on('click', '.js-attachment-delete', function () {
    var attachmentItem = $(this).parents('.attachment-item'),
        attachmentItemList = attachmentItem.parents('.attachment-list'),
        attachmentItemId = attachmentItem.data('id');

    attachmentItem.remove();
    filesIdToSend.remove(attachmentItemId);
    checkfilesListLength(attachmentItemList);
})

$('body').on('click', '.js-abort-attachment-uploading', function () {
    var attachmentItem = $(this).parents('.attachment-item'),
        attachmentItemFileName = attachmentItem.find('.attachment-item__name').text(),
        attachmentItemList = attachmentItem.parents('.attachment-list');

    abortFileUploading(attachmentItemFileName);
    attachmentItem.remove();

    checkfilesListLength(attachmentItemList);
})

function handleFiles(files, filesList) {
    var attachmentItemTemplate = $('.attachment-item_template').clone().removeClass('attachment-item_template hidden'),
    filesListLengthBefore = filesList.find('.attachment-item').length;

    if (files.length < (6 - filesListLengthBefore)) {
        for (var i = 0; i < files.length; i++) {
            var currentFile = files[i];
            if (currentFile.size > 2097152) {
                showNotification('Файл ' + currentFile.name + ' больше 2 МБ', 'error');
                return false;
            }
            else {
                var currentAttachment = attachmentItemTemplate.clone();

                currentAttachment.find('.attachment-item__name').text(currentFile.name);
                currentAttachment.appendTo(filesList);

                ajaxUploadFile(files[i], currentAttachment)
            }
        }
    }
    else {
        showNotification('Можно загрузить не более ' + (5 - filesListLengthBefore) + ' файлов по 2 МБ', 'error');
        return false;
    }

    checkfilesListLength(filesList);
}

function abortFileUploading(fileName) {
    uploadFileAjaxObj[fileName].abort();
    delete uploadFileAjaxObj[fileName];
}

function abortAllFileUploading() {
    for (key in uploadFileAjaxObj) {
        uploadFileAjaxObj[key].abort();
        delete uploadFileAjaxObj[key];
    }
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