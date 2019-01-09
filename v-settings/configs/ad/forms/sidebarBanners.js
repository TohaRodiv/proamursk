
const state = {
    formsOptions: {
        'sidebar-banners': [
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
                                label: 'Название',
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
                                label: 'Ссылка',
                                required: true,
                                invalid: true,
                                width: 10,
                                codename: 'link',
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
                                label: 'Дата и время начала публикации',
                                required: true,
                                invalid: true,
                                width: 4,
                                codename: 'start_publication_date',
                                widget: 'simpleInput',
                                hint: ''
                            },
                            {
                                type: 'mask-datetime',
                                label: 'Дата и время окончания публикации',
                                required: true,
                                invalid: true,
                                width: 4,
                                codename: 'end_publication_date',
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
                                label: 'Активный баннер (неактивные баннеры не отображаются на странице)',
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
                title: 'ИЗОБРАЖЕНИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                inputID: 'wideBannersCoverInput',
                                dragID: 'wideBannersCoverDrag',
                                label: 'Баннер',
                                expected_value: 'medium_url',
                                required: true,
                                invalid: true,
                                width: 12,
                                image: {
                                    width: 748,
                                    height: 858,
                                },
                                codename: 'cover',
                                widget: 'singleImageLoader',
                                modClass: 'marginBottom22',
                                requireSendId: true,
                                key_attr: 'id',
                                hint: ''
                            },
                        ]
                    },
                ]
            },
        ],
    },
    activeFlag: {
        'sidebar-banners': {
            title: 'Активный баннер',
            hint: 'Неактивные баннеры не отображаются на сайте',
        }
    },
};

export default {
    state
}