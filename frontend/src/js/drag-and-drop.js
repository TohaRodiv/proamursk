var dropArea = document.getElementsByClassName('js-drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
    for (var i = 0; i < dropArea.length; i++) {
        dropArea[i].addEventListener(eventName, preventDefaults, false)
    }
});

function preventDefaults(event) {
    event.preventDefault();
    event.stopPropagation();
};

['dragenter', 'dragover'].forEach(function(eventName) {
    for (var i = 0; i < dropArea.length; i++) {
        dropArea[i].addEventListener(eventName, function() {
            highlight(this);
        }, false)
    }
});

['dragleave', 'drop'].forEach(function(eventName) {
    for (var i = 0; i < dropArea.length; i++) {
        dropArea[i].addEventListener(eventName, function() {
            unhighlight(this);
        }, false)
    }
});

function highlight(currentDrop) {
    currentDrop.classList.add('highlight');
}

function unhighlight(currentDrop) {
    currentDrop.classList.remove('highlight');
}

for (var i = 0; i < dropArea.length; i++) {
    dropArea[i].addEventListener('drop', handleDrop, false);
}

function handleDrop(event) {
    var dt = event.dataTransfer,
        files = dt.files;

    var filesList = $(event.target).parents('.pop-up-form-content').find('.attachment-list');
    handleFiles(files, filesList)
}