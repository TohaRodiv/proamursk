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
        id: 'event-announcements',
        name: 'Анонс события'
    },
    {
        id: 'reports',
        name: 'Репортаж о событии'
    },
    {
        id: 'history',
        name: 'Историческая статья'
    },
    {
        id: 'persons',
        name: 'Статья о жителе Амурска'
    },
    {
        id: 'places',
        name: 'Статья о месте'
    },
    {
        id: 'city-guides',
        name: 'Гид по городу'
    },
    {
        id: 'specials',
        name: 'Спецпроект'
    },
]

const valuesForEvents = [
    {
        id: 'event-announcements',
        name: 'Анонс события'
    },
    {
        id: 'reports',
        name: 'Репортаж о событии'
    },
]

const valuesForPlaces = [
    {
        id: 'places',
        name: 'Статья о месте',
        isDefault: true
    }
]

const valuesForPersons = [
    {
        id: 'persons',
        name: 'Статья о жителе Амурска',
        isDefault: true
    }
]

const valuesForHistory = [
    {
        id: 'history',
        name: 'Историческая статья',
        isDefault: true
    }
]

const valuesForReports = [
    {
        id: 'reports',
        name: 'Репортаж о событии',
        isDefault: true
    }
]

const twoSelectorScructure = [
    {
        type: 'vertical_list',
        list: [
            {
                requiredValue: 'item.title'
            },
            {
                requiredValue: 'entity',
                isTransparent: true,
                value: dict
            }
        ]
    },
]

const oneSelectorScructure = [
    {
        type: 'vertical_list',
        list: [
            {
                requiredValue: 'item.title'
            }
        ]
    },
]


