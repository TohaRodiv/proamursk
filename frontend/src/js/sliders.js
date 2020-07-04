var animateSpeed = 300;

$(function () {
    if (sliderDetect()) sliderInit();
});

// Переключение слайдов стрелками
$('.slider-arrow').on('click', function() {
    var slider = $(this).parents('.slider').eq(0),
        sliderContainer = slider.find('.slider-container').eq(0),
        slidesAmount = sliderContainer.find('.slide').length,
        sliderNavCounter = slider.find('.slide-nav-counter'),
        sliderCaption = slider.siblings('.slider-caption'),
        sliderCircles = slider.find('.slider-circles-container'),
        sliderCircleItems = sliderCircles.find('.slider-circle-item'),
        currentActiveSlideIndex = sliderContainer.find('.slide').index(sliderContainer.find('.slide.active')),
        newActiveSlideIndex = 0,
        newDescription;

    if ($(this).hasClass('slider-arrow-next')) newActiveSlideIndex = (currentActiveSlideIndex < slidesAmount - 1) ? currentActiveSlideIndex + 1 : 0;
    else if ($(this).hasClass('slider-arrow-prev')) newActiveSlideIndex = (currentActiveSlideIndex > 0) ? currentActiveSlideIndex - 1 : slidesAmount - 1;

    sliderContainer.find('.slide.active').stop().animate({
        opacity: 0,
    }, animateSpeed, "linear", function() {
        $(this).removeClass('active');
    });

    sliderContainer.find('.slide').eq(newActiveSlideIndex).stop().animate({
        opacity: 1,
    }, animateSpeed, "linear", function() {
        $(this).addClass('active');
    });

    newDescription = sliderContainer.find('.slide').eq(newActiveSlideIndex).data('description');

    if (newDescription) {
        sliderCaption.addClass('active');
        sliderCaption.html(newDescription);
    }
    else sliderCaption.removeClass('active');

    if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
        sliderNavCounter.find('span').eq(0).html(newActiveSlideIndex + 1);
    }
    else {
        var newActiveSlideIndexText = (newActiveSlideIndex + 1) > 9 ? newActiveSlideIndex + 1 : '0' + (newActiveSlideIndex + 1);
        sliderNavCounter.find('span').eq(0).html(newActiveSlideIndexText);
    }

    sliderCircleItems.eq(currentActiveSlideIndex).removeClass('active');
    sliderCircleItems.eq(newActiveSlideIndex).addClass('active');

    setSliderTimeline(slider, newActiveSlideIndex + 1);

    if (slider.find('.preview-slider__small-img-wrap').length > 0) {
        slider.find('.preview-slider__small-img-wrap .preview-slider__mini-btn').removeClass('active');
        slider.find('.preview-slider__small-img-wrap .preview-slider__mini-btn').eq(newActiveSlideIndex).addClass('active');
    }

    if (slider.hasClass('js-sp-dance-styles-slider')) {
        $('.js-sp-dance-style-slider-item').removeClass('sp-dance-style_active');
        $('.js-sp-dance-style-slider-item').eq(newActiveSlideIndex).addClass('sp-dance-style_active');
    }
});

// Переключение слайдов по клику на слайд
$('.slider-container .slide').on('click', function () {
    var slider = $(this).parents('.slider').eq(0),
        slidesAmount = slider.find('.slide').length;

    if (slidesAmount > 1) {
        slider.find('.slider-arrow-next').trigger('click');
    }
});

// Переключение слайдов шариками
$('.slider-circles-container').on('click', '.slider-circle-item', function() {
    var slider = $(this).parents('.slider').eq(0),
        sliderContainer = slider.find('.slider-container').eq(0),
        sliderNavCounter = slider.find('.slide-nav-counter'),
        sliderCircles = slider.find('.slider-circles-container'),
        sliderCircleItems = sliderCircles.find('.slider-circle-item'),
        currentActiveSlideIndex = sliderContainer.find('.slide').index(sliderContainer.find('.slide.active')),
        newActiveSlideIndex = sliderCircleItems.index($(this));

    if (currentActiveSlideIndex != newActiveSlideIndex) {
        sliderContainer.find('.slide.active').stop().animate({
            opacity: 0,
        }, animateSpeed, "linear", function() {
            $(this).removeClass('active');
        });

        sliderContainer.find('.slide').eq(newActiveSlideIndex).stop().animate({
            opacity: 1,
        }, animateSpeed, "linear", function() {
            $(this).addClass('active');
        });


        if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
            sliderNavCounter.find('span').eq(0).html(newActiveSlideIndex + 1);
        }
        else {
            var newActiveSlideIndexText = (newActiveSlideIndex + 1) > 9 ? newActiveSlideIndex + 1 : '0' + (newActiveSlideIndex + 1);
            sliderNavCounter.find('span').eq(0).html(newActiveSlideIndexText);
        }

        sliderCircleItems.eq(currentActiveSlideIndex).removeClass('active');
        sliderCircleItems.eq(newActiveSlideIndex).addClass('active');

        setSliderTimeline(slider, newActiveSlideIndex+1);
    }
});

