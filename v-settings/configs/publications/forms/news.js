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
                        ],
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Автор обложки или источник',
                                width: 8,
                                codename: 'cover_author',
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
                                label: 'Автор(ы) материала или источник',
                                width: 8,
                                codename: 'content_author',
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
                title: 'КОНТЕНТ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom20',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Лид',
                                required: true,
                                width: 12,
                                height: 80,
                                codename: 'lead',
                                widget: 'textarea',
                                modClass: 'marginBottom20',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                required: true,
                                widget: 'postEditor',
                                codename: 'text',
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
