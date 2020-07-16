const tablesToggleClickableTd = [...document.querySelectorAll('.js-table-toggle td:first-child, .js-table-toggle td:nth-child(2)')];

if (tablesToggleClickableTd.length) {
    tablesToggleClickableTd.forEach(td => {
        td.addEventListener('click', () => {
            let parentTr = td.parentNode;
            let thirdTd = parentTr.querySelector('td:nth-child(3)');
            let fourthTd = parentTr.querySelector('td:nth-child(4)');

            parentTr.classList.toggle('open');
            if (thirdTd) thirdTd.classList.toggle('visible');
            if (fourthTd) fourthTd.classList.toggle('visible');
        });
    });
}