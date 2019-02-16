const state = {
    infoPopupsConfig: {
        'feedbacks': {
            title: 'Информация об обращении в редакцию',
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
                    title: 'Дата создания',
                    content: {
                        type: 'dateTime',
                        codename: 'create_date',
                    }
                },
                {
                    type: 'hr',
                },
                {
                    type: 'simpleRow',
                    title: 'Тема обращения',
                    content: {
                        codename: 'subject_name',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Отправитель',
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
                    title: 'Телефон',
                    content: {
                        codename: 'phone',
                    }
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
                    type: 'hr',
                },
                {
                    type: 'textarea',
                    title: 'Текст обращения',
                    codename: 'text',
                },
            ]
        }
    },
};

export default {
    state
}