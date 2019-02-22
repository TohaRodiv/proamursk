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
        attachmentItemList = attachmentItem.parents('.attachment-list'),
        id = attachmentItem.data('id');

    attachmentItem.remove();

    checkfilesListLength(attachmentItemList);
})

$('body').on('click', '.js-abort-attachment-uploading', function () {
    abortFileUploading();

    var attachmentItem = $(this).parents('.attachment-item'),
        attachmentItemList = attachmentItem.parents('.attachment-list'),
        id = attachmentItem.data('id');

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
                console.log(currentAttachment)
                uploadFile(files, 0, currentAttachment)
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
    }
    else {
        filesList.siblings('.attachment-btn').find('.attachment-label').removeClass('disabled');
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
var count = 0;

$('input[type="file"]').on('ajax', function(){
  var $this = $(this);
  if (typeof this.files[count] === 'undefined') { return false; }

  $.ajax({
    'type':'POST',
    'data': (new FormData()).append('file', this.files[count]),
    'contentType': false,
    'processData': false,
    'xhr': function() {
       var xhr = $.ajaxSettings.xhr();
       if(xhr.upload){
         xhr.upload.addEventListener('progress', progressbar, false);
       }
       return xhr;
     },
    'success': function(){
       count++;
       $this.trigger('ajax');
    }
  });
}).trigger('ajax');


function uploadFile(files, index, attachmentItem) {
    if (files.length > index) {
        var formData = new FormData(  );

        formData.append('file', files[index]);
        console.log(formData)

        ajaxUploadFile(formData, attachmentItem, files, index);
    }
}