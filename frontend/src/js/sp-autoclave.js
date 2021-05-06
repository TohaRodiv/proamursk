const spAutoclave = document.querySelector('.js-sp-autoclave');
if (spAutoclave) {
    const spAutoclaveSections = [...document.querySelectorAll('.sp-autoclave-section')];

    handleSpAutoclaveScroll(spAutoclaveSections);
    window.addEventListener('scroll', () => handleSpAutoclaveScroll(spAutoclaveSections));
    window.addEventListener('resize', () => handleSpAutoclaveResize());

    const spAutoclaveSectionNavigationBtns = [...document.querySelectorAll('.js-sp-autoclave-navigation-btn')];
    spAutoclaveSectionNavigationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            spAutoclaveHideMobileMenu();
            spAutoclaveScrollToSection(btn);
        });
    });

    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    toTopBtn.addEventListener('click', spAutoclaveScrollTop);

    const videoPlayBtn = document.querySelector('.js-sp-autoclave-video-play-btn');
    const video = document.querySelector('.js-sp-autoclave-video');
    videoPlayBtn.addEventListener('click', () => {
        playAutoclaveVideo(video, videoPlayBtn);
    });

    const spAutoclaveMobileMenuToggles = document.querySelectorAll('.js-sp-autoclave-mobile-menu-toggle');
    spAutoclaveMobileMenuToggles.forEach(btn => {
        btn.addEventListener('click', spAutoclaveToggleMobileMenu);
    });

    const spAutoclaveMobileHintBtns = document.querySelectorAll('.js-sp-autoclave-scheme-hint-btn');
    spAutoclaveMobileHintBtns.forEach(btn => {
        btn.addEventListener('click', () => spAutoclaveShowMobileHint(btn));
    });
    const spAutoclaveMobileHintClose = document.querySelector('.js-sp-autoclave-mobile-hint-close');
    spAutoclaveMobileHintClose.addEventListener('click', spAutoclaveHideMobileHint);

    $('body').click(function(event) {
        if(!$(event.target).hasClass('js-sp-autoclave-scheme-hint-btn') && !$(event.target).hasClass('js-sp-autoclave-mobile-hint-close')) {
            spAutoclaveHideMobileHint();
        }
    });
}

function handleSpAutoclaveScroll(spAutoclaveSections) {
    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    let windowScroll = window.pageYOffset;
    let windowHeight = window.outerHeight;

    if (windowScroll > windowHeight / 2) toTopBtn.classList.remove('hidden');
    else toTopBtn.classList.add('hidden');
    spAutoclaveIndicateScrollSections(spAutoclaveSections);
    spAutoclaveSetProgressBar();
}

function handleSpAutoclaveResize() {
    spAutoclaveSetProgressBar();
    if (window.innerWidth >= 1024) {
        spAutoclaveHideMobileMenu();
        spAutoclaveHideMobileHint();
    }
}

function spAutoclaveScrollTop() {
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
    });
    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    toTopBtn.classList.remove('hidden');
}

function playAutoclaveVideo(video, videoPlayBtn) {
    video.play();
    video.setAttribute('controls', true);
    videoPlayBtn.hidden = true;
}

function spAutoclaveScrollToSection(btn) {
    const sectionIndex = btn.dataset.section;
    const section = document.querySelector(`.sp-autoclave-section[data-section="${sectionIndex}"]`);
    const sectionTop = section.offsetTop;
    window.scroll({
        top: sectionTop - 40,
        left: 0,
        behavior: 'smooth',
    });
}

function spAutoclaveIndicateScrollSections(spAutoclaveSections) {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    spAutoclaveSections.forEach(item => {
        const sectionIndex = item.dataset.section;
        const sectionBtn = document.querySelector(`.js-sp-autoclave-navigation-btn[data-section="${sectionIndex}"]`);

        if (st >= item.offsetTop - window.outerHeight / 2) {
            const activeBtns = document.querySelectorAll('.sp-autoclave-navigation__btn_current');
            if (activeBtns.length) activeBtns.forEach(btn => btn.classList.remove('sp-autoclave-navigation__btn_current'));
            sectionBtn.classList.add('sp-autoclave-navigation__btn_current');
        }
    });
}

function spAutoclaveToggleMobileMenu() {
    const menu = document.querySelector('.js-sp-autoclave-mobile-menu');
    menu.classList.toggle('visible');
}

function spAutoclaveHideMobileMenu() {
    const menu = document.querySelector('.js-sp-autoclave-mobile-menu');
    if (menu.classList.contains('visible')) {
        menu.classList.remove('visible');
    }
}

function spAutoclaveSetProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const contentHeight = document.querySelector('.js-sp-autoclave').offsetHeight;
    const scrolled = Math.round((winScroll / contentHeight) * 100);
    document.querySelector('.sp-autoclave-progress-bar').style.width = scrolled + "%";
}


function spAutoclaveShowMobileHint(btn) {
    if (window.innerWidth < 1024 && !btn.classList.contains('active')) {
        const currentActiveBtn = document.querySelector('.js-sp-autoclave-scheme-hint-btn.active')
        if(currentActiveBtn) currentActiveBtn.classList.remove('active');
        btn.classList.add('active');

        const text = btn.nextElementSibling.innerText;
        const hintTextWrap = document.querySelector('.js-sp-autoclave-mobile-hint-text');
        const mobileHint = document.querySelector('.js-sp-autoclave-mobile-hint');

        hintTextWrap.innerText = text;
        mobileHint.classList.add('visible');
    }
}
function spAutoclaveHideMobileHint() {
    const transitionTime = 300;
    const mobileHint = document.querySelector('.js-sp-autoclave-mobile-hint');
    if (mobileHint.classList.contains('visible')) {
        mobileHint.style.bottom = `-${mobileHint.offsetHeight}px`;
        setTimeout(() => {
            document.querySelector('.js-sp-autoclave-scheme-hint-btn.active').classList.remove('active');
            mobileHint.classList.remove('visible');
            mobileHint.style.bottom = null;
        }, transitionTime);
    }
}