const state = {
    columnsConfig: {
        subscribers: [
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
                name: 'Email',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 250,
                codename: 'email',
                isMain: true,
                sort: {
                    order_by: 'email',
                },
            },
            {
                name: 'MailerLite ID',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 200,
                codename: 'mailerlite_id',
                sort: {
                    order_by: 'title',
                },
            },
            {
                name: 'Комментарий',
                type: 'comment',
                is_sortable: false,
                align_text: 'center',
                width: 160,
                codename: 'comment',
                sort: 'none',
            },
            {
                name: ' Дата создания',
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
        subscribers: {
            addButton: true,
            activationButtons: true,
            deleteButton: false,
            duplicateButton: true,
        },
    },
    filterConfig: {
        subscribers: [
            {
                filterTitle: 'Дата создания',
                minMaxCodename: 'create_date',
                queryName: {
                    min: 'create_date__gte',
                    max: 'create_date__lte',
                },
                input_type: 'toFromDate',
                type: 'date_time',
            },
            {
                filterTitle: 'Дата изменения',
                minMaxCodename: 'edit_date',
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
                        name: 'Все подписчики',
                        value: '',
                        checked: true,
                    },
                    {
                        id: 1,
                        name: 'Активные подписчики',
                        value: 'true',
                        checked: false,
                    },
                    {
                        id: 0,
                        name: 'Неактивные подписчики',
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