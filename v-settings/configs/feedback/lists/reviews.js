const state = {
    columnsConfig: {
        'reviews': [
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
                name: 'Место',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 200,
                codename: 'title',
                isMain: true,
                sort: {
                    order_by: 'title'
                }
            },
            {
                name: 'Отправитель',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 200,
                codename: 'name',
                sort: {
                    order_by: 'name'
                }
            },
            {
                name: 'Email',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 250,
                codename: 'email',
                sort: {
                    order_by: 'email'
                }
            },
            {
                name: 'Телефон',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 250,
                codename: 'phone',
                sort: {
                    order_by: 'phone'
                }
            },
            {
                name: 'Комментарий',
                type: 'comment',
                is_sortable: false,
                align_text: 'center',
                width: 160,
                codename: 'comment',
                sort: 'none'
            },
            {
                name: ' Дата создания',
                type: 'dateTime',
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
                type: 'dateTime',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'edit_date',
                sort: {
                    order_by: 'edit_date'
                }
            },
        ]
    },
    actionsConfig: {
        'reviews': {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
        }
    },
    filterConfig: {
        'reviews': [
            {
                filterTitle: 'Места',
                queryName: 'places__in',
                input_type: 'tagSelector',
                api_route: 'places',
                showValue: 'title',
                callbackValue: 'id',
                sortFlag: {
                    value: 'title',
                    direction: 'asc'
                },
            },
            {
                filterTitle: 'Дата отправки',
                minMaxCodename: 'create_date',
                queryName: {
                    min: 'create_date__gte',
                    max: 'create_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
        ]
    },
};

export default {
    state,
}