function setFirstTabsVisible() {
    $('.tabs-wrap').each(function () {
        $(this).find('.tab__btn').eq(0).addClass('active');
        $(this).find('.tab__content').eq(0).addClass('visible');
    })
}

function switchTab(elem) {
    var parent = elem.parents('.tabs-wrap:first'),
        allTabContents = parent.find('.tab__content-wrap:first').children('.tab__content'),
        parentBtnWrap = elem.parents('.tab__btns-wrap:first'),
        allTabBtns = parentBtnWrap.children('.tab__btn'),
        clickedBtnIndex = allTabBtns.index(parent.find(elem));

    allTabContents.removeClass('visible').eq(clickedBtnIndex).addClass('visible');
    allTabBtns.removeClass('active');
    elem.addClass('active');
}

$(function () {
    setFirstTabsVisible();
})

$('body').on('click', '.js-tab__btn', function () {
    switchTab($(this));
})
