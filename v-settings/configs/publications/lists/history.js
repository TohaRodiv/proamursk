const state = {
    columnsConfig: {
        'history': [
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
                name: '',
                type: 'image',
                is_sortable: false,
                align_text: 'left',
                width: 100,
                fixed: true,
                codename: 'cover.min_crop_url',
                sort: 'none',
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
                name: 'Рубрика',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 240,
                codename: 'rubric',
                sort: 'none',
            },
            {
                name: 'Формат обложки',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 200,
                codename: 'cover_format_name',
                sort: 'none',
            },
            {
                type: 'bool',
                codename: 'hide_cover',
                is_sortable: false,
                sort: {},
                align_text: 'center',
                name: 'Скрытая обл. на моб.',
                width: 150,
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
                name: 'Комментарий',
                type: 'comment',
                is_sortable: false,
                align_text: 'center',
                width: 160,
                codename: 'comment',
                sort: 'none',
            },
            {
                name: 'Дата публикации',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'publication_date',
                sort: {
                    order_by: 'publication_date',
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
        'history': {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
            duplicateButton: true,
        },
    },
    filterConfig: {
        'history': [
            {
                filterTitle: 'Рубрики',
                queryName: 'rubrics_id__in',
                input_type: 'tagSelector',
                api_route: 'history-rubrics',
                callbackValue: 'id',
                sortFlag: {
                    value: 'name',
                    direction: 'asc',
                },
                entity_structure: [
                    {
                        value: 'name',
                    },
                ],
            },
            {
                filterTitle: 'Форматы обложек',
                queryName: 'cover_formats__in',
                viewValue: 'name',
                input_type: 'CheckboxList',
                callbackValue: 'name',
                values: [
                    {
                        codename: 'small',
                        name: 'Обычная обложка',
                    },
                    {
                        codename: 'full',
                        name: 'Полноразмерная обложка',
                    },
                ],
            },
            {
                filterTitle: 'Скрытая обл. на моб.',
                queryName: 'hide_cover',
                input_type: 'radiobuttonsList',
                callbackValue: 'value',
                values: [
                    {
                        id: 2,
                        name: 'Все статьи',
                        value: '',
                        checked: true,
                    },
                    {
                        id: 1,
                        name: 'Только с обложкой',
                        value: 'false',
                        checked: false,
                    },
                    {
                        id: 0,
                        name: 'Только без обложки',
                        value: 'true',
                        checked: false,
                    },
                ],
            },
            {
                filterTitle: 'Дата публикации',
                minMaxCodename: 'publication_date',
                queryName: {
                    min: 'publication_date__gte',
                    max: 'publication_date__lte',
                },
                input_type: 'toFromDate',
                type: 'date_time',
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
                        name: 'Все статьи',
                        value: '',
                        checked: true,
                    },
                    {
                        id: 1,
                        name: 'Активные статьи',
                        value: 'true',
                        checked: false,
                    },
                    {
                        id: 0,
                        name: 'Неактивные статьи',
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