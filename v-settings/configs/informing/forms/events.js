

const state = {
    formsOptions: {
        'events': [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Название',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'name',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom41',
                        elements: [
                            {
                                type: 'field',
                                label: 'Кодовое название',
                                required: true,
                                invalid: false,
                                width: 4,
                                codename: 'codename',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        hasWideLabel: true,
                        elements: [
                            {
                                type: 'field',
                                label: 'Переменные и теги',
                                popupLabels: {
                                    new: 'Переменные и теги',
                                    existing: 'Переменные и теги',
                                },
                                dragOrder: 'weight',
                                required: false,
                                invalid: false,
                                isDraggable: true,
                                codename: 'variables',
                                widget: 'childEntity',
                                api_route: 'product-cards',
                                modClass: 'marginBottom40',
                                requireSendId: true,
                                hint: '',
                                entity_structure: [
                                    {
                                        type: 'tags&vars',
                                        // isNested: 'variables',
                                        typeVar: 'construction_type',
                                        valueVar: 'content_type',
                                        mustaches: {                                                                    /*Просто так в шаблоне нельзя применять скобки в скобках*/
                                            otag: '{{',
                                            ctag: '}}'
                                        }
                                    }
                                ],
                                popup_structure: [
                                    {
                                        id: 1,
                                        label: 'Свойство товара',
                                        clearFlags: ['isVar'],
                                        blocks: [
                                            {
                                                labelPosition: 'left',
                                                direction: 'row',
                                                modClass: 'marginBottom22',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Название',
                                                        required: true,
                                                        invalid: false,
                                                        width: 8,
                                                        codename: 'name',
                                                        widget: 'simpleInput',
                                                        hint: ''
                                                    },
                                                ]
                                            },
                                            {
                                                labelPosition: 'left',
                                                direction: 'row',
                                                modClass: 'marginBottom22',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Кодовое название',
                                                        required: true,
                                                        invalid: false,
                                                        width: 4,
                                                        codename: 'codename',
                                                        widget: 'simpleInput',
                                                        hint: ''
                                                    },
                                                ]
                                            },
                                            {
                                                labelPosition: 'left',
                                                direction: 'row',
                                                modClass: 'marginBottom22',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Тип конструкции',
                                                        required: true,
                                                        width: 6,
                                                        widget: 'singleSelector',
                                                        returnOnly: 'codename',
                                                        invalid: false,
                                                        controlFlag: [  /*Данный виджет способен управлять этими флагами*/
                                                            {
                                                                toBeChecked: 'codename',   /*На какое значение в массиве выбранных сущностей смотреть*/
                                                                value: 'var',            /*Каким должно быть значение*/
                                                                flag: 'isVar'                /*Какой флаг тригеррит*/
                                                            },
                                                        ],
                                                        sortFlag: {
                                                            value: 'name',
                                                            direction: 'asc'
                                                        },
                                                        codename: 'construction_type',
                                                        view_structure: [     /*Структура picked_item*/
                                                            {
                                                                value: 'name',
                                                                flex: 1.5,      /*Так как контейнер будет флексовым, стоит ввести отдельное значение flex*/
                                                            },
                                                        ],
                                                        available_values: [
                                                            {
                                                                id: 1,
                                                                name: 'Переменная',
                                                                codename: 'var',
                                                            },
                                                            {
                                                                id: 2,
                                                                name: 'Шаблонный тег',
                                                                codename: 'tag',
                                                            },
                                                        ],
                                                        hint: ''
                                                    },
                                                ]
                                            },
                                            {
                                                labelPosition: 'left',
                                                direction: 'row',
                                                renderFlag: 'isVar',
                                                modClass: 'marginBottom18',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Тип содержимого',
                                                        required: true,
                                                        width: 6,
                                                        widget: 'singleSelector',
                                                        returnOnly: 'codename',
                                                        invalid: false,
                                                        sortFlag: {
                                                            value: 'name',
                                                            direction: 'asc'
                                                        },
                                                        codename: 'content_type',
                                                        view_structure: [     /*Структура picked_item*/
                                                            {
                                                                value: 'name',
                                                                flex: 1.5,      /*Так как контейнер будет флексовым, стоит ввести отдельное значение flex*/
                                                            },
                                                        ],
                                                        available_values: [
                                                            {
                                                                id: 1,
                                                                name: 'Текст',
                                                                codename: 'text',
                                                            },
                                                            {
                                                                id: 2,
                                                                name: 'Ссылка',
                                                                codename: 'link',
                                                            },
                                                            {
                                                                id: 3,
                                                                name: 'Email',
                                                                codename: 'email',
                                                            },
                                                        ],
                                                        hint: ''
                                                    },
                                                ]
                                            },
                                        ]
                                    },
                                ],
                                rows: [
                                    {
                                        width: 8,
                                        codename: 'text',
                                        widget: 'textField',
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Комментарий',
                                required: false,
                                invalid: false,
                                height: 60,
                                width: 12,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Активное событие (неактивные события игнорируются и уведомления не отправляются)',
                                required: false,
                                codename: 'is_active',
                                widget: 'singleCheckbox',
                                hint: ''
                            }
                        ]
                    },
                ]
            },
        ],
    },
    activeFlag: {
        events: {
            title: 'Активное событие',
            hint: 'Неактивные события игнорируются и уведомления не отправляются',
        }
    },
};

export default {
    state
}