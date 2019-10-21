const state = {
    formsOptions: {
        actions: [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
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
                        direction: 'row',
                        modClass: 'marginBottom50',
                        elements: [
                            {
                                label: 'Кодовое название',
                                required: true,
                                width: 5,
                                codename: 'codename',
                                widget: 'input',
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
                                label: 'Переменные и теги',
                                dragOrder: 'weight',
                                isDraggable: true,
                                widget: 'childEntity',
                                codename: 'variables',
                                rows: [
                                    {
                                        map: {
                                            layout: 'column',
                                            elements: [
                                                {
                                                    layout: 'row',
                                                    elements: [
                                                        {
                                                            value: item => {
                                                                if (item.construction_type === 'var') {
                                                                    return '{{';
                                                                } else if (item.construction_type === 'tag') {
                                                                    return '{%';
                                                                }
                                                            },
                                                        },
                                                        {
                                                            before: '&nbsp;',
                                                            codename: 'codename',
                                                            after: '&nbsp;',
                                                        },
                                                        {
                                                            value: item => {
                                                                if (item.construction_type === 'var') {
                                                                    return '}}';
                                                                } else if (item.construction_type === 'tag') {
                                                                    return '%}';
                                                                }
                                                            },
                                                        },
                                                        {
                                                            before: '&nbsp;&mdash;&nbsp;',
                                                            codename: 'name',
                                                        },
                                                    ],
                                                },
                                                {
                                                    layout: 'row',
                                                    elements: [
                                                        {
                                                            codename: 'construction_type',
                                                            class: ['halfTransparent',],
                                                            dict: {
                                                                var: { string: 'Переменная', },
                                                                tag: { string: 'Шаблонный тег', },
                                                            },
                                                        },
                                                        {
                                                            before: '&nbsp;/&nbsp;',
                                                            codename: 'content_type',
                                                            empty: '',
                                                            class: ['halfTransparent',],
                                                            dict: {
                                                                text: { string: 'Текст', },
                                                                link: { string: 'Ссылка', },
                                                                email: { string: 'Email', },
                                                            },
                                                        },
                                                    ],
                                                },

                                            ],
                                        },
                                    },
                                ],
                                popup: {
                                    label: 'Переменные и теги',
                                    disableClickaway: true,
                                    config: [
                                        {
                                            id: 1,
                                            label: '',
                                            blocks: [
                                                {
                                                    labelPosition: 'left',
                                                    direction: 'row',
                                                    modClass: 'marginBottom20',
                                                    elements: [
                                                        {
                                                            label: 'Название',
                                                            required: true,
                                                            width: 8,
                                                            codename: 'name',
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
                                                            label: 'Кодовое название',
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
                                                    modClass: 'marginBottom20',
                                                    elements: [
                                                        {
                                                            widget: 'select',
                                                            label: 'Тип конструкции',
                                                            width: 6,
                                                            codename: 'construction_type',
                                                            options: [
                                                                {
                                                                    id: 'var',
                                                                    name: 'Переменная',
                                                                },
                                                                {
                                                                    id: 'tag',
                                                                    name: 'Шаблонный тег',
                                                                },
                                                            ],
                                                        },
                                                    ],
                                                },
                                                {
                                                    labelPosition: 'left',
                                                    direction: 'row',
                                                    modClass: 'marginBottom20',
                                                    show: false,
                                                    elements: [
                                                        {
                                                            widget: 'select',
                                                            label: 'Тип содержимого',
                                                            width: 6,
                                                            codename: 'content_type',
                                                            options: [
                                                                {
                                                                    id: 'text',
                                                                    name: 'Текст',
                                                                },
                                                                {
                                                                    id: 'link',
                                                                    name: 'Ссылка',
                                                                },
                                                                {
                                                                    id: 'email',
                                                                    name: 'Email',
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
                                                            widget: 'select',
                                                            show: false,
                                                            multi: true,
                                                            label: 'Способы отправки',
                                                            width: 8,
                                                            codename: 'channels',
                                                            api: 'channels',
                                                            params: {
                                                                order_by: 'name',
                                                            },
                                                            blocked: true,
                                                            required: true,
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
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                label: 'Комментарий',
                                height: 80,
                                width: 12,
                                codename: 'comment',
                                widget: 'textarea',
                            },
                        ],
                    },
                ],
            },
        ],
    },
    activeFlag: {
        actions: {
            title: 'Активный тип уведомлений',
            hint: 'Уведомления неактивного типа игнорируются и не отправляются',
        },
    },
};

export default { state, };