let lastScrollTop = 0;
let unfixedTimeout = null;
let header = document.querySelector('header');
let scrollValue = 0;
let scrollTimeout = false;

window.addEventListener("scroll", function() {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(function() {
        let scrolled = $(document).scrollTop() - scrollValue;
        scrollValue = $(document).scrollTop();
        if (Math.abs(scrolled) > 50) {
            let st = window.pageYOffset || document.documentElement.scrollTop;
            if (lastScrollTop < lastScrollTop + 50 || lastScrollTop)
                if (window.pageYOffset > header.offsetHeight) {
                    if (st > lastScrollTop) { // downscroll code
                        clearTimeout(unfixedTimeout);
                        if (header.classList.contains('header_mobile-fixed')) {
                            header.classList.add('header_mobile-unfixed');
                            unfixedTimeout = setTimeout(() => {
                                header.classList.remove('header_mobile-unfixed');
                            }, 300);
                        }
                        header.classList.remove('header_mobile-fixed');
                    } else { // upscroll code
                        header.classList.add('header_mobile-fixed');
                    }
                } else if (window.pageYOffset === 0) {
                    header.classList.remove('header_mobile-fixed');
                    header.classList.remove('header_mobile-unfixed');
                } else {
                    header.classList.remove('header_mobile-unfixed');
                }
            lastScrollTop = st <= 0 ? 0 : st;
        }
    }, 100);
}, false);