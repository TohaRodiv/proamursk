const state = {
    formsOptions: {
        specials: [
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
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                format: 'datetime',
                                label: 'Дата и время публикации',
                                required: true,
                                width: 4,
                                codename: 'publication_date',
                                widget: 'inputDatetime',
                            },
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
                        direction: 'column',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Формат обложки<br>(представление в сетке)',
                                codename: 'cover_format',
                                width: 6,
                                borders: true,
                                required: true,
                                widget: 'radioButtons',
                                options: [
                                    {
                                        label: 'Обычная обложка',
                                        codename: 'small',
                                    },
                                    {
                                        label: 'Полноразмерная обложка',
                                        codename: 'full',
                                    },
                                ],
                                default: 'small',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Контент материала для создания поискового индекса',
                                width: 12,
                                height: 300,
                                codename: 'search_text',
                                widget: 'textarea',
                                required: true,
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
                                label: 'Обложка',
                                required: true,
                                width: 12,
                                image: {
                                    width: 3840,
                                    height: 1040,
                                },
                                codename: 'cover',
                                widget: 'singleImageLoader',
                            },
                        ],
                    },
                ],
            },
            {
                id: 3,
                title: 'SEO и OG',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'field',
                                label: 'Заголовок страницы (title / og:title)',
                                required: false,
                                width: 12,
                                codename: 'meta_title',
                                widget: 'simpleInput',
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'field',
                                label: 'Описание страницы<br>(description / og:description)',
                                required: false,
                                width: 12,
                                codename: 'meta_description',
                                widget: 'textarea',
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Ключевые слова, через запятую (keywords)',
                                required: false,
                                width: 12,
                                codename: 'meta_keywords',
                                widget: 'textarea',
                                hint: '',
                            },
                        ],
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
                                width: 12,
                                image: {
                                    width: 1200,
                                    height: 630,
                                },

                                codename: 'og_image',
                                widget: 'singleImageLoader',
                                requireSendId: true,
                                key_attr: 'id',
                                hint: '',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        specials: {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        },
    },
};

export default {
    state,
};
