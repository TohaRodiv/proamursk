import EventBus from '../../../../cp_vue/frontend/vue/EventBus';
import api from '../../../../cp_vue/frontend/vue/store/utils/api';

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
                                type: 'field',
                                label: 'Название',
                                required: true,
                                width: 12,
                                codename: 'name',
                                widget: 'simpleInput',
                                hint: '',
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom40',
                        elements: [
                            {
                                type: 'field',
                                label: 'Кодовое название',
                                required: true,
                                width: 5,
                                codename: 'codename',
                                widget: 'simpleInput',
                                hint: '',
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
                                label: 'Переменные и теги',
                                popupLabels: {
                                    new: 'Переменные и теги',
                                    existing: 'Переменные и теги',
                                },
                                dragOrder: 'weight',
                                isDraggable: true,
                                codename: 'variables',
                                widget: 'childEntity',
                                modClass: 'marginBottom50',
                                requireSendId: true,
                                hint: '',
                                entity_structure: [
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
                                                        // {
                                                        //     before: '&nbsp;/&nbsp;',
                                                        //     codename: 'channel',
                                                        //     empty: '',
                                                        //     class: ['halfTransparent',],
                                                        // },
                                                    ],
                                                },
                                                
                                            ],
                                        },
                                    },
                                ],
                                popup_structure: [
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
                                                        type: 'field',
                                                        label: 'Название',
                                                        required: true,
                                                        width: 8,
                                                        codename: 'name',
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
                                                        label: 'Кодовое название',
                                                        required: true,
                                                        width: 4,
                                                        codename: 'codename',
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
                                                        label: 'Тип конструкции',
                                                        required: true,
                                                        width: 6,
                                                        widget: 'singleSelector',
                                                        sortFlag: {
                                                            value: 'name',
                                                            direction: 'asc',
                                                        },
                                                        codename: 'construction_type',
                                                        view_structure: [
                                                            {
                                                                value: 'name',
                                                                flex: 1.5,
                                                            },
                                                        ],
                                                        available_values: [
                                                            {
                                                                id: 'var',
                                                                name: 'Переменная',
                                                            },
                                                            {
                                                                id: 'tag',
                                                                name: 'Шаблонный тег',
                                                            },
                                                        ],
                                                        returnFromAvailableValues: 'id',
                                                        hint: '',
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
                                                        type: 'field',
                                                        label: 'Тип содержимого',
                                                        required: false,
                                                        width: 6,
                                                        widget: 'singleSelector',
                                                        returnOnly: 'codename',
                                                        sortFlag: {
                                                            value: 'name',
                                                            direction: 'asc',
                                                        },
                                                        codename: 'content_type',
                                                        view_structure: [
                                                            {
                                                                value: 'name',
                                                                flex: 1.5,
                                                            },
                                                        ],
                                                        available_values: [
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
                                                        hint: '',
                                                        returnFromAvailableValues: 'id',
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
                                                        type: 'shortTag',
                                                        label: 'Способы отправки',
                                                        required: false,
                                                        width: 8,
                                                        widget: 'multipleSelector',
                                                        codename: 'channels',
                                                        // callbackType: 'idArray',
                                                        sortFlag: {
                                                            value: 'id',
                                                            direction: 'asc',
                                                        },
                                                        view_structure: [
                                                            {
                                                                value: 'name',
                                                                flex: 1.5,
                                                            },
                                                        ],
                                                        api_route: 'channels',
                                                        hint: '',
                                                        expected_value: 'channels',
                                                        key_attr: 'channels',
                                                        returnWhole: true,
                                                        onlyFull: true,
                                                        returnFull: true,
                                                        isBlocked: true,
                                                    },
                                                ],
                                            },
                                        ],
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
                                height: 80,
                                width: 12,
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
    activeFlag: {
        actions: {
            title: 'Активный тип уведомлений',
            hint: 'Уведомления неактивного типа игнорируются и не отправляются',
        },
    },
    formsEvents: {
        actions: {
            onChangePopup: {
                variables: {
                    construction_type: {
                        async content_type(from, widget, data, component) {
                            const constructionType = data[from];
                            const contentTypeConfig = widget.popup_structure[0].blocks[3];

                            if (constructionType == 'var') {
                                component.$set(contentTypeConfig, 'show', true);
                                component.$set(contentTypeConfig.elements[0], 'required', true);
                            } else {
                                component.$set(contentTypeConfig, 'show', false);
                                component.$set(contentTypeConfig.elements[0], 'required', false);

                                // Проверка
                                const codename = 'channels';
                                const url = `/${ codename }/select/`;

                                try {
                                    
                                    const { items: channels, } = await api.get(url);
                                
                                    if (channels.length === 1) {
                                        EventBus.$emit('SET_DATA_INTO_WIDGET', { codename, data: channels, });
                                    } else if (channels.length > 1) {
                                        component.$set(contentTypeConfig.elements[0], 'isBlocked', false);
                                    }
                                } catch (error) {
                                    EventBus.$emit('SET_ERROR', { url, error, });
                                }
                            }
                        },
                        channel(from, widget, data, component) {
                            const constructionType = data[from];
                            const channelConfig = widget.popup_structure[0].blocks[4];

                            if (constructionType == 'tag') {
                                component.$set(channelConfig, 'show', true);
                            } else {
                                component.$set(channelConfig, 'show', false);
                            }
                        },
                    },
                },
            },
        },
    },
};

export default { state, };