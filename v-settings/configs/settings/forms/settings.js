const state = {
    formsOptions: {
        'settings': [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Mailer Lite API Key',
                                required: true,
                                width: 12,
                                codename: 'mailer_lite_api_key',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Редакция',
                                required: true,
                                width: 12,
                                codename: 'redaction_name',
                                widget: 'input',
                            },
                        ],
                    },

                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Адрес',
                                required: true,
                                width: 12,
                                codename: 'redaction_address',
                                widget: 'input',
                            },
                        ],
                    },

                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Телефон для общих вопросов',
                                required: true,
                                width: 4,
                                codename: 'redaction_phone',
                                widget: 'input',
                            },
                        ],
                    },

                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Email для общих вопросов',
                                required: true,
                                width: 6,
                                codename: 'redaction_email',
                                widget: 'input',
                            },
                        ],
                    },

                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Профиль в Instagram',
                                width: 10,
                                codename: 'instagram',
                                widget: 'input',
                                placeholder: 'http(s)://',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Профиль в Одноклассниках',
                                width: 10,
                                codename: 'odnoklassniki',
                                widget: 'input',
                                placeholder: 'http(s)://',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Копирайт в подвале',
                                required: true,
                                height: 80,
                                width: 12,
                                codename: 'copyright',
                                widget: 'textarea',
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                title: 'СЧЕТЧИКИ И МЕТА-ТЕГИ',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Код счетчика Yandex',
                                height: 200,
                                width: 12,
                                codename: 'yandex_count',
                                widget: 'textarea',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Код счетчика Google',
                                height: 200,
                                width: 12,
                                codename: 'google_count',
                                widget: 'textarea',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Дополнительные мета-теги',
                                height: 200,
                                width: 12,
                                codename: 'meta_tags',
                                widget: 'textarea',
                            },
                        ],
                    },
                ],
            },
            {
                id: 3,
                title: 'ROBOTS.TXT',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Содержимое файла robots.txt',
                                height: 200,
                                width: 12,
                                codename: 'robots',
                                widget: 'textarea',
                            },
                        ],
                    },
                ],
            },
            {
                id: 4,
                title: 'РЕЖИМ РАЗРАБОТКИ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Заголовок',
                                width: 12,
                                codename: 'disable_title',
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
                                label: 'Текст сообщения',
                                widget: 'formatter',
                                codename: 'disable_text',
                                width: 12,
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                name: 'Включить режим разработки (сайт будет недоступен, пользователи увидят заглушку)',
                                label: '',
                                codename: 'disable_site',
                                widget: 'singleCheckbox',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    actionsConfig: {
        settings: {
            addButton: false,
            activationButtons: false,
            deleteButton: false,
            duplicateButton: false,
        },
    },
};

export default {
    state,
};