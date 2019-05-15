

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
                                invalid: false,
                                width: 6,
                                codename: 'name',
                                widget: 'simpleInput',

                                hint: ''
                            },
                        ]
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
                                invalid: false,
                                width: 6,
                                codename: 'codename',
                                widget: 'simpleInput',

                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'json',
                                label: 'JSON конфиг формы страницы',
                                showValidIcon: true,
                                required: false,
                                invalid: false,
                                width: 12,
                                height: 600,
                                codename: 'admin_form_config',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                ]
            },
        ],
    },
};

export default {
    state
}