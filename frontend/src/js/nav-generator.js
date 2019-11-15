$(function() {
    var contentTitles = $('.js-privacy-container').find('[class*="wysiwyg-h"]');

    contentTitles.each(function (index) {
        $(this).attr('id', 'section' + (index + 1));
        var currentItemText = $(this).text().replace(/^\d+[\.\)]/ig, "");
        $('<li/>', {
            class: 'privacy__list-item',
            append: $('<a/>', {
                class: 'privacy__link',
                text: currentItemText,
                href: '#section' + (index + 1),
            }),
        }).appendTo('.js-privacy-nav');
    });
});

$(document).ready(function(){
    $('a[href*="#"]').on("click", function(e){
        var anchor = $(this),
            fixedTopOffset = 40;
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top - fixedTopOffset,
        }, 500);
        e.preventDefault();
        return false;
    });
});
