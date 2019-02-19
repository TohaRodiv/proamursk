

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
                                type: 'field',
                                label: 'Mailer Lite API Key',
                                required: true,
                                invalid: false,
                                height: 56,
                                width: 12,
                                codename: 'mailer_lite_api_key',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Профиль в Instagram',
                                required: true,
                                invalid: false,
                                height: 56,
                                width: 10,
                                codename: 'instagram',
                                widget: 'simpleInput',
                                hint: '',
                                placeholder: 'http(s)://'
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Профиль в Одноклассниках',
                                required: true,
                                invalid: false,
                                height: 56,
                                width: 10,
                                codename: 'odnoklassniki',
                                widget: 'simpleInput',
                                hint: '',
                                placeholder: 'http(s)://'
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Копирайт в подвале',
                                required: true,
                                invalid: false,
                                height: 56,
                                width: 12,
                                codename: 'copyright',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    }
                ]
            },
            {
                id: 2,
                title: 'СЧЕТЧИКИ И МЕТА-ТЕГИ',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Код счетчика Yandex',
                                required: false,
                                invalid: false,
                                height: 200,
                                width: 12,
                                codename: 'yandex_count',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Код счетчика Google',
                                required: false,
                                invalid: false,
                                height: 200,
                                width: 12,
                                codename: 'google_count',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Дополнительные мета-теги',
                                required: false,
                                invalid: false,
                                height: 200,
                                width: 12,
                                codename: 'meta_tags',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                ]
            },
            {
                id: 3,
                title: 'ROBOTS.TXT',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Содержимое файла robots.txt',
                                required: false,
                                invalid: false,
                                height: 200,
                                width: 12,
                                codename: 'robots',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                ]
            },
            {
                id: 4,
                title: 'РЕЖИМ РАЗРАБОТКИ',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Заголовок',
                                required: false,
                                invalid: false,
                                width: 12,
                                codename: 'disable_title',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                label: 'Текст сообщения',
                                required: false,
                                invalid: false,
                                widget: 'formatter',
                                codename: 'disable_text',
                                width: 12,
                                hint: ''
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Включить режим разработки (сайт будет недоступен, пользователи увидят заглушку)',
                                required: false,
                                codename: 'disable_site',
                                widget: 'singleCheckbox',
                                hint: ''
                            }
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