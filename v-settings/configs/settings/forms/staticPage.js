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
                                type: 'field',
                                label: 'Название страницы',
                                required: true,
                                width: 6,
                                codename: 'name',
                                widget: 'simpleInput',
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom40',
                        elements: [
                            {
                                type: 'field',
                                label: 'Кодовое название страницы',
                                required: true,
                                width: 6,
                                codename: 'codename',
                                widget: 'simpleInput',
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
                                hint: {
                                    text: 'Очень длинная подсказка, чтобы проверить, будет ли резаться строка, или она уйдёт под сайдбар',
                                    styles: {
                                        marginBottom: 'auto',
                                    },
                                },
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