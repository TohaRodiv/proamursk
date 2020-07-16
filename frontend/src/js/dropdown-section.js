$('.js-dropdown-section_show').click(function () {
    var currentDropdownBlock = $(this).parents('.dropdown-section'),
        currentDropdownBlockContent = currentDropdownBlock.find('.sp-dropdown-section__dropdown-content');

    currentDropdownBlockContent.removeClass('hidden');
    $(this).addClass('hidden');
});

$('.js-dropdown-section_hide').click(function () {
    var currentDropdownBlock = $(this).parents('.dropdown-section'),
        currentDropdownBlockShowBtn = currentDropdownBlock.find('.js-dropdown-section_show'),
        currentDropdownBlockContent = currentDropdownBlock.find('.sp-dropdown-section__dropdown-content');

    currentDropdownBlockContent.addClass('hidden');
    currentDropdownBlockShowBtn.removeClass('hidden');
});

const dropdownBtns = [...document.querySelectorAll('.js-dropdown-btn')];
if (dropdownBtns.length) {
    dropdownBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const dropdownBlock = btn.parentNode;
            const dropdownContent = dropdownBlock.querySelector('.js-dropdown-content');

            dropdownContent.classList.toggle('visible');
        });
    });
}