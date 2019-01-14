

const state = {
    columnsConfig: {
        'operation-log': [
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
                name: 'Дата операции',
                type: 'date',
                is_sortable: true,
                align_text: 'left',
                width: 180,
                codename: 'action_time',
                sort: {
                    order_by: 'action_time'
                }
            },
            {
                name: 'Тип операции',
                type: 'operation_type',
                value_name: 'action_type',
                is_sortable: false,
                align_text: 'left',
                width: 120,
                codename: 'action_type_name',
                sort: {
                    order_by: 'action_type_name'
                }
            },
            {
                name: 'Пользователь',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 190,
                codename: 'user_full_name',
                sort: {
                    order_by: 'user_full_name'
                }
            },
            {
                name: 'Сущность',
                type: 'text',
                is_sortable: false,
                fixed: true,
                align_text: 'left',
                width: 300,
                codename: 'content_type_name',
                sort: {
                    order_by: 'content_type_name'
                }
            },
            {
                name: 'ID записи',
                type: 'int',
                is_sortable: true,
                align_text: 'left',
                width: 70,
                codename: 'object_id',
                sort: {
                    order_by: 'object_id'
                }
            },
            {
                name: 'Запись',
                type: 'text',
                is_sortable: false,
                align_text: 'left',
                width: 250,
                codename: 'object_name',
                sort: {
                    order_by: 'object_name'
                }
            },
        ],
    },
    actionsConfig: {
        'operation-log': {
            addButton: false,
            activationButtons: false,
            deleteButton: false,
        }
    },
    filterConfig: {
        'operation-log': [
            {
                filterTitle: 'Дата операции',
                minMaxCodename: 'action_time',
                queryName: {
                    min: 'action_time__gte',
                    max: 'action_time__lte'
                },
                input_type: 'toFromDate',
                type: 'date_time'
            },
            {
                filterTitle: 'Типы операций',
                queryName: 'action_type__in',
                viewValue: 'name',
                input_type: 'CheckboxList',
                callbackValue: 'id',
                values: [
                    {
                        codename: 'add',
                        name: 'Добавление',
                    },
                    {
                        codename: 'change',
                        name: 'Редактирование',
                    },
                    {
                        codename: 'delete',
                        name: 'Удаление',
                    },
                ]
            },
            {
                filterTitle: 'Пользователи',
                queryName: 'user_id__in',
                input_type: 'tagSelector',
                api_route: 'users',
                callbackValue: 'id',
                tagValue: 'full_name',
                entity_structure: [
                    {
                        flex: 1,
                        value: 'full_name'
                    },
                ],
                sortFlag: {
                    value: 'name',
                    direction: 'asc'
                },
            },
            {
                filterTitle: 'Сущности',
                queryName: 'content_type_id__in',
                input_type: 'tagSelector',
                api_route: 'content-types',
                viewValue: 'name',
                callbackValue: 'id',
                sortFlag: {
                    disabled: true,
                },
            },
            {
                filterTitle: 'ID записей',
                queryName: 'object_id',
                input_type: 'input',
            },
        ],
    },
};

export default {
    state
}