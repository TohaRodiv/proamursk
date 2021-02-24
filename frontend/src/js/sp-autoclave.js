const spAutoclave = document.querySelector('.js-sp-autoclave');
if (spAutoclave) {
    const spAutoclaveSections = [...document.querySelectorAll('.sp-autoclave-section')];

    handleSpAutoclaveScroll(spAutoclaveSections);
    window.addEventListener('scroll', () => handleSpAutoclaveScroll(spAutoclaveSections));

    const spAutoclaveSectionNavigationBtns = [...document.querySelectorAll('.js-sp-autoclave-navigation-btn')];
    spAutoclaveSectionNavigationBtns.forEach(btn => {
        btn.addEventListener('click', () => spAutoclaveScrollToSection(btn));
    });

    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    toTopBtn.addEventListener('click', spAutoclaveScrollTop);

    const videoPlayBtn = document.querySelector('.js-sp-autoclave-video-play-btn');
    const video = document.querySelector('.js-sp-autoclave-video');
    videoPlayBtn.addEventListener('click', () => {
        playAutoclaveVideo(video, videoPlayBtn);
    });
}

function handleSpAutoclaveScroll(spAutoclaveSections) {
    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    let windowScroll = window.pageYOffset;
    let windowHeight = window.outerHeight;

    if (windowScroll > windowHeight / 2) toTopBtn.classList.remove('hidden');
    else toTopBtn.classList.add('hidden');
    spAutoclaveIndicateScrollSections(spAutoclaveSections);
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