// Проверка на существование слайдеров на странице
function sliderDetect() {
    return $('.slider').length > 0 ? true : false;
}

// Инициализация слайдеров
function sliderInit() {
    $('.slider').each(function() {
        var sliderContainer = $(this).find('.slider-container').eq(0),
            slidesAmount = sliderContainer.find('.slide').length,
            slidesAmountText = slidesAmount > 9 ? slidesAmount : '0' + slidesAmount,
            sliderCaption = $(this).siblings('.slider-caption'),
            sliderNav = $(this).find('.slider-arrow'),
            sliderNavCounter = $(this).find('.slide-nav-counter'),
            sliderCircles = $(this).find('.slider-circles-container');

        if (slidesAmount > 0) {
            var firstSlide = sliderContainer.find('.slide').eq(0);

            if (firstSlide.data('description')) {
                sliderCaption.addClass('active');
                sliderCaption.html(firstSlide.data('description'));
            }
            else sliderCaption.removeClass('active');

            firstSlide.addClass('active');
        }

        if (slidesAmount > 1) {
            sliderNav.addClass('active');
            sliderNavCounter.addClass('active');

            if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
                sliderNavCounter.find('span').eq(0).html('1');
                sliderNavCounter.find('span').eq(1).html(slidesAmount);
            }
            else {
                sliderNavCounter.find('span').eq(0).html('01');
                sliderNavCounter.find('span').eq(1).html(slidesAmountText);
            }

            sliderCircles.addClass('active');

            if (sliderCircles.length > 0 && sliderCircles.hasClass('active')) {
                for (var i = 0; i < slidesAmount; i++) {
                    sliderCircles.append('<span class="slider-circle-item"></span>');
                }
                sliderCircles.find('.slider-circle-item').eq(0).addClass('active');
            }
        }
        else  {
            sliderCircles.remove();
        }

        if ($(this).find('.preview-slider__small-img-wrap').length > 0) {
            $(this).find('.preview-slider__small-img-wrap .preview-slider__mini-btn').eq(0).addClass('active');
        }
    });
}


$('.timeline-step').click(function () {
    var timeline = $(this).parents('.sp-slider-timeline'),
        slider = timeline.siblings('.slider'),
        sliderContainer = slider.find('.slider-container').eq(0),
        sliderNavCounter = slider.find('.slide-nav-counter'),
        sliderCircles = slider.find('.slider-circles-container'),
        sliderCircleItems = sliderCircles.find('.slider-circle-item'),
        currentActiveSlideIndex = sliderContainer.find('.slide').index(sliderContainer.find('.slide.active')),
        newActiveSlideIndex = $(this).data('timeline-slide')-1;

    if (currentActiveSlideIndex != newActiveSlideIndex) {
        sliderContainer.find('.slide.active').stop().animate({
            opacity: 0,
        }, animateSpeed, "linear", function() {
            $(this).removeClass('active');
        });

        sliderContainer.find('.slide').eq(newActiveSlideIndex).stop().animate({
            opacity: 1,
        }, animateSpeed, "linear", function() {
            $(this).addClass('active');
        });


        if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
            sliderNavCounter.find('span').eq(0).html(newActiveSlideIndex + 1);
        }
        else {
            var newActiveSlideIndexText = (newActiveSlideIndex + 1) > 9 ? newActiveSlideIndex + 1 : '0' + (newActiveSlideIndex + 1);
            sliderNavCounter.find('span').eq(0).html(newActiveSlideIndexText);
        }

        sliderCircleItems.eq(currentActiveSlideIndex).removeClass('active');
        sliderCircleItems.eq(newActiveSlideIndex).addClass('active');

        setSliderTimeline(slider, newActiveSlideIndex+1);
    }
});

$('.preview-slider__mini-btn').click(function () {
    var sliderPreviewWrap = $(this).parents('.preview-slider__small-img-wrap');
    sliderPreviewWrap.find('.preview-slider__mini-btn').removeClass('active');
    $(this).addClass('active');

    var slider = $(this).parents('.slider'),
        sliderContainer = slider.find('.slider-container').eq(0),
        sliderNavCounter = slider.find('.slide-nav-counter'),
        sliderCircles = slider.find('.slider-circles-container'),
        sliderCircleItems = sliderCircles.find('.slider-circle-item'),
        currentActiveSlideIndex = sliderContainer.find('.slide').index(sliderContainer.find('.slide.active')),
        newActiveSlideIndex = sliderPreviewWrap.find('.preview-slider__mini-btn').index($(this));

    if (currentActiveSlideIndex != newActiveSlideIndex) {
        sliderContainer.find('.slide.active').stop().animate({
            opacity: 0,
        }, animateSpeed, "linear", function() {
            $(this).removeClass('active');
        });

        sliderContainer.find('.slide').eq(newActiveSlideIndex).stop().animate({
            opacity: 1,
        }, animateSpeed, "linear", function() {
            $(this).addClass('active');
        });

        if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
            sliderNavCounter.find('span').eq(0).html(newActiveSlideIndex + 1);
        }
        else {
            var newActiveSlideIndexText = (newActiveSlideIndex + 1) > 9 ? newActiveSlideIndex + 1 : '0' + (newActiveSlideIndex + 1);
            sliderNavCounter.find('span').eq(0).html(newActiveSlideIndexText);
        }

        sliderCircleItems.eq(currentActiveSlideIndex).removeClass('active');
        sliderCircleItems.eq(newActiveSlideIndex).addClass('active');
    }
});


