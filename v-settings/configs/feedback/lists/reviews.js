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
                name: 'Название места',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 200,
                codename: 'title',
                isMain: true,
                sort: {
                    order_by: 'name'
                }
            },
            {
                name: 'ФИО',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 200,
                codename: 'name',
                isMain: true,
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
                name: 'Номер телефона отправителя',
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
                name: ' Дата и время создания',
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
                name: 'Дата и время редактирования',
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
                viewValue: 'title',
                input_type: 'CheckboxList',
                callbackValue: 'id',
            },
            {
                filterTitle: 'Дата и время создания',
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