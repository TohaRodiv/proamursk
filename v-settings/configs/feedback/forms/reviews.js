const state = {
    formsOptions: {
        reviews: [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'ID места',
                                expected_value: 'id',
                                required: true,
                                invalid: true,
                                width: 12,
                                codename: 'place',
                                widget: 'singleSelector',
                                api_route: 'places',
                                sortFlag: {
                                    value: 'title',
                                    direction: 'asc'
                                },
                                view_structure: [
                                    {
                                        value: 'title',
                                        flex: 1.5,
                                    },
                                ],
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
                                label: 'ФИО пользователя, оставившего отзыв',
                                required: true,
                                invalid: true,
                                width: 12,
                                codename: 'name',
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
                                label: 'Email',
                                required: true,
                                invalid: true,
                                width: 12,
                                codename: 'email',
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
                                type: 'mask-phone',
                                label: 'Номер телефона',
                                required: false,
                                invalid: false,
                                width: 12,
                                codename: 'phone',
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
                                height: 58,
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
                                label: 'Активная запись (страницы неактивных записей не отображаются на странице)',
                                required: false,
                                codename: 'is_active',
                                widget: 'singleCheckbox',
                                hint: ''
                            }
                        ]
                    },
                ]
            },
            {
                id: 2,
                title: 'КОНТЕНТ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Текст отзыва',
                                required: true,
                                invalid: true,
                                widget: 'formatter',
                                codename: 'text',
                                width: 12,
                                hint: ''
                            }
                        ]
                    },
                ]
            }
        ],
    },
    activeFlag: {
        persons: {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        }
    },
};

export default {
    state
}