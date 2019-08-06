import seo from "../../../../cp_vue/frontend/vue/store/seoConfig";

const state = {
    formsOptions: {
        news: [
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
                                type: 'field',
                                label: 'Заголовок',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'title',
                                widget: 'simpleInput',
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
                                label: 'Подзаголовок',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'descriptor',
                                widget: 'simpleInput',
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
                                format: 'datetime',
                                label: 'Дата и время публикации',
                                required: true,
                                invalid: false,
                                width: 4,
                                codename: 'publication_date',
                                widget: 'inputDatetime',
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
                                label: 'Автор обложки или источник',
                                width: 8,
                                codename: 'cover_author',
                                widget: 'simpleInput',
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Автор(ы) материала или источник',
                                width: 8,
                                codename: 'content_author',
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
                                label: 'Комментарий',
                                required: false,
                                invalid: false,
                                width: 12,
                                height: 80,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: '',
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                title: 'КОНТЕНТ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Лид',
                                required: true,
                                invalid: false,
                                width: 12,
                                height: 80,
                                codename: 'lead',
                                widget: 'textarea',
                                modClass: 'marginBottom20',
                                hint: '',
                            },
                        ],
                    },
                    // {
                    //     labelPosition: 'left',
                    //     direction: 'row',
                    //     modClass: 'marginBottom50',
                    //     elements: [
                    //         {
                    //             label: 'Содержание новости',
                    //             // required: true,
                    //             widget: 'formatter',
                    //             codename: 'content',
                    //             width: 12,
                    //             hint: ''
                    //         }
                    //     ]
                    // },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: '',
                                required: true,
                                widget: 'postEditor',
                                codename: 'text',
                                hint: '',
                            },
                        ],
                    },
                ],
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
                                inputID: 'newsCoverInput',
                                dragID: 'newsCoverDrag',
                                label: 'Обложка',
                                required: true,
                                width: 12,
                                image: {
                                    width: 1720,
                                    height: 1000,
                                },
                                codename: 'cover',
                                widget: 'singleImageLoader',
                                modClass: 'marginBottom20',
                                requireSendId: true,
                                key_attr: 'id',
                                hint: '',
                            },
                        ],
                    },
                ],
            },
            seo,
        ],
    },
    activeFlag: {
        news: {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        },
    },
};

export default {
    state,
};
