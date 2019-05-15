
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
                                type: 'field',
                                label: 'Фамилия',
                                required: true,
                                invalid: false,
                                width: 4,
                                codename: 'last_name',
                                widget: 'simpleInput',
                                hint: ''
                            },
                            {
                                type: 'field',
                                label: 'Имя',
                                required: true,
                                invalid: false,
                                width: 4,
                                codename: 'first_name',
                                widget: 'simpleInput',
                                hint: ''
                            },
                            {
                                type: 'field',
                                label: 'Отчество',
                                required: false,
                                invalid: false,
                                width: 4,
                                codename: 'patronymic',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                type: 'field',
                                label: 'Email / Логин',
                                parentValue: 'username',
                                required: true,
                                invalid: false,
                                width: 4,
                                codename: 'username',
                                widget: 'simpleInput',
                                hint: ''
                            },
                            {
                                type: 'shortTag',
                                label: 'Роли пользователя в ПУ',
                                required: true,
                                width: 8,
                                codename: 'roles',
                                callbackType: 'idArray',
                                widget: 'multipleSelector',
                                api_route: 'user-roles',
                                sortFlag: {
                                    value: 'name',
                                    direction: 'asc'
                                },
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: .85,
                                    },
                                ],
                                hint: '',
                                mounted: (component) => {
                                    if (component.isSuperUser.flag) {
                                        component.changeField({
                                            codename: 'roles',
                                            key: 'required',
                                            value: false
                                        });
                                    } else {
                                        component.changeField({
                                            codename: 'roles',
                                            key: 'required',
                                            value: true
                                        });
                                    }
                                }
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        uniqWidget: true,
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                required: false,
                                invalid: false,
                                width: 12,
                                requiredIfOnCreate: true,
                                codename: 'password2',
                                widget: 'passwordChanger',
                                hint: 'Пароль может состоять только из цифр или букв английского алфавита, должен быть не короче шести символов, а также содержать как минимум одну цифру и одну букву в любом регистре, например: 8goods'
                            },
                        ]
                    },


                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Комментарий',
                                required: false,
                                invalid: false,
                                height: 80,
                                width: 12,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: ''
                            }
                        ]
                    },

                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Запросить у пользователя смену пароля при следующей авторизации',
                                required: false,
                                codename: 'request_change_password',
                                widget: 'singleCheckbox',
                                hint: ''
                            }
                        ]
                    }
                ]
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
                                type: 'field',
                                inputID: 'usersInput',
                                dragID: 'usersDrag',
                                label: 'Фотография / Аватар',
                                expected_value: 'medium_url',
                                required: false,
                                invalid: false,
                                width: 6,
                                image: {
                                    width: 360,
                                    height: 360,
                                },
                                codename: 'avatar',
                                widget: 'singleImageLoader',
                                modClass: 'marginBottom20',
                                requireSendId: true,
                                key_attr: 'id',
                                hint: ''
                            },
                        ]
                    },
                ]
            }
        ],
    },
    activeFlag: {
        users: {
            title: 'Активный пользователь',
            hint: 'Неактивные пользователи не могут авторизоваться на сайте и в ПУ',
        }
    },
};

export default {
    state
}