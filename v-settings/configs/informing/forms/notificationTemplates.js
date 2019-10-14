const state = {
    formsOptions: {
        'notification-templates': [
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
                                label: 'Название',
                                required: true,
                                width: 12,
                                codename: 'name',
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
                                label: 'Тип уведомлений',
                                required: true,
                                width: 8,
                                codename: 'action',
                                widget: 'select',
                                api: 'actions',
                                params: {
                                    order_by: 'name',
                                },
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom30',
                        elements: [
                            {
                                label: 'Способ отправки',
                                required: true,
                                width: 4,
                                codename: 'channel',
                                widget: 'select',
                                api: 'channels',
                                params: {
                                    order_by: 'name',
                                },
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: ['marginBottom20', 'marginTop20',],
                        elements: [
                            {
                                label: 'Тема письма',
                                required: true,
                                width: 12,
                                codename: 'subject',
                                widget: 'input',
                                show: false,
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Содержание письма',
                                required: true,
                                width: 12,
                                height: 400,
                                codename: 'text',
                                widget: 'textarea',
                                show: false,
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: ['marginBottom30', 'marginTop50',],
                        hasWideLabel: true,
                        elements: [
                            {
                                type: 'header',
                                label: 'Кто будет получать уведомления?',
                                size: 'first',
                            },
                        ],
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                widget: 'select',
                                multi: true,
                                label: 'Пользователи с доступом в ПУ',
                                width: 6,
                                codename: 'users',
                                api: 'users',
                                params: {
                                    order_by: 'full_name',
                                    is_staff: 'true',
                                },
                                tags: 'short',
                                template: 'full_name',
                            },
                            {
                                widget: 'select',
                                multi: true,
                                label: 'Роли в ПУ',
                                width: 6,
                                codename: 'roles',
                                api: 'user-roles',
                                params: {
                                    order_by: 'name',
                                },
                                tags: 'short',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                widget: 'select',
                                multi: true,
                                label: 'Получатели уведомлений',
                                width: 6,
                                codename: 'recipients',
                                api: 'recipients',
                                params: {
                                    order_by: 'name',
                                    channel_id__in: '',
                                },
                                tags: 'short',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Комментарий',
                                height: 80,
                                width: 12,
                                codename: 'comment',
                                widget: 'textarea',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        'notification-templates': {
            title: 'Активный шаблон',
            hint: 'Неактивные шаблоны игнорируются и уведомления не отправляются',
        },
    },
};

export default {
    state,
};
