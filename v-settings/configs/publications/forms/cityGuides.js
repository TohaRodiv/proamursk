const valuesForItems = [
    {
        id: 'hotel',
        name: 'Где остановиться?',
    },
    {
        id: 'food',
        name: 'Где поесть?',
    },
    {
        id: 'activities',
        name: 'Что посмотреть?',
    },
    {
        id: 'transport',
        name: 'Как перемещаться по городу?',
    },
    {
        id: 'phones',
        name: 'Полезные телефоны',
    },
];


const state = {
    formsOptions: {
        'city-guides': [
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
                                label: 'Заголовок',
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
                                label: 'Подзаголовок',
                                required: true,
                                width: 12,
                                codename: 'descriptor',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                name: 'Показать в сайдбаре два узких рекламных баннера вместо одного большого',
                                label: '',
                                codename: 'show_two_banners',
                                widget: 'singleCheckbox',
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
            {
                id: 98,
                title: 'КОНТЕНТ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Формат контента',
                                width: 12,
                                widget: 'select',
                                codename: 'guide_format',
                                required: true,
                                options: valuesForItems,
                            },
                        ],
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        hasWideLabel: true,
                        elements: [
                            {
                                show: false,
                                blocked: true,
                                label: 'Места',
                                widget: 'childEntity',
                                codename: 'items',
                                rows: [
                                    {
                                        map: {
                                            layout: 'row',
                                            elements: [
                                                {
                                                    codename: 'title',
                                                },
                                            ],
                                        },
                                    },
                                ],
                                popup: {
                                    label: 'Место в гиде по городу',
                                    disableClickaway: true,
                                    config: [
                                        {
                                            id: 1,
                                            blocks: [
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Название',
                                                            width: 12,
                                                            widget: 'input',
                                                            codename: 'title',
                                                            required: true,
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Описание',
                                                            width: 12,
                                                            height: 140,
                                                            widget: 'textarea',
                                                            codename: 'description',
                                                            required: true,
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom50',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Материал об этом месте',
                                                            width: 12,
                                                            widget: 'select',
                                                            template: 'title',
                                                            api: 'places',
                                                            codename: 'place',
                                                        },
                                                    ],
                                                },

                                                // Где остановиться?
                                                // index: 3
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Одноместный номер',
                                                            width: 6,
                                                            widget: 'input',
                                                            codename: 'single_room_price',
                                                            show: false,
                                                        },
                                                    ],
                                                },
                                                // index: 4
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Номер люкс',
                                                            width: 6,
                                                            widget: 'input',
                                                            codename: 'luxury_room_price',
                                                            show: false,
                                                        },
                                                    ],
                                                },
                                                // index: 5
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Питание',
                                                            width: 6,
                                                            widget: 'input',
                                                            codename: 'nutrition_info',
                                                            show: false,
                                                        },
                                                    ],
                                                },

                                                // Где поесть?
                                                // index: 6
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Кухня',
                                                            width: 6,
                                                            widget: 'input',
                                                            codename: 'kitchen',
                                                            show: false,
                                                        },
                                                    ],
                                                },
                                                // index: 7
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Средний чек',
                                                            width: 6,
                                                            widget: 'input',
                                                            codename: 'avg_value',
                                                            show: false,
                                                        },
                                                    ],
                                                },
                                                // index: 8
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Входной билет',
                                                            width: 6,
                                                            widget: 'input',
                                                            codename: 'enter_price',
                                                            show: false,
                                                        },
                                                    ],
                                                },
                                                // index: 9
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Время работы',
                                                            width: 10,
                                                            widget: 'input',
                                                            codename: 'work_time',
                                                            show: false,
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Телефон',
                                                            width: 4,
                                                            widget: 'input',
                                                            codename: 'phone',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Ссылка на сайт',
                                                            width: 8,
                                                            widget: 'input',
                                                            codename: 'site',
                                                            placeholder: 'http(s)://',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Профиль в Instagram',
                                                            width: 8,
                                                            widget: 'input',
                                                            codename: 'instagram',
                                                            placeholder: 'http(s)://',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Адрес, отображаемый на сайте',
                                                            width: 8,
                                                            required: true,
                                                            widget: 'input',
                                                            codename: 'address',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom50',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Точка на карте',
                                                            widget: 'geoinput',
                                                            codename: 'coordinates',
                                                            defaultCoordinates: '50.2368500, 136.8813600',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    modClass: 'marginBottom20',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Слайдер',
                                                            width: 12,
                                                            widget: 'select',
                                                            template: 'title',
                                                            api: 'sliders',
                                                            codename: 'slider',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    direction: 'row',
                                                    modClass: 'marginBottom20',
                                                    elements: [
                                                        {
                                                            label: 'Изображение',
                                                            width: 12,
                                                            image: {
                                                                width: 1720,
                                                                height: 1144,
                                                            },
                                                            codename: 'cover',
                                                            widget: 'singleImageLoader',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    direction: 'row',
                                                    modClass: 'marginBottom50',
                                                    elements: [
                                                        {
                                                            label: 'Подпись к изображению',
                                                            width: 12,
                                                            height: 80,
                                                            codename: 'cover_description',
                                                            widget: 'textarea',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            name: 'Активное место (неактивные места не отображаются на сайте)',
                                                            label: '',
                                                            codename: 'is_active',
                                                            widget: 'singleCheckbox',
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                id: 4,
                title: 'SEO и OG',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Заголовок страницы (title / og:title)',
                                width: 12,
                                codename: 'meta_title',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Описание страницы<br>(description / og:description)',
                                width: 12,
                                codename: 'meta_description',
                                widget: 'textarea',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Ключевые слова, через запятую (keywords)',
                                width: 12,
                                codename: 'meta_keywords',
                                widget: 'textarea',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Обложка для социальных сетей (og:image)',
                                width: 12,
                                image: {
                                    width: 1200,
                                    height: 630,
                                },
                                codename: 'og_image',
                                widget: 'singleImageLoader',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        'city-guides': {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        },
    },
};

export default {
    state,
};
