

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
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'field',
                                label: 'Название / ФИО',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'name',
                                widget: 'simpleInput',
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                type: 'field',
                                label: 'Способ отправки',
                                api_route: 'channels',
                                required: true,
                                width: 4,
                                widget: 'singleSelector',
                                invalid: false,
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc',
                                },
                                codename: 'channel',
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5,
                                    },
                                ],
                                hint: '',
                                returnField: 'codename',
                            },
                            {
                                type: 'field',
                                label: 'Email',
                                required: false,
                                width: 4,
                                codename: 'email',
                                widget: 'simpleInput',
                                hint: '',
                                show: false,
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'field',
                                label: 'Комментарий',
                                required: false,
                                height: 80,
                                width: 12,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: '',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        recipients: {
            title: 'Активный получатель',
            hint: 'Неактивным получателям не поступают уведомления',
        },
    },
};

export default {
    state,
};