var images = [...document.querySelectorAll('.lazyload')];
var fadeBlocks = [...document.querySelectorAll('.js-fade')];
var IntersectionObserverOptions = {
    root: document.querySelector('body')[0],
    // threshold: 0.5,
};

var IntersectionObserverImageCallback = function(entries) {
    entries.forEach(item => {
        const entry = item;
        if (entry && entry.isIntersecting) {
            const image = entry.target;
            image.onload = () => imageOnLoad(image);


            if (image.classList.contains('lazyload-inline-bg')) {
                image.style.backgroundImage = 'url(' + image.getAttribute('data-src') + ')';
                setTimeout(function() {
                    item.classList.remove('lazyload', 'js-fade', 'js-fade_animate');
                }, 300);
            }
            else if (image.getAttribute('srcset')) {
                image.srcset = image.getAttribute('data-src');
            }
            else {
                image.src = image.getAttribute('data-src');
            }
        }
    });
};

var imageObserver = new IntersectionObserver(
    IntersectionObserverImageCallback,
    IntersectionObserverOptions
);

images.forEach( item => {
    imageObserver.observe(item);
});


var IntersectionObserverBlockCallback = function(entries) {
    entries.forEach(item => {
        const entry = item;
        if (entry && entry.isIntersecting) {
            const fadeBlock = entry.target;
            showWithFade(fadeBlock);
        }
    });
};

var blockObserver = new IntersectionObserver(
    IntersectionObserverBlockCallback,
    IntersectionObserverOptions
);

fadeBlocks.forEach( item =>  {
    blockObserver.observe(item);
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