function setSliderTimeline(slider, newActiveSlideIndex) {
    var sliderTimeline = slider.siblings('.sp-slider-timeline');

    sliderTimeline.find('.timeline-step').each(function () {
        var currentStepSlide = $(this).data('timeline-slide');
        if (currentStepSlide <= newActiveSlideIndex) {
            $(this).addClass('active');
        }
        else {
            $(this).removeClass('active');
        }
    });
}

let previewSliderThumbArrow = document.querySelectorAll('.js-preview-slider-thumb-arrow');

if (previewSliderThumbArrow) {
    previewSliderThumbArrow.forEach(item => {
        let slider = item.closest('.slider');
        let sliderThumbsAmount = slider.querySelectorAll('.preview-slider__small-img-wrap .preview-slider__mini-btn').length;
        if (sliderThumbsAmount > 5) {
            slider.querySelector('.preview-slider__thumbs-arrow-container').classList.remove('hidden');

            item.addEventListener('click', (event) => {
                let thumbsSliderOuter = slider.querySelector('.preview-slider__thumbs-block');
                let thumbsSliderInner = slider.querySelector('.preview-slider__small-img-wrap');
                let currentImg = slider.querySelector('.preview-slider__small-img-wrap .preview-slider__mini-btn.active');

                let thumbsSliderOuterPosition = {
                        left: thumbsSliderOuter.getBoundingClientRect().left,
                        right: thumbsSliderOuter.getBoundingClientRect().right,
                    },
                    targetPosition = {
                        left: currentImg.getBoundingClientRect().left,
                        right: currentImg.getBoundingClientRect().right,
                    };

                if (targetPosition.right <= thumbsSliderOuterPosition.right && targetPosition.left >= thumbsSliderOuterPosition.left) {
                } else {
                    if (targetPosition.left > thumbsSliderOuterPosition.left) {
                        if (thumbsSliderInner.scrollLeft > currentImg.offsetLeft) {
                            thumbsSliderInner.scrollLeft = currentImg.offsetLeft;
                        } else {
                            thumbsSliderInner.scrollLeft = currentImg.offsetLeft;
                        }
                    } else {
                        thumbsSliderInner.scrollLeft = currentImg.offsetLeft;
                    }
                }
            });
        }
    });
}

$('.sp-birthday-reviews-slider')
    .on('init', function(event, slick) {
        if (slick.currentSlide+1 === slick.slideCount) $('.sp-birthday-reviews-slider_outer .slide-nav-counter').html(slick.currentSlide + 1 +' из '+slick.slideCount);
        else $('.sp-birthday-reviews-slider_outer .slide-nav-counter').html(slick.currentSlide + 2 +' из '+slick.slideCount);
    });

$('.sp-birthday-reviews-slider')
    .on('afterChange', function(event, slick, currentSlide){
        if (slick.currentSlide+1 === slick.slideCount) $('.sp-birthday-reviews-slider_outer .slide-nav-counter').html(slick.currentSlide + 1 +' из '+slick.slideCount);
        else $('.sp-birthday-reviews-slider_outer .slide-nav-counter').html(slick.currentSlide + 2 +' из '+slick.slideCount);
    });

$('.sp-birthday-reviews-slider')
    .on('beforeChange', function(event, slick, currentSlide, nextSlide){
        setTimeout(()=> {
            sliderAdaptiveHeight();
        }, 50);
    });

$('.sp-birthday-reviews-slider').slick({
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,
    lazyLoad: 'ondemand',
    prevArrow:'<button class="slider-arrow slider-arrow-prev icon-arrow-left active"></button>',
    nextArrow:'<button class="slider-arrow slider-arrow-next icon-arrow-right active"></button>',
});

var sliderAdaptiveHeight = function(showSlides) {
    var heights = [];
    let items = $('.slick-active');
    items.each(function() {
        heights.push($(this).outerHeight());
    });
    $('.slick-list').height(Math.max.apply(null, heights));
};

$('.js-cinema-widget-slider').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    lazyLoad: 'progressive',
    dotsClass: 'slick-dots cinema-widget__dots-container',
    prevArrow:'<button class="cinema-widget__slider-arrow slider-arrow-prev icon-arrow-left"></button>',
    nextArrow:'<button class="cinema-widget__slider-arrow slider-arrow-next icon-arrow-right"></button>',
});

$('.js-specials-slider').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    lazyLoad: 'progressive',
    dotsClass: 'slick-dots specials__dots-container',
    prevArrow:'<button class="specials__slider-arrow slider-arrow-prev icon-arrow-left"></button>',
    nextArrow:'<button class="specials__slider-arrow slider-arrow-next icon-arrow-right"></button>',
});