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
                name: 'ФИО',
                type: 'text',
                is_sortable: true,
                align_text: 'left',
                width: 200,
                codename: 'name',
                isMain: true,
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
                name: 'Номер телефона',
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
                name: ' Дата и время создания',
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
                input_type: 'CheckboxList',
                callbackValue: 'id',
                values: [
                    {
                        codename: 'news',
                        name: 'Новость',
                    },
                    {
                        codename: 'event',
                        name: 'Событие',
                    },
                    {
                        codename: 'history',
                        name: 'История',
                    },
                    {
                        codename: 'person',
                        name: 'Персона',
                    },
                    {
                        codename: 'error',
                        name: 'Отчёт об ошибке',
                    },
                    {
                        codename: 'question',
                        name: 'Вопрос',
                    },
                ]
            },
            {
                filterTitle: 'Дата и время создания',
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