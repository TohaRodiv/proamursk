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
                                type: 'field',
                                label: 'Название',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'name',
                                widget: 'simpleInput',

                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'field',
                                label: 'Тип уведомлений',
                                expected_value: 'id',
                                required: true,
                                width: 8,
                                codename: 'action',
                                widget: 'singleSelector',
                                invalid: false,
                                api_route: 'actions',
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc',
                                },
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5,
                                    },
                                ],
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom30',
                        elements: [
                            {
                                type: 'field',
                                label: 'Способ отправки',
                                api_route: 'channels',
                                required: true,
                                width: 4,
                                widget: 'singleSelector',
                                invalid: false,
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc',
                                },
                                codename: 'channel',
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5,
                                    },
                                ],
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: ['marginBottom20', 'marginTop20',],
                        elements: [
                            {
                                type: 'field',
                                label: 'Тема письма',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'subject',
                                widget: 'simpleInput',
                                hint: '',
                                show: false,
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Содержание письма',
                                required: true,
                                invalid: false,
                                width: 12,
                                height: 400,
                                codename: 'text',
                                widget: 'textarea',
                                hint: '',
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
                                required: false,
                                invalid: false,
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'shortTag',
                                label: 'Пользователи с доступом в ПУ',
                                required: false,
                                width: 6,
                                codename: 'users',
                                callbackType: 'idArray',
                                widget: 'multipleSelector',
                                invalid: false,
                                api_route: 'users',
                                sortFlag: {
                                    value: 'full_name',
                                    direction: 'asc',
                                },
                                filter_results: {
                                    flag: 'is_staff',
                                    value: 'true',
                                },
                                view_structure: [
                                    {
                                        value: 'full_name',
                                        flex: .85,
                                    },
                                ],
                                hint: '',
                            },
                            {
                                type: 'shortTag',
                                label: 'Роли в ПУ',
                                required: false,
                                width: 6,
                                codename: 'roles',
                                callbackType: 'idArray',
                                widget: 'multipleSelector',
                                invalid: false,
                                api_route: 'user-roles',
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc',
                                },
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: .85,
                                    },
                                ],
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                type: 'shortTag',
                                label: 'Получатели уведомлений',
                                required: false,
                                width: 6,
                                codename: 'recipients',
                                callbackType: 'idArray',
                                widget: 'multipleSelector',
                                invalid: false,
                                api_route: 'recipients',
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc',
                                },
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: .85,
                                    },
                                ],
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'field',
                                label: 'Комментарий',
                                required: false,
                                invalid: false,
                                height: 80,
                                width: 12,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: '',
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
