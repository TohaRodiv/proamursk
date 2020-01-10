const state = {
    columnsConfig: {
        compilation: [
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
                width: 160,
                codename: 'name',
                isMain: true,
                sort: {
                    order_by: 'name',
                },
            },
            {
                name: 'Ссылка',
                type: 'link',
                is_sortable: false,
                align_text: 'left',
                width: 120,
                codename: 'site_url',
                sort: 'none',
            },
            {
                name: 'Кол-во материалов',
                type: 'int',
                is_sortable: true,
                align_text: 'right',
                width: 120,
                codename: 'amount',
                sort: {
                    order_by: 'amount',
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
        compilation: {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
            duplicateButton: true,
        },
    },
    filterConfig: {
        compilation: [
            {
                filterTitle: 'Кол-во материалов',
                minMaxCodename: 'amount',
                queryName: {
                    min: 'amount__gte',
                    max: 'amount__lte',
                },
                input_type: 'toFromInteger',
            },
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
                filterTitle: 'Состояние',
                queryName: 'is_active',
                input_type: 'radiobuttonsList',
                callbackValue: 'value',
                values: [
                    {
                        id: 2,
                        name: 'Все записи',
                        value: '',
                        checked: true,
                    },
                    {
                        id: 1,
                        name: 'Активные записи',
                        value: 'true',
                        checked: false,
                    },
                    {
                        id: 0,
                        name: 'Неактивные записи',
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