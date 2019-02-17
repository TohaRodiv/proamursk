var preloaderHideTime = 1000,
    gridPreloaderShowTime = 100,
    selectPreloaderShowTime = 300,
    preloaderId,
    selectPreloaderId;

function showLayoutPreloader() {
    preloaderId = setTimeout(function () {
        $('.products-list').addClass('loading');
        $('.preloader').addClass('visible');
    }, gridPreloaderShowTime);
}

function hideGridPreloader() {
    setTimeout(function () {
        $('.products-list').removeClass('loading');
        $('.preloader').removeClass('visible');
    }, preloaderHideTime);
}

function hideBtnPreloader() {
    setTimeout(function () {
        $('.btn_preloader').removeClass('btn_preloader');
    }, preloaderHideTime);
}