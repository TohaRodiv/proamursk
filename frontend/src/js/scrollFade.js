var fadeBlocks = document.querySelectorAll('.js-fade-block');
var windowHeightHalf = window.innerHeight / 3 * 2;

window.addEventListener('scroll', function () {
    checkFadeBlock();
});

$(function() {
    checkFadeBlock();
});

function checkFadeBlock() {
    var windowScroll = pageYOffset;

    fadeBlocks.forEach(function (item) {

        if (item.classList.contains('js-fade-block')) {
            var blockPos = item.getBoundingClientRect().top + windowScroll;

            if (blockPos < windowScroll + windowHeightHalf) {
                item.classList.add('js-fade-block_animate');
                setTimeout(() => {
                    item.classList.remove('js-fade-block', 'js-fade-block_animate');
                }, 600);
            }
        }
    });
}