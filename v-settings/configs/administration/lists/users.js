const state = {
    columnsConfig: {
        users: [
            {
                name: '',
                type: 'flag',
                is_sortable: false,
                align_text: 'left',
                width: 100,
                fixed: true,
                codename: 'checkbox',
                sort: 'none',
                menu: true
            },
            {
                name: '',
                type: 'image',
                is_sortable: false,
                align_text: 'left',
                width: 120,
                fixed: true,
                codename: 'avatar.min_crop_url',
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
                name: 'ФИО',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 240,
                codename: 'full_name',
                isMain: true,
                sort: {
                    order_by: 'full_name'
                }
            },
            {
                name: 'Email / Логин',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'username',
                sort: {
                    order_by: 'username'
                }
            },
            {
                name: 'Роли',
                type: 'icon-score',
                is_sortable: false,
                align_text: 'center',
                width: 100,
                codename: 'roles',
                sort: {
                    order_by: 'roles'
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
                name: 'Дата регистрации',
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
        ]
    },
    actionsConfig: {
        users: {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
        }
    },
    filterConfig: {
        users: [
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
                filterTitle: 'Дата регистрации',
                minMaxCodename: 'create_date',
                queryName: {
                    min: 'create_date__gte',
                    max: 'create_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
            {
                filterTitle: 'Дата изменения',
                minMaxCodename: 'edit_date',
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
                        name: 'Все пользователи',
                        value: '',
                        checked: true
                    },
                    {
                        id: 1,
                        name: 'Активные пользователи',
                        value: 'true',
                        checked: false
                    },
                    {
                        id: 0,
                        name: 'Неактивные пользователи',
                        value: 'false',
                        checked: false
                    },
                ]
            },
        ]
    },
};

export default {
    state
}