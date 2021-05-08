let menuToggler = document.querySelector('.js-mobile-menu-toggler');
let menu = document.querySelector('.js-mobile-menu');

if (menuToggler) {
    menuToggler.addEventListener('click', function () {
        menuToggler.classList.toggle('icon-menu');
        menuToggler.classList.toggle( 'icon-close');
        menu.classList.toggle('visible');
        document.querySelector('body').classList.toggle('mobile-menu-open');
    });
}

window.addEventListener('optimizedResize', function() {
    if (window.innerWidth >= 1024) {
        menuToggler.classList.add('icon-menu');
        menuToggler.classList.remove( 'icon-close');
        menu.classList.remove('visible');
        document.querySelector('body').classList.remove('mobile-menu-open');
    }
});

let publicationPage = document.querySelector('article.publication .publication__cover');
if (publicationPage) {
    document.querySelector('header').classList.add('header_no-shadow');
    document.querySelector('main').classList.add('no-offset');
}
