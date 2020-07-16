var lastScrollTop = 0;
let unfixedTimeout = null;

window.addEventListener("scroll", function() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > lastScrollTop || window.pageYOffset === 0) { // downscroll code
        document.querySelector('header').classList.remove('header_mobile-fixed');
        document.querySelector('header').classList.add('header_mobile-unfixed');
        clearTimeout(unfixedTimeout);
        unfixedTimeout = setTimeout(() => {
            document.querySelector('header').classList.remove('header_mobile-unfixed');
        }, 300);
    }
    else { // upscroll code
        document.querySelector('header').classList.add('header_mobile-fixed');
    }
    lastScrollTop = st <= 0 ? 0 : st;
}, false);