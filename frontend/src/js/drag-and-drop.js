var dropArea = document.getElementsByClassName('js-drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
    for (var i = 0; i < dropArea.length; i++) {
        dropArea[i].addEventListener(eventName, preventDefaults, false)
    }
});

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
};

['dragenter', 'dragover'].forEach(eventName => {
    for (var i = 0; i < dropArea.length; i++) {
        dropArea[i].addEventListener(eventName, function() {
            highlight(this)
        }, false)
    }
});

['dragleave', 'drop'].forEach(eventName => {
    for (var i = 0; i < dropArea.length; i++) {
        dropArea[i].addEventListener(eventName, function() {
            unhighlight(this)
        }, false)
    }
});

function highlight(currentDrop) {
    currentDrop.classList.add('highlight')
}

function unhighlight(currentDrop) {
    currentDrop.classList.remove('highlight')
}

for (var i = 0; i < dropArea.length; i++) {
    dropArea[i].addEventListener('drop', handleDrop, false)
}

function handleDrop(e) {
    var dt = e.dataTransfer,
        files = dt.files;

    var filesList = $(event.target).parents('.pop-up-form-content').find('.attachment-list');
    handleFiles(files, filesList)
}