$(function() {
    var contentTitles = $('.js-privacy-container').find('[class*="wysiwyg-h"]');

    contentTitles.each(function (index) {
        $(this).attr('id', 'privacy' + (index + 1));
        var currentItemText = $(this).text().replace(/^\d+[\.\)]/ig, "");
        $('<li/>', {
            class: 'privacy__list-item',
            append: $('<a/>', {
                class: 'privacy__link',
                text: currentItemText,
                href: '#privacy' + (index + 1)
            })
        }).appendTo('.js-privacy-nav');
    })
})