export default {
    title: 'Профиль пользователя',
    hasMainImage: 'avatar.original_url',
    mainImage: {
        height: '180px',
        width: '180px'
    },
    infoConfig: [
        {
            type: 'simpleRow',
            title: 'ID пользователя',
            content: { codename: 'id' }
        },
        {
            type: 'simpleRow',
            title: 'Дата регистрации',
            content: {
                type: 'dateTime',
                codename: 'create_date'
            }
        },
        {
            type: 'simpleRow',
            title: 'Дата изменения',
            content: {
                type: 'dateTime',
                codename: 'edit_date'
            }
        },
        { type: 'hr' },
        {
            type: 'simpleRow',
            title: 'ФИО',
            content: { codename: 'full_name' }
        },
        {
            type: 'simpleRow',
            title: 'Email / Логин',
            content: { codename: 'username' }
        },
        { type: 'hr' },
        {
            type: 'boolean',
            title: 'Пользователь имеет доступ к ПУ',
            codename: 'is_staff'
        },
        {
            type: 'list',
            title: 'Роли',
            codename: 'roles',
            structure: [
                {
                    codename: 'name'
                }
            ]
        },
        {
            type: 'simpleRow',
            title: 'Должность',
            content: {
                codename: 'position.name'
            }
        },
        {
            type: 'simpleRow',
            title: 'Место работы (точка)',
            content: {
                codename: 'point.name'
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
};