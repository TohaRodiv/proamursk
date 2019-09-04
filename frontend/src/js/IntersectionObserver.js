var images = $('.lazyload');
var IntersectionObserverOptions = {
    root: document.querySelector('body')[0],
    threshold: 0.5,
};

var IntersectionObserverCallback = function(entries) {
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

            loadWithFade(image);
            imageObserver.unobserve(image);

        }
    }
};

var imageObserver = new IntersectionObserver(
    IntersectionObserverCallback,
    IntersectionObserverOptions
);

images.each(function(i, image) {
    imageObserver.observe(images[i]);
});

function loadWithFade(item) {
    item.classList.add('js-fade_animate');
    setTimeout(function() {
        item.classList.remove('lazyload', 'js-fade_animate');
    }, 300);
}