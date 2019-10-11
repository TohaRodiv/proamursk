const state = {
    formsOptions: {
        sliders: [
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
                                codename: 'format',
                                widget: 'select',
                                label: 'Формат слайдера',
                                width: 6,
                                required: true,
                                options: [
                                    {
                                        name: 'Горизонтальный / 3:2',
                                        id: 'format_3x2',
                                    },
                                    {
                                        name: 'Горизонтальный / 2:1',
                                        id: 'format_2x1',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        hasWideLabel: true,
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                blocked: true,
                                label: 'Слайды',
                                dragOrder: 'weight',
                                widget: 'childEntity',
                                codename: 'slides',
                                rows: [
                                    {
                                        map: {
                                            layout: 'row',
                                            elements: [
                                                {
                                                    type: 'image',
                                                    tag: 'img',
                                                    codename: 'cover.medium_url',
                                                    elStyle: {
                                                        height: '100px',
                                                        width: 'auto',
                                                        borderRadius: '5px',
                                                    },
                                                },
                                                {
                                                    codename: 'description',
                                                    empty: '',
                                                    style: {
                                                        marginLeft: '10px',
                                                        whiteSpace: 'normal',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                                popup: {
                                    label: 'Слайд в слайдере',
                                    disableClickaway: true,
                                    config: [
                                        {
                                            id: 1,
                                            blocks: [
                                                {
                                                    labelPosition: 'top',
                                                    direction: 'row',
                                                    modClass: 'marginBottom20',
                                                    elements: [
                                                        {
                                                            label: 'Изображение',
                                                            required: true,
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
                                                    labelPosition: 'top',
                                                    direction: 'row',
                                                    modClass: 'marginBottom50',
                                                    elements: [
                                                        {
                                                            label: 'Описание',
                                                            width: 12,
                                                            height: 80,
                                                            codename: 'description',
                                                            widget: 'textarea',
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'top',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            label: 'Активный слайд (неактивные слайды не отображаются на странице)',
                                                            codename: 'is_active',
                                                            widget: 'singleCheckbox',
                                                            default: true,
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
        ],
    },
};

export default {
    state,
};