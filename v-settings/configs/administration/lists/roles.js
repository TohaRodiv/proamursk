const state = {
    columnsConfig: {
        'user-roles': [
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
                name: 'Название роли',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 160,
                codename: 'name',
                isMain: true,
                sort: {
                    order_by: 'name',
                },
            },
            {
                name: 'Кол-во пользователей',
                type: 'int',
                is_sortable: true,
                align_text: 'left',
                width: 165,
                fixed: true,
                codename: 'users_amount',
                isMain: false,
                sort: {
                    order_by: 'users_amount',
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
        'user-roles': {
            addButton: true,
            activationButtons: false,
            deleteButton: true,
            duplicateButton: true,
        },
    },
    filterConfig: {
        'user-roles': [
            {
                filterTitle: 'Дата регистрации',
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
        ],
    },
};

export default {
    state,
};