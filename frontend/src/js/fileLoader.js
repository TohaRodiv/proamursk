$('.attachment-input').on('click', function() {
    $('.attachment-input').val('');
});

$('.attachment-input').change(function () {
    var filesArr = this.files,
        filesList = $(this).parents('.attachment').find('.attachment-list');

    handleFiles(filesArr, filesList)
})

function handleFiles(files, filesList) {
    var deleteBtn = $('<button/>', {
        type: 'button',
        class: 'attachment-delete-btn js-attachment-delete icon-close',
    });

    if (files.length < 6) {
        filesList.empty();

        for (var i = 0; i < files.length; i++) {
            var currentFile = files[i];
            if (currentFile.size > 2097152) {
                showNotification('Файл ' + currentFile.name + ' больше 2 Мб', 'error');
                return false;
            }
            else {
                $('<div/>', {
                    class: 'attachment-list__item',
                    append: $('<span/>', {
                        text: currentFile.name,
                        class: 'attachment-list__item-name',
                    })
                }).appendTo(filesList);
            }
        }

        filesList.find('.attachment-list__item').each(function () {
            deleteBtn.clone().appendTo($(this))
        })
    }
    else {
        showNotification('Можно загрузить не более 5 файлов по 2 Мб', 'error');
        return false;
    }
}

function clearFileInput() {
    $('.attachment-input').val('');
    $('.attachment-list').empty();
}