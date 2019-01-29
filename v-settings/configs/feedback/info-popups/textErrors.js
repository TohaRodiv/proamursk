const state = {
    infoPopupsConfig: {
        'text-errors': {
            title: 'Информация о сообщении об ошибке',
            infoConfig: [
                {
                    type: 'simpleRow',
                    title: 'ID создания',
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
                    type: 'simpleRow',
                    title: 'URL страницы',
                    content: {
                        type: 'link',
                        codename: 'url'
                    }
                },
                {
                    type: 'hr',
                },
                {
                    type: 'simpleRow',
                    title: 'Блок текста с ошибкой',
                    content: {
                        codename: 'text',
                    }
                }
            ]
        }
    },
};

export default {
    state
}