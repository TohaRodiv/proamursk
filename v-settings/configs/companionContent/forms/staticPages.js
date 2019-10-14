const state = {
    formsOptions: {
        'static-pages': [
            {
                id: 98,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Название страницы',
                                width: 12,
                                codename: 'name',
                                widget: 'input',
                                blocked: true,
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Кодовое название',
                                width: 4,
                                codename: 'codename',
                                widget: 'input',
                                blocked: true,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    additionalFormsInterface: {
        'static-pages': {
            isDynamicForm: 'static-page-settings',
        },
    },
};

export default {
    state,
};
