const state = {
    columnsConfig: {
        'events': [
            {
                name: '',
                type: 'flag',
                is_sortable: false,
                align_text: 'left',
                width: 120,
                fixed: true,
                codename: 'checkbox',
                sort: 'none',
                menu: true,
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
                    order_by: 'id',
                },
            },
            {
                name: 'Название',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 230,
                codename: 'name',
                isMain: true,
                sort: {
                    order_by: 'name',
                },
            },
            {
                name: 'Кодовое имя',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'codename',
                sort: {
                    order_by: 'codename',
                },
            },
            {
                name: 'Комментарий',
                type: 'comment',
                is_sortable: false,
                align_text: 'center',
                width: 160,
                codename: 'comment',
                sort: {
                    order_by: 'comment',
                },
            },
            {
                name: 'Дата создания',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'create_date',
                sort: {
                    order_by: 'create_date',
                },
            },
            {
                name: 'Дата изменения',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'edit_date',
                sort: {
                    order_by: 'edit_date',
                },
            },
        ],
    },
    actionsConfig: {
        'events': {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
        },
    },
    filterConfig: {
        'events': [
            {
                filterTitle: 'Дата создания',
                queryName: {
                    min: 'create_date__gte',
                    max: 'create_date__lte',
                },
                input_type: 'toFromDate',
                type: 'date_time',
            },
            {
                filterTitle: 'Дата изменения',
                queryName: {
                    min: 'edit_date__gte',
                    max: 'edit_date__lte',
                },
                input_type: 'toFromDate',
                type: 'date_time',
            },
            {
                filterTitle: 'Состояния',
                queryName: 'is_active',
                input_type: 'radiobuttonsList',
                callbackValue: 'value',
                values: [
                    {
                        id: 2,
                        name: 'Все типы уведомлений',
                        value: '',
                        checked: true,
                    },
                    {
                        id: 1,
                        name: 'Активные типы уведомлений',
                        value: 'true',
                        checked: false,
                    },
                    {
                        id: 0,
                        name: 'Неактивные типы уведомлений',
                        value: 'false',
                        checked: false,
                    },
                ],
            },
        ],
    },
};

export default {
    state,
};