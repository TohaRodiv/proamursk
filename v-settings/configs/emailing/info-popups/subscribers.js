const state = {
    infoPopupsConfig: {
        subscribers: {
            title: 'Информация о подписчике',
            infoConfig: [
                {
                    type: 'actions',
                    rights: {
                        activation: 'is_active'
                    }
                },
                {
                    type: 'hr',
                },
                {
                    type: 'simpleRow',
                    title: 'ID подписчика',
                    content: {
                        codename: 'id',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Email',
                    content: {
                        codename: 'email',
                    }
                },
                {
                    type: 'hr',
                },
                {
                    type: 'simpleRow',
                    title: 'MailerLite ID',
                    content: {
                        codename: 'mailerlite_id'
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Дата создания',
                    content: {
                        type: 'dateTime',
                        codename: 'edit_date'
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Дата создания',
                    content: {
                        type: 'dateTime',
                        codename: 'create_date'
                    }
                },
                {
                    type: 'hr',
                    showIf: {
                        type: 'simple',
                        flag: 'comment',
                        value: '',
                        reversed: true
                    }
                },
                {
                    type: 'textarea',
                    title: 'Комментарий',
                    codename: 'comment',
                    showIf: {
                        type: 'simple',
                        flag: 'comment',
                        value: '',
                        reversed: true
                    }
                }
            ]
        }
    },
};

export default {
    state
}