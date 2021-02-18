const spAutoclave = document.querySelector('.js-sp-autoclave');
if (spAutoclave) {
    handleSpAutoclaveScroll();
    window.addEventListener('scroll', handleSpAutoclaveScroll);
    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    toTopBtn.addEventListener('click', spAutoclaveScrollTop);

    const balloonBtns = document.querySelectorAll('.js-sp-autoclave-scheme-btn');
    balloonBtns.forEach(btn => {
        btn.addEventListener('click', () => spAutoclaveToggleSchemeBalloon(btn));
    });

    const videoPlayBtn = document.querySelector('.js-sp-autoclave-video-play-btn');
    const video = document.querySelector('.js-sp-autoclave-video');
    videoPlayBtn.addEventListener('click', () => {
        playAutoclaveVideo(video, videoPlayBtn);
    });
    video.addEventListener('click', (event) => {
        event.preventDefault();
        if (videoPlayBtn.hasAttribute('hidden')) pauseAutoclaveVideo(video, videoPlayBtn);
        else playAutoclaveVideo(video, videoPlayBtn);
    });
}

function handleSpAutoclaveScroll() {
    const toTopBtn = spAutoclave.querySelector('.js-sp-autoclave-to-top-btn');
    let windowScroll = window.pageYOffset;
    let windowHeight = window.outerHeight;

    if (windowScroll > windowHeight/2) toTopBtn.classList.remove('hidden');
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

function spAutoclaveToggleSchemeBalloon(btn) {
    const wrap = btn.closest('.js-sp-autoclave-scheme-element');
    const balloon = wrap.querySelector('.js-sp-autoclave-scheme-balloon');
    balloon.classList.toggle('visible');
}

function playAutoclaveVideo(video, videoPlayBtn) {
    video.play();
    video.setAttribute('controls', true);
    videoPlayBtn.hidden = true;
}

function pauseAutoclaveVideo(video, videoPlayBtn) {
    video.pause();
    video.removeAttribute('controls');
    videoPlayBtn.hidden = false;
}