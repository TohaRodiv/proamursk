

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
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Название',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'name',
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
                                type: 'field',
                                label: 'Событие',
                                expected_value: 'id',
                                required: true,
                                width: 8,
                                codename: 'action',
                                widget: 'singleSelector',
                                invalid: false,
                                api_route: 'events',
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc'
                                },
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5,
                                    },
                                ],
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom28',
                        elements: [
                            {
                                type: 'field',
                                controlFlag: [  /*Данный виджет способен управлять этими флагами*/
                                    {
                                        toBeChecked: 'codename',   /*На какое значение в массиве выбранных сущностей смотреть*/
                                        value: 'email',            /*Каким должно быть значение*/
                                        flag: 'isEmail'                /*Какой флаг тригеррит*/
                                    },
                                    {
                                        toBeChecked: 'codename',
                                        value: 'sms',
                                        flag: 'isSms'
                                    },
                                ],
                                label: 'Способ отправки',
                                api_route: 'channels',
                                required: true,
                                width: 4,
                                widget: 'singleSelector',
                                invalid: false,
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc'
                                },
                                codename: 'channel',
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5,
                                    },
                                ],
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: ['marginBottom22', 'marginTop22'],
                        renderFlag: 'isEmail',
                        elements: [
                            {
                                type: 'field',
                                label: 'Тема письма',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'subject',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        renderFlag: 'isEmail',
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
                                hint_meta_fields: {                                                                     /*По всем вопросам смотри алтан-шину: notificationTemplates*/
                                    hint_type: 'tags&vars',
                                    renderTrigger: 'isEmail',
                                    hint_api: 'events',
                                    hint_id: 'action',
                                    hint_value_container: 'variables',
                                    hint_value: 'variable',
                                    mustaches: {
                                        otag: '{{',
                                        ctag: '}}'
                                    },
                                    universalTags: {
                                        link: true,
                                        email: true,
                                        button: true,
                                        html_template: false,
                                        separator: true,
                                    },
                                },
                                hint: 'sad'
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginTop22',
                        renderFlag: 'isSms',
                        elements: [
                            {
                                type: 'field',
                                label: 'Текст сообщения',
                                required: true,
                                invalid: false,
                                width: 12,
                                height: 60,
                                codename: 'text',
                                widget: 'textarea',
                                hint_meta_fields: {                                                                     /*По всем вопросам смотри алтан-шину: notificationTemplates*/
                                    hint_type: 'tags&vars',
                                    hint_api: 'events',
                                    renderTrigger: 'isSms',
                                    hint_id: 'action',
                                    hint_value_container: 'variables',
                                    hint_value: 'variable',
                                    mustaches: {
                                        otag: '{{',
                                        ctag: '}}'
                                    }
                                },
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: ['marginBottom30', 'marginTop50'],
                        hasWideLabel: true,
                        elements: [
                            {
                                type: 'header',
                                label: 'Кто будет получать уведомления?',
                                size: 'first',
                                required: false,
                                invalid: false,
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        modClass: 'marginBottom18',
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
                                    direction: 'asc'
                                },
                                filter_results: {
                                    flag: 'is_staff',
                                    value: 'true'
                                },
                                view_structure: [
                                    {
                                        value: 'full_name',
                                        flex: .85,
                                    },
                                ],
                                hint: ''
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
                                    direction: 'asc'
                                },
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: .85,
                                    },
                                ],
                                hint: ''
                            },
                        ]
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
                                    direction: 'asc'
                                },
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: .85,
                                    },
                                ],
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
                                label: 'Комментарий',
                                required: false,
                                invalid: false,
                                height: 70,
                                width: 12,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                ]
            },
        ],
    },
    activeFlag: {
        'notification-templates': {
            title: 'Активный шаблон',
            hint: 'Неактивные шаблоны игнорируются и уведомления не отправляются',
        }
    },
};

export default {
    state
}