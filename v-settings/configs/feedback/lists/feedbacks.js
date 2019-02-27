const state = {
    columnsConfig: {
        'feedbacks': [
            {
                name: '#',
                type: 'int',
                is_sortable: true,
                align_text: 'left',
                width: 60,
                fixed: true,
                codename: 'id',
                sort: {
                    direction: 'DESC',
                    order_by: 'id'
                }
            },
            {
                name: 'Тема обращения',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 260,
                codename: 'subject_name',
                isMain: true,
                sort: 'none'
            },
            {
                name: 'Отправитель',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 240,
                codename: 'name',
                sort: {
                    order_by: 'name'
                }
            },
            {
                name: 'Email',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 240,
                codename: 'email',
                sort: {
                    order_by: 'email'
                }
            },
            {
                name: 'Телефон',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 140,
                codename: 'phone',
                sort: {
                    order_by: 'phone'
                }
            },
            {
                name: 'Прикреплённые файлы',
                type: 'icon-score',
                is_sortable: false,
                align_text: 'center',
                width: 200,
                codename: 'attachments',
                sort: 'none'
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
        ]
    },
    actionsConfig: {
        'feedbacks': {
            addButton: false,
            activationButtons: false,
            deleteButton: false,
        }
    },
    filterConfig: {
        'feedbacks': [
            {
                filterTitle: 'Темы обращения',
                queryName: 'subjects__in',
                viewValue: 'name',
                input_type: 'tagSelector',
                callbackValue: 'codename',
                tagValue: 'name',
                values: [
                    {
                        id: 'news',
                        name: 'Поделиться хорошей новостью'
                    },
                    {
                        id: 'event',
                        name: 'Рассказать о событии'
                    },
                    {
                        id: 'history',
                        name: 'Поведать историю'
                    },
                    {
                        id: 'person',
                        name: 'Рассказать о герое'
                    },
                    {
                        id: 'place',
                        name: 'Оставить отзыв о месте'
                    },
                    {
                        id: 'error',
                        name: 'Рассказать об ошибке'
                    },
                ],
                entity_structure: [
                    {
                        value: 'name'
                    }
                ]
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
        ]
    },
};

export default {
    state,
}