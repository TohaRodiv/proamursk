const state = {
    formsOptions: {
        'static-page-settings': [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Название страницы',
                                required: true,
                                width: 6,
                                codename: 'name',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                label: 'Кодовое название страницы',
                                required: true,
                                width: 6,
                                codename: 'codename',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'JSON конфиг формы<br>страницы',
                                codename: 'admin_form_config',
                                widget: 'textareaJson',
                                required: true,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    
};

export default {
    state,
};