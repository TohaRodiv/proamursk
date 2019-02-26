

const state = {
    columnsConfig: {
        'recipients': [
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
                name: 'Получатель',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 250,
                codename: 'name',
                sort: {
                    order_by: 'name'
                }
            },
            {
                name: 'Способ отправки',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 120,
                fixed: true,
                codename: 'channel_name',
                sort: {
                    order_by: 'channel_name'
                }
            },
            {
                name: 'Телефон',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 150,
                fixed: true,
                codename: 'phone',
                sort: {
                    order_by: 'phone'
                }
            },
            {
                name: 'Email',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 250,
                codename: 'email',
                sort: {
                    order_by: 'email'
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
        'recipients': {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
        }
    },
    filterConfig: {
        'recipients': [
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
                        name: 'Все получатели',
                        value: '',
                        checked: true
                    },
                    {
                        id: 1,
                        name: 'Активные получатели',
                        value: 'true',
                        checked: false
                    },
                    {
                        id: 0,
                        name: 'Неактивные получатели',
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