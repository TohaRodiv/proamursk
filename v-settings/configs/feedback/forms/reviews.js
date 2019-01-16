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
                                label: 'Место',
                                expected_value: 'id',
                                required: true,
<<<<<<< HEAD
                                invalid: false,
                                width: 12,
=======
                                invalid: true,
                                width: 8,
>>>>>>> Поправила по прототипу
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
                                label: 'Отправитель',
                                required: true,
<<<<<<< HEAD
                                invalid: false,
                                width: 12,
=======
                                invalid: true,
                                width: 6,
>>>>>>> Поправила по прототипу
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
<<<<<<< HEAD
                                invalid: false,
                                width: 12,
=======
                                invalid: true,
                                width: 6,
>>>>>>> Поправила по прототипу
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
                                label: 'Телефон',
                                required: false,
                                invalid: false,
                                width: 6,
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
                                label: 'Текст отзыва',
                                required: true,
                                invalid: true,
                                widget: 'textarea',
                                codename: 'text',
                                width: 12,
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
                ]
            }
        ],
    },
    activeFlag: {
        reviews: {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        }
    },
};

export default {
    state
}