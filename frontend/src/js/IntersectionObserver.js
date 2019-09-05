var images = $('.lazyload');
var fadeBlocks = $('.js-fade');
var IntersectionObserverOptions = {
    root: document.querySelector('main')[0],
    // threshold: 0.5,
};


var IntersectionObserverImageCallback = function(entries) {
    for (var i=0, max= entries.length; i < max; i++) {
        var entry = entries[i];
        if (entry && entry.isIntersecting) {
            var image = entry.target;

            if (image.classList.contains('lazyload-inline-bg')) {
                image.style.backgroundImage = 'url(' + image.getAttribute('data-src') + ')';
            }
            else {
                image.src = image.getAttribute('data-src');
            }

            image.onload = imageOnLoad(image);
        }
    }
};

var imageObserver = new IntersectionObserver(
    IntersectionObserverImageCallback,
    IntersectionObserverOptions
);

images.each(function(i) {
    imageObserver.observe(images[i]);
});


var IntersectionObserverBlockCallback = function(entries) {
    for (var i=0, max= entries.length; i < max; i++) {
        var entry = entries[i];
        if (entry && entry.isIntersecting) {

            var fadeBlock = entry.target;
            showWithFade(fadeBlock);
        }
    }
};

var blockObserver = new IntersectionObserver(
    IntersectionObserverBlockCallback,
    IntersectionObserverOptions
);

fadeBlocks.each(function(i) {
    blockObserver.observe(fadeBlocks[i]);
});


function imageOnLoad(image) {
    showWithFade(image);
    imageObserver.unobserve(image);
}

function showWithFade(item) {
    item.classList.add('js-fade_animate');
    setTimeout(function() {
        item.classList.remove('lazyload', 'js-fade', 'js-fade_animate');
    }, 300);
}