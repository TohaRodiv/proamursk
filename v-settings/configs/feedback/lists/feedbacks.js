const state = {
    columnsConfig: {
        'feedbacks': [
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
                name: 'Тема обращения',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 200,
                codename: 'subjects',
                isMain: true,
                sort: 'none'
            },
            {
                name: 'Отправитель',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 200,
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
                width: 250,
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
                width: 250,
                codename: 'phone',
                sort: {
                    order_by: 'phone'
                }
            },
            {
                name: 'Прикреплённый файл',
                type: 'link',
                is_sortable: true,
                align_text: 'left',
                width: 250,
                codename: 'attachment',
                customName: 'original_name',
                sort: {
                    order_by: 'attachment'
                }
            },
            {
                name: ' Дата создания',
                type: 'dateTime',
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
                        name: 'Поделиться событием'
                    },
                    {
                        id: 'history',
                        name: 'Поделиться своей историей'
                    },
                    {
                        id: 'person',
                        name: 'Предложить героя'
                    },
                    {
                        id: 'question',
                        name: 'Задать вопрос'
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