const accordionBtns = [...document.querySelectorAll('.js-accordion-btn')];

if (accordionBtns.length) {
    accordionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentAccordion = btn.closest('.js-accordion');
            const activeAccordionBtn = currentAccordion.querySelector('.js-accordion-btn.active');
            const activeAccordionContent = currentAccordion.querySelector('.js-accordion-content.active');
            const currentAccordionContent = btn.nextElementSibling;
            if (currentAccordionContent.classList.contains('active')) {
                btn.classList.remove('active');
                currentAccordionContent.classList.remove('active');
            }
            else {
                activeAccordionContent && activeAccordionContent.classList.remove('active');
                currentAccordionContent.classList.add('active');
                activeAccordionBtn && activeAccordionBtn.classList.remove('active');
                btn.classList.add('active');
            }
        });
    });
}