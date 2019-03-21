import vue from 'vue'

const valuesForItems = [
    {
        id: 'hotel',
        name: 'Где остановиться?'
    },
    {
        id: 'food',
        name: 'Где поесть?'
    },
    {
        id: 'activities',
        name: 'Что посмотреть?'
    },
    {
        id: 'transport',
        name: 'Как перемещаться по городу?'
    },
    {
        id: 'phones',
        name: 'Полезные телефоны'
    }
]


const state = {
    formsOptions: {
        'city-guides': [
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
                                invalid: false,
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
                                invalid: false,
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
                                label: 'Показать в сайдбаре два узких рекламных баннера вместо одного большого',
                                codename: 'show_two_banners',
                                widget: 'singleCheckbox',
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
                                height: 80,
                                codename: 'comment',
                                widget: 'textarea',
                                hint: ''
                            }
                        ]
                    },
                ]
            },
            {
                id: 98,
                title: 'КОНТЕНТ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom36',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Формат контента',
                                width: 12,
                                widget: 'singleSelector',
                                codename: 'guide_format',
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
                                available_values: valuesForItems,
                                returnFromAvailableValues: 'id'
                            }
                        ]
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        hasWideLabel: true,
                        elements: [
                            {
                                show: false,
                                isBlocked: true,
                                type: 'field',
                                label: 'Места',
                                popupLabels: {
                                    new: 'Место в гиде по городу',
                                    existing: 'Место в гиде по городу',
                                },
                                dragOrder: 'weight',
                                required: false,
                                invalid: false,
                                isDraggable: true,
                                widget: 'childEntity',
                                codename: 'items',
                                requireSendId: true,
                                hint: '',
                                disableClickaway: true,
                                entity_structure: [
                                    {
                                        type: 'vertical_list',
                                        list: [
                                            {
                                                requiredValue: 'title'
                                            }
                                        ]
                                    },
                                ],
                                popup_structure: [
                                    {
                                        id: 1,
                                        blocks: [
                                            {
                                                labelPosition: 'left',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Название',
                                                        width: 12,
                                                        widget: 'simpleInput',
                                                        codename: 'title',
                                                        required: true,
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
                                                        label: 'Описание',
                                                        width: 12,
                                                        height: 140,
                                                        widget: 'textarea',
                                                        codename: 'description',
                                                        required: true,
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
                                                        type: 'field',
                                                        label: 'Материал об этом месте',
                                                        width: 12,
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
                                                        api_route: 'places',
                                                        codename: 'place',
                                                        returnFromAvailableValues: 'id'
                                                    }
                                                ]
                                            },

                                            // Где остановиться?
                                            // index: 3
                                            {
                                                labelPosition: 'left',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                show: false,
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Одноместный номер',
                                                        width: 6,
                                                        widget: 'simpleInput',
                                                        codename: 'single_room_price',
                                                        hint: ''
                                                    }
                                                ]
                                            },
                                            // index: 4
                                            {
                                                labelPosition: 'left',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                show: false,
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Номер люкс',
                                                        width: 6,
                                                        widget: 'simpleInput',
                                                        codename: 'luxury_room_price',
                                                        hint: ''
                                                    }
                                                ]
                                            },
                                            // index: 5
                                            {
                                                labelPosition: 'left',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                show: false,
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Питание',
                                                        width: 6,
                                                        widget: 'simpleInput',
                                                        codename: 'nutrition_info',
                                                        hint: ''
                                                    }
                                                ]
                                            },

                                            // Где поесть?
                                            // index: 6
                                            {
                                                labelPosition: 'left',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                show: false,
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Кухня',
                                                        width: 6,
                                                        widget: 'simpleInput',
                                                        codename: 'kitchen',
                                                        hint: ''
                                                    }
                                                ]
                                            },
                                            // index: 7
                                            {
                                                labelPosition: 'left',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                show: false,
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Средний чек',
                                                        width: 6,
                                                        widget: 'simpleInput',
                                                        codename: 'avg_value',
                                                        hint: ''
                                                    }
                                                ]
                                            },
                                            // index: 8
                                            {
                                                labelPosition: 'left',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                show: false,
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Входной билет',
                                                        width: 6,
                                                        widget: 'simpleInput',
                                                        codename: 'enter_price',
                                                        hint: ''
                                                    }
                                                ]
                                            },
                                            // index: 9
                                            {
                                                labelPosition: 'left',
                                                modClass: 'marginBottom22',
                                                direction: 'row',
                                                show: false,
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Время работы',
                                                        width: 10,
                                                        widget: 'simpleInput',
                                                        codename: 'work_time',
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
                                                        label: 'Телефон',
                                                        width: 4,
                                                        widget: 'simpleInput',
                                                        codename: 'phone',
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
                                                        label: 'Ссылка на сайт',
                                                        width: 8,
                                                        widget: 'simpleInput',
                                                        codename: 'site',
                                                        hint: '',
                                                        placeholder: 'http(s)://'
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
                                                        label: 'Профиль в Instagram',
                                                        width: 8,
                                                        widget: 'simpleInput',
                                                        codename: 'instagram',
                                                        hint: '',
                                                        placeholder: 'http(s)://'
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
                                                        label: 'Адрес, отображаемый на сайте',
                                                        width: 8,
                                                        required: true,
                                                        widget: 'simpleInput',
                                                        codename: 'address',
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
                                                        label: 'Точка на карте',
                                                        widget: 'geoinput',
                                                        codename: 'coordinates',
                                                        width: 12,
                                                        hint: '',
                                                        defaultCoordinates: '50.2368500, 136.8813600'
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
                                                        label: 'Слайдер',
                                                        width: 12,
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
                                                        api_route: 'sliders',
                                                        codename: 'slider',
                                                        returnFromAvailableValues: 'id'
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
                                                        inputID: 'cityGuidesCoverInput',
                                                        dragID: 'cityGuidesCoverDrag',
                                                        label: 'Изображение',
                                                        expected_value: 'medium_url',
                                                        width: 12,
                                                        image: {
                                                            width: 1720,
                                                            height: 1144,
                                                        },
                                                        codename: 'cover',
                                                        widget: 'singleImageLoader',
                                                        requireSendId: true,
                                                        key_attr: 'id',
                                                        hint: ''
                                                    },
                                                ]
                                            },
                                            {
                                                labelPosition: 'left',
                                                direction: 'row',
                                                modClass: 'marginBottom50',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Подпись к изображению',
                                                        width: 12,
                                                        height: 80,
                                                        codename: 'cover_description',
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
                                                        label: 'Активное место (неактивные места не отображаются на сайте)',
                                                        codename: 'is_active',
                                                        widget: 'singleCheckbox',
                                                        hint: '',
                                                        marginLeft: true
                                                    }
                                                ]
                                            },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: 4,
                title: 'SEO и OG',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Заголовок страницы (title / og:title)',
                                required: false,
                                invalid: false,
                                width: 12,
                                codename: 'meta_title',
                                widget: 'simpleInput',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Описание страницы<br>(description / og:description)',
                                required: false,
                                invalid: false,
                                width: 12,
                                codename: 'meta_description',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom22',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Ключевые слова, через запятую (keywords)',
                                required: false,
                                invalid: false,
                                width: 12,
                                codename: 'meta_keywords',
                                widget: 'textarea',
                                hint: ''
                            },
                        ]
                    },
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                inputID: 'cityGuidesCoverInputOG',
                                dragID: 'cityGuidesCoverDragOG',
                                label: 'Обложка для социальных сетей (og:image)',
                                expected_value: 'medium_url',
                                required: false,
                                width: 12,
                                image: {
                                    width: 1200,
                                    height: 630,
                                },

                                codename: 'og_image',
                                widget: 'singleImageLoader',
                                requireSendId: true,
                                key_attr: 'id',
                                hint: ''
                            },
                        ]
                    },
                ]
            }
        ],
    },
    activeFlag: {
        'city-guides': {
            title: 'Активная запись',
            hint: 'Страницы неактивных записей не отображаются на сайте',
        }
    },
    formsEvents: {
        'city-guides': {
            onChange: {
                guide_format: {
                    items: function (from, widget, formsData) {
                        let single_room_price = widget.popup_structure[0].blocks[3]
                        let luxury_room_price = widget.popup_structure[0].blocks[4]
                        let nutrition_info = widget.popup_structure[0].blocks[5]
                        let kitchen = widget.popup_structure[0].blocks[6]
                        let avg_value = widget.popup_structure[0].blocks[7]
                        let enter_price = widget.popup_structure[0].blocks[8]
                        let work_time = widget.popup_structure[0].blocks[9]
                        if (formsData[from] == 'hotel') {
                            vue.set(widget, 'isBlocked', false)
                            vue.set(single_room_price, 'show', true)
                            vue.set(luxury_room_price, 'show', true)
                            vue.set(nutrition_info, 'show', true)
                            vue.set(kitchen, 'show', false)
                            vue.set(avg_value, 'show', false)
                            vue.set(enter_price, 'show', false)
                            vue.set(work_time, 'show', false)
                            vue.set(widget, 'show', true)
                        } else if (formsData[from] == 'food') {
                            vue.set(widget, 'isBlocked', false)
                            vue.set(single_room_price, 'show', false)
                            vue.set(luxury_room_price, 'show', false)
                            vue.set(nutrition_info, 'show', false)
                            vue.set(kitchen, 'show', true)
                            vue.set(avg_value, 'show', true)
                            vue.set(enter_price, 'show', true)
                            vue.set(enter_price.elements[0], 'width', 6)
                            vue.set(work_time, 'show', true)
                            vue.set(widget, 'show', true)
                        } else if (formsData[from] == 'activities') {
                            vue.set(widget, 'isBlocked', false)
                            vue.set(single_room_price, 'show', false)
                            vue.set(luxury_room_price, 'show', false)
                            vue.set(nutrition_info, 'show', false)
                            vue.set(kitchen, 'show', false)
                            vue.set(avg_value, 'show', false)
                            vue.set(enter_price, 'show', true)
                            vue.set(enter_price.elements[0], 'width', 4)
                            vue.set(work_time, 'show', true)
                            vue.set(widget, 'show', true)
                        } else if (formsData[from] == 'transport') {
                            vue.set(widget, 'show', false)
                        } else if (formsData[from] == 'phone') {
                            vue.set(widget, 'show', false)
                        } else {
                            vue.set(widget, 'show', false)
                        }
                    }
                }
            }
        }
    }
};

export default {
    state
}