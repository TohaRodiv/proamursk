
const state = {
    formsOptions: {
        'places': [
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
                                label: 'Заголовок',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'title',
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
                                label: 'Подзаголовок',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'descriptor',
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
                                type: 'mask-datetime',
                                label: 'Дата и время публикации',
                                required: true,
                                invalid: false,
                                width: 4,
                                codename: 'publication_date',
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
                                label: 'Адрес, отображаемый на сайте',
                                required: true,
                                invalid: false,
                                width: 8,
                                codename: 'address',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Точка на карте',
                                required: false,
                                invalid: false,
                                widget: 'geoinput',
                                codename: 'coordinates',
                                width: 12,
                                hint: '',
                                defaultCoordinates: '50.2368500, 136.8813600'
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
                                label: 'Режим работы',
                                width: 12,
                                codename: 'schedule',
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
                                label: 'Контактная информация',
                                width: 12,
                                codename: 'contacts',
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
                                label: 'Сайт',
                                width: 8,
                                codename: 'site',
                                widget: 'simpleInput',
                                hint: '',
                                placeholder: 'http(s)://'
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Профиль в Instagram',
                                width: 8,
                                codename: 'instagram',
                                widget: 'simpleInput',
                                hint: '',
                                placeholder: 'http(s)://'
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'column',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Формат обложки<br>(представление в сетке)',
                                codename: 'cover_format',
                                width: 6,
                                has_borders: true,
                                required: true,
                                invalid: false,
                                widget: 'radioButtons',
                                hint: '',
                                values: [
                                    {
                                        label: 'Обычная обложка',
                                        flag: true,
                                        codename: 'small'
                                    },
                                    {
                                        label: 'Полноразмерная обложка',
                                        flag: false,
                                        codename: 'full'
                                    }
                                ]
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
                                label: 'Автор обложки или источник',
                                width: 8,
                                codename: 'cover_author',
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
                                label: 'Автор(ы) материала или источник',
                                width: 8,
                                codename: 'content_author',
                                widget: 'simpleInput',
                                hint: ''
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Показать в сайдбаре два узких рекламных баннера вместо одного большого',
                                codename: 'show_two_banners',
                                widget: 'singleCheckbox',
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
                                height: 60,
                                codename: 'comment',
                                widget: 'textarea',
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
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Лид',
                                required: true,
                                invalid: false,
                                width: 12,
                                height: 60,
                                codename: 'lead',
                                widget: 'textarea',
                                modClass: 'marginBottom22',
                                hint: ''
                            }
                        ]

                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        hasWideLabel: true,
                        elements: [
                            {
                                label: '',
                                required: false,
                                invalid: false,
                                widget: 'postEditor',
                                codename: 'content',
                                hint: ''
                            }
                        ]
                    },
                ]
            },
            {
                id: 3,
                title: 'ИЗОБРАЖЕНИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                inputID: 'placesCoverInput',
                                dragID: 'placesCoverDrag',
                                label: 'Обложка',
                                expected_value: 'medium_url',
                                required: true,
                                invalid: false,
                                width: 12,
                                image: {
                                    width: 1720,
                                    height: 1000,
                                },
                                codename: 'cover',
                                widget: 'singleImageLoader',
                                requireSendId: true,
                                key_attr: 'id',
                                hint: ''
                            },
                        ]
                    },
                ]
            },
            {
                id: 4,
                title: 'SEO и OG',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Заголовок страницы (title / og:title)',
                                required: false,
                                invalid: false,
                                width: 12,
                                codename: 'meta_title',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Описание страницы<br>(description / og:description)',
                                required: false,
                                invalid: false,
                                width: 12,
                                codename: 'meta_description',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Ключевые слова, через запятую (keywords)',
                                required: false,
                                invalid: false,
                                width: 12,
                                codename: 'meta_keywords',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                inputID: 'cityGuidesCoverInputOG',
                                dragID: 'cityGuidesCoverDragOG',
                                label: 'Обложка для социальных сетей (og:image)',
                                expected_value: 'medium_url',
                                required: false,
                                width: 12,
                                image: {
                                    width: 1200,
                                    height: 630,
                                },

                                codename: 'og_image',
                                widget: 'singleImageLoader',
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
        'places': {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        }
    },
};

export default {
    state
}