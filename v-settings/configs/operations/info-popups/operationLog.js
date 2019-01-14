const state = {
    infoPopupsConfig: {
        'operation-log': {
            title: 'Информация об операции',
            hasBadge: false,
            infoConfig: [
                {
                    type: 'simpleRow',
                    title: 'ID Операции',
                    content: {
                        codename: 'id',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Дата операции',
                    content: {
                        type: 'dateTime',
                        codename: 'action_time',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Тип операции',
                    content: {
                        type: 'colored',
                        codename: 'action_type_name',
                        colors: [
                            {
                                value: 'Добавление',
                                color: 'rgb(35, 202, 98)'
                            },
                            {
                                value: 'Редактирование',
                                color: 'rgb(255, 188, 23)'
                            },
                            {
                                value: 'Удаление',
                                color: 'rgb(255, 52, 85)'
                            },
                        ],
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Пользователь',
                    content: {
                        codename: 'user_full_name',
                    }
                },
                {
                    type: 'hr',
                },
                {
                    type: 'simpleRow',
                    title: 'Сущность',
                    content: {
                        codename: 'content_type_name',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'ID записи',
                    content: {
                        codename: 'object_id',
                    }
                },
                {
                    type: 'simpleRow',
                    title: 'Название записи',
                    content: {
                        codename: 'object_name',
                    },
                },
            ]
        }
    },
};

export default {
    state
}