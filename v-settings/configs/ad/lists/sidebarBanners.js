const state = {
    columnsConfig: {
        'sidebar-banners': [
            {
                name: '',
                type: 'flag',
                is_sortable: false,
                align_text: 'left',
                width: 60,
                fixed: true,
                codename: 'checkbox',
                sort: 'none'
            },
            {
                name: '',
                type: 'image',
                is_sortable: false,
                align_text: 'center',
                width: 60,
                fixed: true,
                codename: 'cover.min_crop_url',
                sort: 'none'
            },
            {
                name: '#',
                type: 'int',
                is_sortable: true,
                align_text: 'center',
                width: 100,
                fixed: true,
                codename: 'id',
                sort: {
                    direction: 'DESC',
                    order_by: 'id'
                }
            },
            {
                name: 'Название',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 300,
                codename: 'title',
                isMain: true,
                sort: {
                    order_by: 'title'
                }
            },
            {
                name: 'Ссылка',
                type: 'link',
                is_sortable: false,
                align_text: 'left',
                width: 300,
                codename: 'link',
                sort: 'none'
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
                name: 'Дата начала публикации',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 240,
                codename: 'start_publication_date',
                sort: {
                    order_by: 'start_publication_date'
                }
            },
            {
                name: 'Дата окончания публикации',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 240,
                codename: 'end_publication_date',
                sort: {
                    order_by: 'end_publication_date'
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
        ]
    },
    actionsConfig: {
        'sidebar-banners': {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
        }
    },
    filterConfig: {
        'sidebar-banners': [
            {
                filterTitle: 'Дата начала публикации',
                minMaxCodename: 'start_publication_date',
                queryName: {
                    min: 'start_publication_date__gte',
                    max: 'start_publication_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
            {
                filterTitle: 'Дата окончания публикации',
                minMaxCodename: 'end_publication_date',
                queryName: {
                    min: 'end_publication_date__gte',
                    max: 'end_publication_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
            {
                filterTitle: 'Дата создания',
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
                        name: 'Все баннеры',
                        value: '',
                        checked: true
                    },
                    {
                        id: 1,
                        name: 'Активные баннеры',
                        value: 'true',
                        checked: false
                    },
                    {
                        id: 0,
                        name: 'Неактивные баннеры',
                        value: 'false',
                        checked: false
                    }
                ]
            }
        ]
    },
};

export default {
    state
}