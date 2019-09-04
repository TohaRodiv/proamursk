var fadeBlocks = $('.js-fade');
var windowHeightHalf = window.innerHeight / 3 * 2;

window.addEventListener('scroll', function () {
    checkFadeBlock();
});

$(function() {
    checkFadeBlock();
});

function checkFadeBlock() {
    var windowScroll = pageYOffset;

    fadeBlocks.each(function (item) {
        if (item.classList.contains('js-fade')) {
            var blockPos = item.getBoundingClientRect().top + windowScroll;

            if (blockPos < windowScroll + windowHeightHalf) {
                item.classList.add('js-fade_animate');
                setTimeout(function() {
                    item.classList.remove('js-fade', 'js-fade_animate');
                }, 300);
            }
        }
    });
}