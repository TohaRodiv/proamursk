const spAutoclave = document.querySelector('.js-sp-autoclave');
if (spAutoclave) {
    handleSpAutoclaveScroll();
    window.addEventListener('scroll', handleSpAutoclaveScroll);
    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    toTopBtn.addEventListener('click', spAutoclaveScrollTop);

    const videoPlayBtn = document.querySelector('.js-sp-autoclave-video-play-btn');
    const video = document.querySelector('.js-sp-autoclave-video');
    videoPlayBtn.addEventListener('click', () => {
        video.play();
        playAutoclaveVideo(video, videoPlayBtn);
    });
    // video.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     if (videoPlayBtn.hasAttribute('hidden')) pauseAutoclaveVideo(video, videoPlayBtn);
    //     else playAutoclaveVideo(video, videoPlayBtn);
    // });
    video.addEventListener('play', (event) => {
        playAutoclaveVideo(video, videoPlayBtn);
    });
    video.addEventListener('pause', (event) => {
        pauseAutoclaveVideo(video, videoPlayBtn);
    });

    const spAutoclaveSectionNavigationBtns = [...document.querySelectorAll('.js-sp-autoclave-navigation-btn')];
    spAutoclaveSectionNavigationBtns.forEach(btn => {
        btn.addEventListener('click', () => spAutoclaveScrollToSection(btn));
    });
    const spAutoclaveSection = [...document.querySelectorAll('.sp-autoclave-section')];
    const spAutoclaveSectionIntersectionObserverOptions = {
        root: document.querySelector('body')[0],
        rootMargin: '40px 0px 0px 0px',
    };
    const spAutoclaveSectionIntersectionObserverCallback = function(entries) {
        entries.forEach(item => {
            const entry = item;
            if (entry && entry.isIntersecting) {
                const sectionIndex = item.target.dataset.section;
                const sectionBtn = document.querySelector(`.js-sp-autoclave-navigation-btn[data-section="${sectionIndex}"]`);
                sectionBtn.classList.add('sp-autoclave-navigation__btn_current');
            }
            else {
                const sectionIndex = item.target.dataset.section;
                const sectionBtn = document.querySelector(`.js-sp-autoclave-navigation-btn[data-section="${sectionIndex}"]`);
                sectionBtn.classList.remove('sp-autoclave-navigation__btn_current');
            }
        });
    };
    const spAutoclaveSectionObserver = new IntersectionObserver(
        spAutoclaveSectionIntersectionObserverCallback,
        spAutoclaveSectionIntersectionObserverOptions
    );
    spAutoclaveSection.forEach(item => {
        spAutoclaveSectionObserver.observe(item);
    });
}

function handleSpAutoclaveScroll() {
    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    let windowScroll = window.pageYOffset;
    let windowHeight = window.outerHeight;

    if (windowScroll > windowHeight / 2) toTopBtn.classList.remove('hidden');
    else toTopBtn.classList.add('hidden');
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
    video.setAttribute('controls', true);
    videoPlayBtn.hidden = true;
}

function pauseAutoclaveVideo(video, videoPlayBtn) {
    video.removeAttribute('controls');
    videoPlayBtn.hidden = false;
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