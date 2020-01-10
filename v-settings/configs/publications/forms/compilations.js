import { publications, } from '../../dicts';

const state = {
    formsOptions: {
        compilations: [
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
                                codename: 'name',
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
                                label: 'URL (кодовое название)',
                                required: true,
                                width: 4,
                                codename: 'codename',
                                widget: 'input',
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
                title: 'СОСТАВ',
                blocks: [
                    {
                        labelPosition: 'left',
                        hasWideLabel: true,
                        elements: [
                            {
                                widget: 'childEntity',
                                codename: 'items',
                                label: 'Материалы',
                                menu: ['edit', 'delete',],
                                rows: [
                                    {
                                        map: {
                                            layout: 'column',
                                            elements: [
                                                {
                                                    codename: 'object_data.title',
                                                },
                                                {
                                                    codename: 'entity',
                                                    class: ['halfTransparent',],
                                                    dict: publications,
                                                },
                                            ],
                                        },
                                    },
                                ],
                                popup: {
                                    label: 'Материал в подборке',
                                    config: [
                                        {
                                            id: 1,
                                            blocks: [
                                                {
                                                    labelPosition: 'left',
                                                    direction: 'row',
                                                    modClass: 'marginBottom20',
                                                    elements: [
                                                        {
                                                            widget: 'radioButtons',
                                                            label: 'Тип материала',
                                                            codename: 'entity',
                                                            required: true,
                                                            default: 'news',
                                                            borders: true,
                                                            // direction: 'column',
                                                            width: 6,
                                                            options: [
                                                                {
                                                                    value: 'news',
                                                                    label: 'Новость',
                                                                },
                                                                {
                                                                    value: 'event-announcements',
                                                                    label: 'Анонс события',
                                                                },
                                                                {
                                                                    value: 'reports',
                                                                    label: 'Репортаж о событии',
                                                                },
                                                                {
                                                                    value: 'history',
                                                                    label: 'Историческая статья',
                                                                },
                                                                {
                                                                    value: 'persons',
                                                                    label: 'Статья о жителе Амурска',
                                                                },
                                                                {
                                                                    value: 'places',
                                                                    label: 'Статья о месте',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            widget: 'select',
                                                            label: 'Публикация',
                                                            required: true,
                                                            api: 'news',
                                                            codename: 'object_data',
                                                            width: 8,
                                                            template: 'title',
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
                id: 3,
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
        compilations: {
            title: 'Активная подборка',
            hint: 'Неактивные подборки не отображаются на сайте',
        },
    },
};

export default {
    state,
};