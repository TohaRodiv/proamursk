const state = {
    formsOptions: {
        reviews: [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Место',
                                required: true,
                                width: 8,
                                codename: 'place',
                                widget: 'select',
                                api: 'places',
                                params: {
                                    order_by: 'title',
                                },
                                template: 'title',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Отправитель',
                                required: true,
                                width: 6,
                                codename: 'name',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Email',
                                required: true,
                                width: 6,
                                codename: 'email',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                type: 'mask-phone',
                                label: 'Телефон',
                                width: 6,
                                codename: 'phone',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                label: 'Текст отзыва',
                                required: true,
                                widget: 'textarea',
                                codename: 'text',
                                width: 12,
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Комментарий',
                                width: 12,
                                height: 80,
                                codename: 'comment',
                                widget: 'textarea',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        reviews: {
            title: 'Активный отзыв',
            hint: 'Неактивные отзывы не отображаются на сайте',
        },
    },
};

export default {
    state,
};