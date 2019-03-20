

const state = {
    columnsConfig: {
        'notification-templates': [
            {
                name: '',
                type: 'flag',
                is_sortable: false,
                align_text: 'left',
                width: 80,
                fixed: true,
                codename: 'checkbox',
                sort: 'none'
            },
            {
                name: '#',
                type: 'int',
                is_sortable: true,
                align_text: 'left',
                width: 100,
                fixed: true,
                codename: 'id',
                sort: {
                    direction: 'DESC',
                    order_by: 'id'
                }
            },
            {
                name: 'Шаблон',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 300,
                codename: 'name',
                isMain: true,
                sort: {
                    order_by: 'name'
                }
            },
            {
                name: 'Способ отправки',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 150,
                codename: 'channel_name',
                sort: {
                    order_by: 'channel_name'
                }
            },
            {
                name: 'Событие',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 300,
                codename: 'action_name',
                sort: {
                    order_by: 'action_name'
                }
            },
            {
                name: 'Комментарий',
                type: 'comment',
                is_sortable: false,
                align_text: 'center',
                width: 160,
                codename: 'comment',
                sort: {
                    order_by: 'comment'
                }
            },
            {
                name: 'Дата создания',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'create_date',
                sort: {
                    order_by: 'create_date'
                }
            },
            {
                name: 'Дата изменения',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'edit_date',
                sort: {
                    order_by: 'edit_date'
                }
            },
        ],
    },
    actionsConfig: {
        'notification-templates': {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
        }
    },
    filterConfig: {
        'notification-templates': [
            {
                filterTitle: 'Способы отправки',
                queryName: 'channel_id__in',
                viewValue: 'name',
                input_type: 'CheckboxList',
                api_route: 'channels',
                callbackValue: 'id',
                sortFlag: {
                    value: 'name',
                    direction: 'asc'
                },
            },
            {
                filterTitle: 'События',
                queryName: 'action_id__in',
                input_type: 'tagSelector',
                api_route: 'events',
                callbackValue: 'id',
                sortFlag: {
                    value: 'name',
                    direction: 'asc'
                },
            },
            {
                filterTitle: 'Роли',
                queryName: 'roles_id__in',
                input_type: 'tagSelector',
                api_route: 'user-roles',
                callbackValue: 'id',
                sortFlag: {
                    value: 'name',
                    direction: 'asc'
                },
            },
            {
                filterTitle: 'Пользователи',
                queryName: 'users_id__in',
                tagValue: 'full_name',
                input_type: 'tagSelector',
                api_route: 'users',
                callbackValue: 'id',
                entity_structure: [
                    {
                        flex: 1,
                        value: 'full_name'
                    },
                ],
                sortFlag: {
                    value: 'name',
                    direction: 'asc'
                },
            },
            {
                filterTitle: 'Получатели',
                queryName: 'recipients_id__in',
                input_type: 'tagSelector',
                api_route: 'recipients',
                callbackValue: 'id',
                sortFlag: {
                    value: 'name',
                    direction: 'asc'
                },
            },
            {
                filterTitle: 'Дата создания',
                queryName: {
                    min: 'create_date__gte',
                    max: 'create_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
            {
                filterTitle: 'Дата изменения',
                queryName: {
                    min: 'edit_date__gte',
                    max: 'edit_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
            {
                filterTitle: 'Состояния',
                queryName: 'is_active',
                input_type: 'radiobuttonsList',
                callbackValue: 'value',
                values: [
                    {
                        id: 2,
                        name: 'Все шаблоны',
                        value: '',
                        checked: true
                    },
                    {
                        id: 1,
                        name: 'Активные шаблоны',
                        value: 'true',
                        checked: false
                    },
                    {
                        id: 0,
                        name: 'Неактивные шаблоны',
                        value: 'false',
                        checked: false
                    },
                ]
            },
        ],
    },
};

export default {
    state
}