$('.js-sp-dance-style-slider-item').click(function () {
    let clickedIndex = $(this).index();
    let sliderBulletByIndex = $('.js-sp-dance-styles-slider .slider-circle-item').eq(clickedIndex);

    sliderBulletByIndex.trigger('click');
    $('.js-sp-dance-style-slider-item').removeClass('sp-dance-style_active');
    $(this).addClass('sp-dance-style_active');
});
