const state = {
    formsOptions: {
        'recipients': [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Название / ФИО',
                                required: true,
                                width: 12,
                                codename: 'name',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                label: 'Способ отправки',
                                required: true,
                                width: 4,
                                codename: 'channel',
                                widget: 'select',
                                api: 'channels',
                                params: {
                                    order_by: 'name',
                                },
                                template: 'name',
                            },
                            {
                                label: 'Email',
                                required: false,
                                width: 4,
                                codename: 'email',
                                widget: 'input',
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
                                label: 'Комментарий',
                                height: 80,
                                width: 12,
                                codename: 'comment',
                                widget: 'textarea',
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