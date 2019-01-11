const state = {
    formsOptions: {
        persons: [
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
                                invalid: true,
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
                                label: 'Заголовок',
                                required: true,
                                invalid: true,
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
                                invalid: true,
                                width: 12,
                                codename: 'descriptor',
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
                                type: 'mask-datetime',
                                label: 'Дата и время публикации',
                                required: true,
                                invalid: true,
                                width: 4,
                                codename: 'publication_date',
                                widget: 'simpleInput',
                                hint: ''
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'column',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                type: 'field',
                                label: 'Формат обложки<br>(представление в сетке)',
                                codename: 'cover_format',
                                has_borders: true,
                                required: true,
                                invalid: true,
                                widget: 'radioButtons',
                                width: 6,
                                hint: '',
                                values: [
                                    {
                                        label: 'Обычная обложка',
                                        flag: true,
                                        codename: 'small'
                                    },
                                    {
                                        label: 'Полноформатная обложка',
                                        flag: false,
                                        codename: 'full'
                                    }
                                ]
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
                                height: 58,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: ''
                            }
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Активная запись (страницы неактивных записей не отображаются на странице)',
                                required: false,
                                codename: 'is_active',
                                widget: 'singleCheckbox',
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
                                invalid: true,
                                width: 12,
                                height: 58,
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
                        elements: [
                            {
                                label: 'Текст отзыва',
                                required: false,
                                invalid: false,
                                widget: 'formatter',
                                codename: 'text',
                                width: 12,
                                hint: ''
                            }
                        ]
                    },
                ]
            }
        ],
    },
    activeFlag: {
        persons: {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        }
    },
};

export default {
    state
}