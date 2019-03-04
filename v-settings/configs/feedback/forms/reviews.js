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
                                invalid: false,
                                width: 8,
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
                                invalid: false,
                                width: 6,
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
                                invalid: false,
                                width: 6,
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
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                label: 'Текст отзыва',
                                required: true,
                                invalid: false,
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
                                height: 80,
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
            title: 'Активный отзыв',
            hint: 'Неактивные отзывы не отображаются на сайте',
        }
    },
};

export default {
    state
}