const state = {
    columnsConfig: {
        'news': [
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
                width: 60,
                fixed: true,
                codename: 'id',
                sort: {
                    direction: 'DESC',
                    order_by: 'id'
                }
            },
            {
                name: 'Заголовок',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 240,
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
                width: 120,
                codename: 'site_url',
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
                name: 'Дата публикации',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'publication_date',
                sort: {
                    order_by: 'publication_date'
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
        'news': {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
        }
    },
    additionalListInterfaces: {},
    filterConfig: {
        'news': [
            {
                filterTitle: 'Дата публикации',
                minMaxCodename: 'publication_date',
                queryName: {
                    min: 'publication_date__gte',
                    max: 'publication_date__lte'
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
                filterTitle: 'Дата редактирования',
                minMaxCodename: 'edit_date',
                queryName: {
                    min: 'edit_date__gte',
                    max: 'edit_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
            {
                filterTitle: 'Состояние',
                queryName: 'is_active',
                input_type: 'radiobuttonsList',
                callbackValue: 'value',
                values: [
                    {
                        id: 2,
                        name: 'Все новости',
                        value: '',
                        checked: true
                    },
                    {
                        id: 1,
                        name: 'Активные новости',
                        value: 'true',
                        checked: false
                    },
                    {
                        id: 0,
                        name: 'Неактивные новости',
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