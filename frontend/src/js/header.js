let lastScrollTop = 0;
let delta = 70;
let header = document.querySelector('header');

window.addEventListener('scroll', function() {
    let st = window.pageYOffset || document.documentElement.scrollTop;

    if (st === 0) {
        header.classList.remove('header_mobile-unfixed');
        header.classList.remove('header_mobile-fixed');
    }

    if (Math.abs(lastScrollTop - st) <= delta) return;

    if (st > lastScrollTop && st > header.offsetHeight) { // Scroll Down
        header.classList.add('header_mobile-unfixed');
        header.classList.remove('header_mobile-fixed');
    }
    else { // Scroll Up
        header.classList.remove('header_mobile-unfixed');
        if (!header.classList.contains('header_mobile-fixed')) {
            header.classList.add('animate');
            setTimeout(() => {
                header.classList.remove('animate');
            }, 300);
        }
        header.classList.add('header_mobile-fixed');
    }

    lastScrollTop = st;
}, false);