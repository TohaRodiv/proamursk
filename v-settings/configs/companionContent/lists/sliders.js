const state = {
    columnsConfig: {
        'sliders': [
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
                name: 'Заголовок',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 300,
                codename: 'title',
                isMain: true,
                sort: {
                    order_by: 'title',
                },
            },
            {
                name: 'Формат слайдера',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 200,
                codename: 'format_name',
                sort: 'none',
            },
            {
                name: 'Кол-во слайдов',
                type: 'int',
                is_sortable: false,
                align_text: 'right',
                width: 120,
                codename: 'slides_count',
                sort: {
                    order_by: 'slides_count',
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
        'sliders': {
            addButton: true,
            activationButtons: false,
            deleteButton: true,
            duplicateButton: true,
        },
    },

    filterConfig: {
        'sliders': [
            {
                filterTitle: 'Формат слайдера',
                queryName: 'formats__in',
                viewValue: 'name',
                input_type: 'CheckboxList',
                callbackValue: 'codename',
                values: [
                    {
                        codename: 'format_3x2',
                        name: 'Горизонтальный / 3:2',
                    },
                    {
                        codename: 'format_2x1',
                        name: 'Горизонтальный / 2:1',
                    },
                ],
            },
            {
                filterTitle: 'Количество слайдов',
                minMaxCodename: 'slides_count',
                queryName: {
                    min: 'slides_count__lte',
                    max: 'slides_count__gte',
                },
                input_type: 'toFromInteger',
                type: 'int',
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
        ],
    },
};

export default {
    state,
};