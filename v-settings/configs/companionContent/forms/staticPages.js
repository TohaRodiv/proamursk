import vue from 'vue'

const dict = {
    'event-announcements': 'Анонс события',
    reports: 'Репортаж о событии',
    persons: 'Статья о жителе Амурска',
    history: 'Историческая статья',
    places: 'Статья о месте',
    'city-guides': 'Гид по городу',
    specials: 'Спецпроект'
}

const valuesForIndex = [
    {
        codename: 'event-announcements',
        name: 'Анонс события',
        id: 1
    },
    {
        codename: 'reports',
        name: 'Репортаж о событии',
        id: 2
    },
    {
        codename: 'history',
        name: 'Историческая статья',
        id: 3
    },
    {
        codename: 'persons',
        name: 'Статья о жителе Амурска',
        id: 4
    },
    {
        codename: 'places',
        name: 'Статья о месте',
        id: 5
    },
    {
        codename: 'city-guides',
        name: 'Гид по городу',
        id: 6
    },
    {
        codename: 'specials',
        name: 'Спецпроект',
        id: 7
    },
]

const valuesForEvents = [
    {
        codename: 'event-announcements',
        name: 'Анонс события',
        id: 1
    },
    {
        codename: 'reports',
        name: 'Репортаж о событии',
        id: 2
    }
]


const state = {
    formsOptions: {
        'static-pages': [
            {
                id: 98,
                title: 'КОНТЕНТ',
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
                                required: false,
                                invalid: false,
                                isDraggable: true,
                                widget: 'childEntity',
                                codename: 'top_items',
                                requireSendId: true,
                                hint: '',
                                entity_structure: [
                                    {
                                        type: 'vertical_list',
                                        list: [
                                            {
                                                requiredValue: 'top_items.item.title'
                                            },
                                            {
                                                requiredValue: 'codename',
                                                isTransparent: true,
                                                value: dict
                                            }
                                        ]
                                    },
                                ],
                                popup_structure: [
                                    {
                                        id: 1,
                                        blocks: [
                                            {
                                                labelPosition: 'top',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Тип материала',
                                                        width: 6,
                                                        widget: 'singleSelector',
                                                        codename: 'codename',
                                                        required: true,
                                                        sortFlag: {
                                                            value: 'codename',
                                                            direction: 'asc'
                                                        },
                                                        view_structure: [
                                                            {
                                                                value: 'name',
                                                                flex: 1.5,
                                                            },
                                                        ],
                                                        hint: '',
                                                        available_values: valuesForIndex
                                                    }
                                                ]
                                            },
                                            {
                                                labelPosition: 'top',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Анонс события',
                                                        width: 12,
                                                        required: true,
                                                        isBlocked: true,
                                                        widget: 'singleSelector',
                                                        sortFlag: {
                                                            value: 'id',
                                                            direction: 'asc'
                                                        },
                                                        view_structure: [
                                                            {
                                                                value: 'title',
                                                                flex: 1.5,
                                                            },
                                                        ],
                                                        hint: '',
                                                        api_route: 'event-announcements',
                                                        codename: 'object_id',
                                                        returnFromAvailableValues: 'id'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    additionalFormsInterface: {
        'static-pages': {
            isDynamicForm: 'static-page-settings'
        },
    },
    formsEvents: {
        'static-pages': {
            onChangePopup: {
                top_items: {
                    codename: {
                        object_id: function (from, widget, data) {
                            let selector = widget.popup_structure[0].blocks[1].elements[0]
                            let list = widget.entity_structure[0].list[0]
                            if (data[from]) {
                                vue.set(selector, 'isBlocked', false)
                                vue.set(selector, 'api_route', data[from])
                                vue.set(selector, 'label', dict[data[from]])
                            } else {
                                vue.set(selector, 'isBlocked', true)
                            }
                            // Сброс данных второго селектора
                            vue.set(data, 'object_id', null)
                            vue.set(selector, 'resetFlag', true)
                        }
                    },
                },
            },
            onMount: {
                top_items: function (widget, data) {
                    let firstSelector = widget.popup_structure[0].blocks[0].elements[0]
                    let secondSelector = widget.popup_structure[0].blocks[1].elements[0]
                    if (data['codename'] == 'index') {
                        vue.set(firstSelector, 'available_values', valuesForIndex)
                        vue.set(widget, 'show', true)
                    }
                    else if (data['codename'] == 'index-events') {
                        vue.set(firstSelector, 'available_values', valuesForEvents)
                        vue.set(widget, 'show', true)
                    }
                    else if (data['codename'] == 'history') {
                        vue.set(firstSelector, 'show', false)
                        vue.set(secondSelector, 'api_route', 'history')
                        vue.set(widget, 'show', true)
                    }
                    else if (data['codename'] == 'places') {
                        vue.set(firstSelector, 'show', false)
                        vue.set(secondSelector, 'api_route', 'places')
                        vue.set(widget, 'show', true)
                    }
                    else if (data['codename'] == 'persons') {
                        vue.set(firstSelector, 'show', false)
                        vue.set(secondSelector, 'api_route', 'persons')
                        vue.set(widget, 'show', true)
                    }
                    else {
                        console.log(data)
                        vue.set(widget, 'show', false)
                    }
                }
            }
        },
    },
};

export default {
    state
}