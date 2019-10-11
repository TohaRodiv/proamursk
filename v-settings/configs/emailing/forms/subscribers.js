const state = {
    formsOptions: {
        subscribers: [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Email',
                                required: true,
                                width: 8,
                                codename: 'email',
                                widget: 'input',
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
                                width: 12,
                                height: 80,
                                codename: 'comment',
                                widget: 'textarea',
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                title: 'MAILER LITE',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Mailer Lite ID',
                                blocked: true,
                                width: 4,
                                codename: 'mailerlite_id',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Дата и время последней синхронизации',
                                blocked: true,
                                width: 4,
                                codename: 'synchronization_date',
                                widget: 'input',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        subscribers: {
            title: 'Активный подписчик',
            hint: 'Неактивные подписчики не получают рассылки',
        },
    },
};

export default {
    state,
};