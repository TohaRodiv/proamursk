$('.js-sp-dance-style-slider-item').click(function () {
    let clickedIndex = $(this).index();
    let sliderBulletByIndex = $('.js-sp-dance-styles-slider .slider-circle-item').eq(clickedIndex);

    sliderBulletByIndex.trigger('click');
});