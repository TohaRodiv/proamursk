import vue from 'vue';

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
                                type: 'field',
                                label: 'Название',
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
                                label: 'Формат слайдера',
                                codename: 'format',
                                required: true,
                                invalid: false,
                                width: 6,
                                available_values: [
                                    {
                                        name: 'Горизонтальный / 3:2',
                                        id: 'format_3x2',
                                    },
                                    {
                                        name: 'Горизонтальный / 2:1',
                                        id: 'format_2x1',
                                    },
                                ],
                                sortFlag: {
                                    value: 'name',
                                    flex: 1.5,
                                },
                                widget: 'singleSelector',
                                hint: '',
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5,
                                    },
                                ],
                                // blockedCondition: {
                                //     type: 'isEmpty',
                                //     flag: 'slides',
                                // },
                            },
                        ],
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        hasWideLabel: true,
                        elements: [
                            {
                                type: 'field',
                                blocked: false,
                                label: 'Слайды',
                                dragOrder: 'weight',
                                widget: 'childEntity',
                                modClass: 'marginBottom50',
                                codename: 'slides',
                                requireSendId: true,
                                hint: '',
                                row: [
                                    {
                                        type: 'image',
                                        requiredValue: 'cover.medium_url',
                                        height: '100px',
                                        width: 'auto',
                                    },
                                    {
                                        type: 'text',
                                        requiredValue: 'description',
                                        flex: 1,
                                    },
                                ],
                                textOptions: true,
                                // Это должно быть настройкой по умолчанию
                                menu: {
                                    edit: true,
                                    delete: true,
                                    activate: true,
                                    // editLink: 'news',
                                },
                                popup: {
                                    label: {
                                        add: 'Слайд в слайдере',
                                        edit: 'Слайд в слайдере',
                                    },
                                    disableClickaway: true,
                                    config: [
                                        {
                                            id: 1,
                                            blocks: [
                                                {
                                                    labelPosition: 'top',
                                                    direction: 'row',
                                                    elements: [
                                                        {
                                                            type: 'field',
                                                            inputID: 'slideCoverInput',
                                                            dragID: 'slideCoverDrag',
                                                            label: 'Изображение',
                                                            required: true,
                                                            width: 12,
                                                            image: {
                                                                width: 1720,
                                                                height: 1144,
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
                                                {
                                                    labelPosition: 'top',
                                                    direction: 'row',
                                                    modClass: 'marginBottom50',
                                                    elements: [
                                                        {
                                                            type: 'field',
                                                            label: 'Описание',
                                                            width: 12,
                                                            height: 80,
                                                            codename: 'description',
                                                            widget: 'textarea',
                                                            hint: '',
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
                                                            hint: '',
                                                            default: true,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                rows: [
                                    {
                                        codename: 'cover.medium_url',
                                        widget: 'image',
                                    },
                                    {
                                        codename: 'description',
                                        widget: 'field',
                                    },
                                ],
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
        ],
    },
};

export default {
    state,
};