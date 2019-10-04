
const state = {
    formsOptions: {
        films: [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Название фильма',
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
                                label: 'Год выпуска',
                                required: true,
                                width: 4,
                                codename: 'release_year',
                                widget: 'inputNumber',
                                style: {
                                    textAlign: 'left',
                                },
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                type: 'autocomplete',
                                label: 'Страна',
                                required: true,
                                width: 6,
                                codename: 'country',
                                widget: 'simpleInput',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Жанр',
                                required: true,
                                width: 6,
                                codename: 'genre',
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
                                type: 'autocomplete',
                                label: 'Режиссер',
                                required: true,
                                width: 6,
                                codename: 'director',
                                widget: 'simpleInput',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'В главных ролях<br>(через запятую)',
                                required: true,
                                width: 12,
                                codename: 'starring',
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
                                label: 'Продолжительность, мин.',
                                required: true,
                                width: 4,
                                codename: 'duration',
                                widget: 'inputNumber',
                                style: {
                                    textAlign: 'left',
                                },
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Возрастное ограничение',
                                required: true,
                                width: 4,
                                codename: 'age_restriction',
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
                                label: 'Ссылка на трейлер в YouTube',
                                required: true,
                                width: 12,
                                codename: 'trailer',
                                widget: 'input',
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
                                label: 'Ссылка на страницу фильма на сайте кинотеатра «Молодость»',
                                required: true,
                                width: 12,
                                codename: 'purchase_link',
                                widget: 'input',
                                placeholder: 'http(s)://',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                label: 'Фильм в формате 3D',
                                codename: 'is_3d',
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
                                label: 'Описание',
                                required: true,
                                widget: 'formatter',
                                codename: 'description',
                                width: 12,
                            },
                        ],
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
                                width: 6,
                                image: {
                                    width: 480,
                                    height: 720,
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
                title: 'РАСПИСАНИЕ СЕАНСОВ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                codename: 'sessions',
                                widget: 'simpleChildEntity',
                                label: 'Сеансы',
                                gotHeaders: true,
                                // TODO: Избавиться от этого атрибута
                                type: 'field',
                                defaultRowConfig: [
                                    {
                                        // TODO: Избавиться от этого атрибута
                                        type: 'field',
                                        format: 'datetime',
                                        widget: 'inputDatetime',
                                        codename: 'session_time',
                                        width: 5,
                                        text: 'Дата и время начала сеанса',
                                        required: true,
                                    },
                                    {
                                        type: 'field',
                                        widget: 'inputNumber',
                                        codename: 'price',
                                        width: 4,
                                        text: 'Стоимость билета, ₽',
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 4,
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
                                invalid: false,
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
                                invalid: false,
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
                                invalid: false,
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
                                inputID: 'filmsCoverInputOG',
                                dragID: 'filmsCoverDragOG',
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
        films: {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        },
    },
};

export default {
    state,
};
