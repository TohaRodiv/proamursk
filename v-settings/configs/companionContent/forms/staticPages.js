const state = {
    formsOptions: {
        'static-pages': [
            {
                id: 98,
                title: 'КОНТЕНТ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                isBlocked: true,
                                type: 'field',
                                label: 'Коднейм',
                                width: 12,
                                codename: 'codename',
                                widget: 'simpleInput',
                                hint: '',
                                controlFlag: {
                                    toBeChecked: 'codename',
                                    value: 'places',
                                    flag: 'isPlaces'
                                }
                            }
                        ]
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        hasWideLabel: true,
                        elements: [
                            {
                                type: 'field',
                                // isBlocked: true,
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
                                                requiredValue: 'object_id'
                                            },
                                            {
                                                requiredValue: 'codename',
                                                isTransparent: true
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
                                                        available_values: [
                                                            {
                                                                value: 'event-announcements',
                                                                codename: 'event',
                                                                name: 'Анонс события',
                                                                id: 1
                                                            },
                                                            {
                                                                value: 'reports',
                                                                codename: 'report',
                                                                name: 'Репортаж о событии',
                                                                id: 2
                                                            },
                                                            {
                                                                value: 'persons',
                                                                codename: 'person',
                                                                name: 'Статьи о людях',
                                                                id: 3
                                                            },
                                                            {
                                                                value: 'history',
                                                                codename: 'history',
                                                                name: 'Историческая статья',
                                                                id: 4
                                                            },
                                                            {
                                                                value: 'places',
                                                                codename: 'place',
                                                                name: 'Гид по городу',
                                                                id: 5
                                                            },
                                                        ]
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
                                                        label: 'Спецпроект',
                                                        width: 12,
                                                        required: true,
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
            onChange: {
                top_items: {
                    top_items: function (from, widget, formsData) {
                        // let loader = widget.popup_structure[0].blocks[0].elements[0];
                        // if (from === 'codename') {
                        //     if (formsData[''])
                        //     vue.set(widget, 'api_route', formsData['top_items'][0]['codename'])
                        //     if (formsData[from] === 'format_3x2') {
                        //         // vue.set(loader, 'image', {width: 1720, height: 1144});
                        //         vue.set(widget, 'isBlocked', false);
                        //     } else if (formsData[from] === 'format_2x1') {
                        //         // vue.set(loader, 'image', {width: 1720, height: 860});
                        //         vue.set(widget, 'isBlocked', false);
                        //     } else if (formsData[from] === null) {
                        //         vue.set(widget, 'isBlocked', true);
                        //     }
                        // }
                        // console.log('Что-то изменилось')
                    },
                },
            },
        },
    },
};

export default {
    state
}