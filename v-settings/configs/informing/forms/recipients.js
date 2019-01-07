

const state = {
    formsOptions: {
        'recipients': [
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
                                label: 'Название / ФИО',
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
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                type: 'field',
                                controlFlag: [  /*Данный виджет способен управлять этими флагами*/
                                    {
                                        toBeChecked: 'codename',   /*На какое значение в массиве выбранных сущностей смотреть*/
                                        value: 'email',            /*Каким должно быть значение*/
                                        flag: 'isEmail'                /*Какой флаг тригеррит*/
                                    },
                                    {
                                        toBeChecked: 'codename',
                                        value: 'sms',
                                        flag: 'isSms'
                                    },
                                ],
                                label: 'Способ отправки',
                                api_route: 'channels',
                                required: true,
                                width: 4,
                                widget: 'singleSelector',
                                invalid: false,
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc'
                                },
                                codename: 'channel',
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5,
                                    },
                                ],
                                hint: ''
                            },
                            {
                                type: 'field',
                                label: 'Email',
                                renderFlag: 'isEmail',
                                nullRightMargin: true,
                                required: true,
                                invalid: false,
                                width: 4,
                                codename: 'email',
                                modClass: 'width460',
                                widget: 'simpleInput',
                                hint: ''
                            },
                            {
                                type: 'mask-phone',
                                label: 'Телефон',
                                renderFlag: 'isSms',
                                required: true,
                                invalid: false,
                                width: 4,
                                codename: 'phone',
                                widget: 'simpleInput',
                                hint: ''
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
                                label: 'Активный получатель (неактивным получателям не поступают уведомления)',
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
        recipients: {
            title: 'Активный получатель',
            hint: 'Неактивным получателям не поступают уведомления',
        }
    },
};

export default {
    state
}