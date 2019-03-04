
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
                                type: 'field',
                                label: 'Email',
                                required: true,
                                invalid: false,
                                width: 8,
                                codename: 'email',
                                widget: 'simpleInput',
                                hint: ''
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Комментарий',
                                required: false,
                                invalid: false,
                                width: 12,
                                height: 80,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: ''
                            }
                        ]
                    },
                ]
            },
            {
                id: 2,
                title: 'MAILER LITE',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Mailer Lite ID',
                                required: false,
                                invalid: false,
                                isBlocked: true,
                                width: 4,
                                codename: 'mailerlite_id',
                                widget: 'simpleInput',
                                hint: ''
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Дата и время последней синхронизации',
                                required: false,
                                invalid: false,
                                isBlocked: true,
                                width: 4,
                                codename: 'synchronization_date',
                                widget: 'simpleInput',
                                hint: ''
                            }
                        ]
                    },
                ]
            }
        ],
    },
    activeFlag: {
        subscribers: {
            title: 'Активный подписчик',
            hint: 'Неактивные подписчики не получают рассылки',
        }
    },
};

export default {
    state
}