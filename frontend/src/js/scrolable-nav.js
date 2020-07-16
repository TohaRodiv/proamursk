let scrollList = document.querySelectorAll('.js-scroll-to-active');

if (scrollList.length) {
    scrollList.forEach(item => {
        let activeEl = item.querySelector('.active');
        if (activeEl) {
            let activeElLeft = activeEl.offsetLeft;

            item.scrollLeft = activeElLeft - 16;
        }
    });
}