const state = {
    formsOptions: {
        'static-pages': [
            {
                id: 98,
                title: 'КОНТЕНТ',
                renderConditions: [
                    {
                        codename: 'codename',
                        values: ['index', 'events-index', 'history-list', 'places-list', 'persons-list', 'reports-list']
                    }
                ],
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
                                entity_structure: twoSelectorScructure,
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
                                                        codename: 'entity',
                                                        required: true,
                                                        sortFlag: {
                                                            value: 'id',
                                                            direction: 'asc'
                                                        },
                                                        view_structure: [
                                                            {
                                                                value: 'name',
                                                                flex: 1.5,
                                                            },
                                                        ],
                                                        hint: '',
                                                        available_values: valuesForIndex,
                                                        returnFromAvailableValues: 'id'
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
                                                        isBlocked: false,
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
                                                        codename: 'item'
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
                    entity: {
                        item: function (from, widget, data) {
                            let selector = widget.popup_structure[0].blocks[1].elements[0]
                            let list = widget.entity_structure[0].list[0]
                            if (data[from]) {
                                vue.set(selector, 'isBlocked', false)
                                vue.set(selector, 'api_route', data[from])
                                vue.set(selector, 'label', dict[data[from]])
                            } else {
                                // vue.set(selector, 'isBlocked', true)
                            }
                            // Заготовка, чтобы можно было отправлять entity, если ничего не выбрано в первом селекторе
                            // try {
                            //     if (data.entity == 'index' || data.entity == 'events-index') {
                            //         vue.set(selector, 'resetFlag', true)
                            //     }
                            // } catch (e) {

                            // }
                            // Сброс данных второго селектора
                            vue.set(selector, 'resetFlag', true)
                            
                        }
                    },
                    item: {
                        item: function (from, widget, data) {
                            // let re = new RegExp('([a-z]+)')
                            // let match
                            // try {
                            //     match = data.item.site_url.match(re)[0]
                            // } catch (e) {
                            //     match = ''
                            // }
                            // vue.set(data, 'entity', match)
                            vue.set(data, 'object_id', data.item.id)
                        }
                    }
                },
            },
            onMount: {
                top_items: function (widget, data) {
                    let firstSelector = widget.popup_structure[0].blocks[0].elements[0]
                    let secondSelector = widget.popup_structure[0].blocks[1].elements[0]
                    if (data['codename'] == 'index') {
                        vue.set(widget.popup_structure[0].blocks[0], 'show', true)
                        vue.set(secondSelector, 'api_route', 'event-announcements')
                        vue.set(secondSelector, 'label', dict['event-announcements'])
                        vue.set(secondSelector, 'isBlocked', true)
                        vue.set(secondSelector, 'required', true)
                        vue.set(firstSelector, 'available_values', valuesForIndex)
                        vue.set(firstSelector, 'required', true)
                        vue.set(widget, 'show', true),
                        vue.set(widget, 'entity_structure', twoSelectorScructure)
                    }
                    else if (data['codename'] == 'events-index') {
                        vue.set(widget.popup_structure[0].blocks[0], 'show', true)
                        vue.set(secondSelector, 'api_route', 'event-announcements')
                        vue.set(secondSelector, 'label', dict['event-announcements'])
                        vue.set(secondSelector, 'isBlocked', true)
                        vue.set(secondSelector, 'required', true)
                        vue.set(firstSelector, 'available_values', valuesForEvents)
                        vue.set(firstSelector, 'required', true)
                        vue.set(widget, 'show', true),
                        vue.set(widget, 'entity_structure', twoSelectorScructure)
                    }
                    else if (data['codename'] == 'history-list') {
                        vue.set(widget.popup_structure[0].blocks[0], 'show', false)
                        vue.set(firstSelector, 'available_values', valuesForHistory)
                        vue.set(firstSelector, 'required', false)
                        vue.set(secondSelector, 'api_route', 'history')
                        vue.set(secondSelector, 'label', dict['history'])
                        vue.set(secondSelector, 'isBlocked', false)
                        vue.set(secondSelector, 'required', true)
                        vue.set(widget, 'show', true)
                        vue.set(widget, 'entity_structure', oneSelectorScructure)
                    }
                    else if (data['codename'] == 'places-list') {
                        vue.set(widget.popup_structure[0].blocks[0], 'show', false)
                        vue.set(firstSelector, 'available_values', valuesForPlaces)
                        vue.set(firstSelector, 'required', false)
                        vue.set(secondSelector, 'api_route', 'places')
                        vue.set(secondSelector, 'label', dict['places'])
                        vue.set(secondSelector, 'isBlocked', false)
                        vue.set(secondSelector, 'required', true)
                        vue.set(widget, 'show', true)
                        vue.set(widget, 'entity_structure', oneSelectorScructure)
                    }
                    else if (data['codename'] == 'persons-list') {
                        vue.set(widget.popup_structure[0].blocks[0], 'show', false)
                        vue.set(firstSelector, 'available_values', valuesForPersons)
                        vue.set(firstSelector, 'required', false)
                        vue.set(secondSelector, 'api_route', 'persons')
                        vue.set(secondSelector, 'label', dict['persons'])
                        vue.set(secondSelector, 'isBlocked', false)
                        vue.set(secondSelector, 'required', true)
                        vue.set(widget, 'show', true)
                        vue.set(widget, 'entity_structure', oneSelectorScructure)
                    }
                    else if (data['codename'] == 'reports-list') {
                        vue.set(widget.popup_structure[0].blocks[0], 'show', false)
                        vue.set(firstSelector, 'available_values', valuesForReports)
                        vue.set(firstSelector, 'required', false)
                        vue.set(secondSelector, 'api_route', 'reports')
                        vue.set(secondSelector, 'label', dict['reports'])
                        vue.set(secondSelector, 'isBlocked', false)
                        vue.set(secondSelector, 'required', true)
                        vue.set(widget, 'show', true)
                        vue.set(widget, 'entity_structure', oneSelectorScructure)
                    }
                    else {
                        vue.set(widget, 'show', false)
                        vue.set(firstSelector, 'required', false)
                        vue.set(secondSelector, 'required', false)
                    }
                }
            }
        },
    },
};

export default {
    state
}