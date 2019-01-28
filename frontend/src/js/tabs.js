function setFirstTabsVisible() {
    $('.tab__content-wrap').each(function () {
        if (!$(this).hasClass('index-tire-selection__tabs')) $(this).find('.tab__content').eq(0).addClass('visible');
    })

    $('.tab__btns-wrap').each(function() {
        if ($(this).find('.tab__btn').length > 1 && !$(this).hasClass('index-tire-selection__btns-wrap')) {
            $(this).find('.tab__btn').eq(0).addClass('active');
        }
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
    if ($('.contacts-page').length == 0) {
        setFirstTabsVisible();
    }
})

$('body').on('click', '.js-tab__btn', function () {
    switchTab($(this));
})

$('body').on('change', '.tab__input', function () {
    var tabBtn = $(this).siblings('.tab__btn');

    switchTab(tabBtn);
})


// переключает вкладки в результатах поиска
$('body').on('click', '.js-search-result-section', function () {
    var thisBtnIndex = $(this).index();

    // Синхронизирует кнопки в разных размерах окна
    if ($(this).parents('.search-result__buttons-panel').length > 0) {
        var sameSelectBtn = $('.search-result__tabs-select').find('.js-search-result-section').eq(thisBtnIndex),
            sameSelectBtnText = sameSelectBtn.text(),
            selectValue = sameSelectBtn.parents('.select').find('.select__value_visible'),
            sameSelectBtnParent = sameSelectBtn.parent('.tab__btns-wrap');

        sameSelectBtnParent.find('.js-search-result-section').removeClass('select__option_choosen');
        sameSelectBtn.addClass('select__option_choosen');
        selectValue.text(sameSelectBtnText)
    }

    if ($(this).parents('.search-result__tabs-select').length > 0) {
        var sameSliderBtn = $('.search-result__buttons-panel').find('.js-search-result-section').eq(thisBtnIndex),
            sameSliderBtnParent = sameSliderBtn.parent('.tab__btns-wrap');

        sameSliderBtnParent.find('.js-search-result-section').removeClass('active');
        sameSliderBtn.addClass('active');
    }

    switchTab($(this));
})

// переключает вкладки в карточке товара
$('body').on('click', '.js-product-card-section', function () {
    var thisBtnIndex = $(this).index();

    // Синхронизирует кнопки в разных размерах окна
    if ($(this).parents('.product-card__tab-btns-wrap').length > 0) {
        var sameSelectBtn = $('.product-card__tabs-select').find('.js-product-card-section').eq(thisBtnIndex),
            sameSelectBtnText = sameSelectBtn.text(),
            selectValue = sameSelectBtn.parents('.select').find('.select__value_visible'),
            sameSelectBtnParent = sameSelectBtn.parent('.tab__btns-wrap');

        sameSelectBtnParent.find('.js-product-card-section').removeClass('select__option_choosen');
        sameSelectBtn.addClass('select__option_choosen');
        selectValue.text(sameSelectBtnText)
    }

    if ($(this).parents('.product-card__tabs-select').length > 0) {
        var sameSliderBtn = $('.product-card__tab-btns-wrap').find('.js-product-card-section').eq(thisBtnIndex),
            sameSliderBtnParent = sameSliderBtn.parent('.tab__btns-wrap');

        sameSliderBtnParent.find('.js-product-card-section').removeClass('active');
        sameSliderBtn.addClass('active');
    }

    switchTab($(this));
})