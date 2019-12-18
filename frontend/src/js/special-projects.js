$('.js-sp-dance-style-slider-item').click(function () {
    let clickedIndex = $(this).index();
    let sliderBulletByIndex = $('.js-sp-dance-styles-slider .slider-circle-item').eq(clickedIndex);

    sliderBulletByIndex.trigger('click');
    $('.js-sp-dance-style-slider-item').removeClass('sp-dance-style_active');
    $(this).addClass('sp-dance-style_active');
});


$('.js-sp-winter-fun-event-card').click(function () {
    let clickedEventId = $(this).data('id');
    showPopUp('sp-winter-fun-city-5');
    let event = $('.js-sp-winter-fun-event-place[data-event="' + clickedEventId + '"]')[0];
    let eventPosition = event.offsetTop;
    const eventContainer = $('.js-sp-winter-fun-event-container')[0];
    eventContainer.scrollTop = eventPosition - 20;
});

$('.js-sp-winter-fun-event-date').click(function (event) {
    event.stopPropagation();
    let clickedEventId = $(this).data('id');
    showPopUp('sp-winter-fun-city-5');
    let eventItem = $('.js-sp-winter-fun-event-date[data-event="' + clickedEventId + '"]')[0];
    const eventContainer = $('.js-sp-winter-fun-event-container')[0];
    let eventPosition = eventItem.offsetTop;
    eventContainer.scrollTop = eventPosition - 20;
});


