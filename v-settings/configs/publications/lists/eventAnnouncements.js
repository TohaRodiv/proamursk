const state = {
    columnsConfig: {
        'event-announcements': [
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
                width: 200,
                codename: 'title',
                isMain: true,
                sort: {
                    order_by: 'title'
                }
            },
            {
                name: 'Место проведения',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 160,
                codename: 'place',
                sort: {
                    order_by: 'place'
                }
            },
            {
                name: 'Дата проведения',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 160,
                codename: 'event_date_text',
                sort: {
                    order_by: 'event_date_text'
                }
            },
            {
                name: 'Репортаж',
                type: 'link',
                is_sortable: false,
                align_text: 'left',
                width: 120,
                codename: 'report.site_url',
                sort: 'none'
            },
            {
                name: 'Формат обложки',
                type: 'text',
                is_sortable: false,
                align_text: 'center',
                width: 100,
                codename: 'cover_format_name',
                sort: 'none'
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
        'event-announcements': {
            addButton: true,
            activationButtons: true,
            deleteButton: true,
        }
    },
    filterConfig: {
        'event-announcements': [
            {
                filterTitle: 'Дата начала события',
                minMaxCodename: 'start_event_date',
                queryName: {
                    min: 'start_event_date__gte',
                    max: 'start_event_date__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
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
                ]
            },
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
                        name: 'Все анонсы событий',
                        value: '',
                        checked: true
                    },
                    {
                        id: 1,
                        name: 'Активные анонсы событий',
                        value: 'true',
                        checked: false
                    },
                    {
                        id: 0,
                        name: 'Неактивные анонсы событий',
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