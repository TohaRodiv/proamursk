
const state = {
    formsOptions: {
        users: [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'top',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Фамилия',
                                required: true,
                                width: 4,
                                codename: 'last_name',
                                widget: 'input',
                            },
                            {
                                label: 'Имя',
                                required: true,
                                width: 4,
                                codename: 'first_name',
                                widget: 'input',
                            },
                            {
                                label: 'Отчество',
                                width: 4,
                                codename: 'patronymic',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                label: 'Email / Логин',
                                parentValue: 'username',
                                required: true,
                                width: 4,
                                codename: 'username',
                                widget: 'input',
                            },
                            {
                                label: 'Роли пользователя в ПУ',
                                required: true,
                                width: 8,
                                codename: 'roles',
                                widget: 'select',
                                multi: true,
                                api: 'user-roles',
                                params: {
                                    order_by: 'name',
                                },
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                widget: 'passwordWidget',
                                codename: 'password1',
                                required: false,
                                width: 12,
                            },
                            {
                                widget: 'passwordWidgetAuxiliary',
                                codename: 'password2',
                                required: false,
                                width: 0,
                            },
                        ],
                    },


                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
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

                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                name: 'Запросить у пользователя смену пароля при следующей авторизации',
                                label: '',
                                codename: 'request_change_password',
                                widget: 'singleCheckbox',
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                title: 'ИЗОБРАЖЕНИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Фотография / Аватар',
                                width: 6,
                                image: {
                                    width: 360,
                                    height: 360,
                                },
                                codename: 'avatar',
                                widget: 'singleImageLoader',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        users: {
            title: 'Активный пользователь',
            hint: 'Неактивные пользователи не могут авторизоваться на сайте и в ПУ',
        },
    },
};

export default {
    state,
};
