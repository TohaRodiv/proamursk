const state = {
    infoPopupsConfig: {
        'feedbacks': {
            title: 'Информация об обращении с сайта',
            infoConfig: [
                {
                    type: 'simpleRow',
                    title: 'ID обращения',
                    content: {
                        codename: 'id',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Тема',
                    content: {
                        codename: 'subject',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Название темы',
                    content: {
                        codename: 'subject_name',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'ФИО',
                    content: {
                        codename: 'name',
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
                    type: 'simpleRow',
                    title: 'Номер телефона',
                    content: {
                        codename: 'phone',
                    }
                },
                {
                    type: 'hr',
                },
                {
                    type: 'textarea',
                    title: 'Текст обращения',
                    codename: 'text',
                },
                {
                    type: 'simpleRow',
                    title: 'Прикреплённый файл',
                    content: {
                        type: 'link',
                        customName: 'attachment.original_name',
                        codename: 'attachment.file',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Дата и время создания',
                    content: {
                        type: 'dateTime',
                        codename: 'create_date',
                    }
                },
            ]
        }
    },
};

export default {
    state
}