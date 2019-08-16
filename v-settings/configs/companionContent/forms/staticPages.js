import vue from 'vue';

const dict = {
    'event-announcements': 'Анонс события',
    reports: 'Репортаж о событии',
    persons: 'Статья о жителе Амурска',
    history: 'Историческая статья',
    places: 'Статья о месте',
    'city-guides': 'Гид по городу',
    specials: 'Спецпроект',
};

const valuesForIndex = [
    {
        id: 'event-announcements',
        name: 'Анонс события',
    },
    {
        id: 'reports',
        name: 'Репортаж о событии',
    },
    {
        id: 'history',
        name: 'Историческая статья',
    },
    {
        id: 'persons',
        name: 'Статья о жителе Амурска',
    },
    {
        id: 'places',
        name: 'Статья о месте',
    },
    {
        id: 'city-guides',
        name: 'Гид по городу',
    },
    {
        id: 'specials',
        name: 'Спецпроект',
    },
];

const twoSelectorStructure = [
    {
        type: 'vertical_list',
        list: [
            {
                requiredValue: 'item.title',
            },
            {
                requiredValue: 'entity',
                isTransparent: true,
                value: dict,
            },
        ],
    },
];

const state = {
    formsOptions: {
        'static-pages': [
            {
                id: 1,
                title: 'КОНТЕНТ',
                renderCondition: {
                    flag: 'codename',
                    value: ['index', 'events-index', 'history-list', 'places-list', 'persons-list', 'reports-list',],
                },  
                blocks: [
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        hasWideLabel: true,
                        elements: [
                            {
                                type: 'field',
                                label: 'Избранные материалы',
                                popupLabels: {
                                    new: 'Публикация в топе',
                                    existing: 'Публикация в топе',
                                },
                                dragOrder: 'weight',
                                isDraggable: true,
                                widget: 'childEntity',
                                codename: 'top_items',
                                requireSendId: true,
                                hint: '',
                                entity_structure: twoSelectorStructure,
                                popup_structure: [
                                    {
                                        id: 1,
                                        blocks: [
                                            {
                                                labelPosition: 'top',
                                                modClass: 'marginBottom20',
                                                direction: 'row',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Тип материала',
                                                        width: 6,
                                                        widget: 'singleSelector',
                                                        codename: 'entity',
                                                        required: true,
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
                                                        hint: '',
                                                        available_values: valuesForIndex,
                                                        returnFromAvailableValues: 'id',
                                                    },
                                                ],
                                            },
                                            {
                                                labelPosition: 'top',
                                                modClass: 'marginBottom20',
                                                direction: 'row',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Анонс события',
                                                        width: 12,
                                                        required: true,
                                                        isBlocked: false,
                                                        widget: 'singleSelector',
                                                        sortFlag: {
                                                            value: 'id',
                                                            direction: 'desc',
                                                        },
                                                        view_structure: [
                                                            {
                                                                value: 'title',
                                                                flex: 1.5,
                                                            },
                                                        ],
                                                        hint: '',
                                                        api_route: 'event-announcements',
                                                        codename: 'item',
                                                    },
                                                ],
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
                id: 98,
                title: 'ИНФОРМАЦИЯ',
                renderCondition: {
                    flag: 'codename',
                    value: [
                        'events-index',
                        'events-list-future',
                        'events-list-past',
                        'history-list',
                        'places-list',
                        'persons-list',
                        'reports-list',
                        'specials-list',
                        'policy',
                        'news-list',
                    ],
                },  
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom20',
                        elements: [
                            {
                                type: 'field',
                                label: 'Название страницы',
                                width: 12,
                                codename: 'name',
                                widget: 'simpleInput',
                                hint: '',
                                isBlocked: true,
                            },
                        ],
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Кодовое название',
                                width: 4,
                                codename: 'codename',
                                widget: 'simpleInput',
                                hint: '',
                                isBlocked: true,
                            },
                        ],
                    },
                ],
            },
        ],
    },
    additionalFormsInterface: {
        'static-pages': {
            isDynamicForm: 'static-page-settings',
        },
    },
    formsEvents: {
        'static-pages': {
            onChangePopup: {
                top_items: {
                    entity: {
                        item: function (from, widget, data) {
                            let selector = widget.popup_structure[0].blocks[1].elements[0];

                            if (data[from]) {
                                vue.set(selector, 'isBlocked', false);
                                vue.set(selector, 'api_route', data[from]);
                                vue.set(selector, 'label', dict[data[from]]);
                            }

                            vue.set(selector, 'resetFlag', true);
                        },
                    },
                    item: {
                        item: function (from, widget, data) {
                            vue.set(data, 'object_id', data.item);
                        },
                    },
                },
            },
        },
    },
};

export default {
    state,
};