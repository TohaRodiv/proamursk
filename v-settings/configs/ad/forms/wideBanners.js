
const state = {
    formsOptions: {
        'wide-banners': [
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
                                label: 'Название',
                                required: true,
                                width: 12,
                                codename: 'title',
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
                                label: 'Ссылка',
                                required: true,
                                width: 10,
                                codename: 'link',
                                widget: 'input',
                                placeholder: 'http(s)://',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                format: 'datetime',
                                label: 'Дата и время<br>начала публикации',
                                width: 4,
                                codename: 'start_publication_date',
                                widget: 'inputDatetime',
                            },
                            {
                                format: 'datetime',
                                label: 'Дата и время<br>окончания публикации',
                                width: 4,
                                codename: 'end_publication_date',
                                widget: 'inputDatetime',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
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
            {
                id: 2,
                title: 'ИЗОБРАЖЕНИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Баннер',
                                required: true,
                                width: 12,
                                image: {
                                    width: 2600,
                                    height: 320,
                                },
                                codename: 'cover',
                                widget: 'singleImageLoader',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        'wide-banners': {
            title: 'Активный баннер',
            hint: 'Неактивные баннеры не отображаются на сайте',
        },
    },
};

export default {
    state,
};