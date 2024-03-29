const state = {
    columnsConfig: {
        'static-page-settings': [
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
                type: 'int',
                is_sortable: true,
                align_text: 'left',
                width: 250,
                isMain: true,
                codename: 'name',
                sort: {
                    order_by: 'name',
                },
            },
            {
                name: 'Кодовое название',
                type: 'int',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'codename',
                sort: {
                    order_by: 'codename',
                },
            },
            {
                name: 'Ссылка',
                type: 'link',
                is_sortable: false,
                align_text: 'left',
                width: 230,
                codename: 'site_url',
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
        'static-page-settings': {
            addButton: true,
            activationButtons: false,
            deleteButton: true,
            duplicateButton: true,
        },
    },
    filterConfig: {
        'static-page-settings': [
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
        ],
    },
};

export default {
    state,
};