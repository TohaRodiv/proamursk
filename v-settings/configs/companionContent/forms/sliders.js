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
                        modClass: 'marginBottom22',
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
                                label: 'Формат слайдера',
                                codename: 'format',
                                required: true,
                                invalid: false,
                                width: 6,
                                available_values: [
                                    {
                                        name: 'Горизонтальный / 3:2',
                                        codename: 'format_3x2',
                                        id: 'format_3x2'
                                    },
                                    {
                                        name: 'Горизонтальный / 2:1',
                                        codename: 'format_2x1',
                                        id: 'format_2x1'
                                    }
                                ],
                                sortFlag: {
                                    value: 'name',
                                    flex: 1.5
                                },
                                widget: 'singleSelector',
                                hint: '',
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5
                                    },
                                ],
                                blockedCondition: {
                                    type: 'isEmpty',
                                    flag: 'slides'
                                }
                            },
                        ]
                    },
                    {
                        labelPosition: 'top',
                        direction: 'row',
                        hasWideLabel: true,
                        elements: [
                            {
                                type: 'field',
                                isBlocked: true,
                                label: 'Слайды',
                                popupLabels: {
                                    new: 'Слайд в слайдере',
                                    existing: 'Слайд в слайдере',
                                },
                                dragOrder: 'weight',
                                required: false,
                                invalid: false,
                                isDraggable: true,
                                widget: 'childEntity',
                                modClass: 'marginBottom40',
                                codename: 'slides',
                                requireSendId: true,
                                hint: '',
                                entity_structure: [
                                    {
                                        type: 'image',
                                        requiredValue: 'cover.medium_url',
                                        height: '100px',
                                        width: 'auto'
                                    },
                                    {
                                        type: 'text',
                                        requiredValue: 'description',
                                        flex: 1
                                    }
                                ],
                                textOptions: true,
                                popup_structure: [
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
                                                        expected_value: 'medium_url',
                                                        required: true,
                                                        invalid: false,
                                                        width: 12,
                                                        image: {
                                                            width: 1716,
                                                            height: 1144,
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
                                            {
                                                labelPosition: 'top',
                                                direction: 'row',
                                                modClass: 'marginBottom22',
                                                elements: [
                                                    {
                                                        type: 'field',
                                                        label: 'Описание',
                                                        required: false,
                                                        invalid: false,
                                                        width: 12,
                                                        codename: 'description',
                                                        widget: 'simpleInput',
                                                        hint: ''
                                                    },
                                                ]
                                            },
                                            {
                                                labelPosition: 'top',
                                                direction: 'row',
                                                elements: [
                                                    {
                                                        label: 'Активный слайд (Неактивные слайды не отображаются на странице)',
                                                        required: false,
                                                        codename: 'is_active',
                                                        widget: 'singleCheckbox',
                                                        hint: ''
                                                    }
                                                ]
                                            },
                                        ]
                                    },
                                ],
                                rows: [
                                    {
                                        codename: 'cover.medium_url',
                                        widget: 'image',
                                    },
                                    {
                                        codename: 'description',
                                        widget: 'field',
                                    },
                                ]
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
                ]
            },
        ],
    },
    formsEvents: {
        sliders: {
            onChange: {
                format: {
                    slides: function (from, widget, formsData) {
                        let loader = widget.popup_structure[0].blocks[0].elements[0];
                        if (from === 'format') {
                            if (formsData[from] === 'format_3x2') {
                                vue.set(loader, 'image', {width: 1716, height: 1144});
                                vue.set(widget, 'isBlocked', false);
                            } else if (formsData[from] === 'format_2x1') {
                                vue.set(loader, 'image', {width: 1716, height: 858});
                                vue.set(widget, 'isBlocked', false);
                            } else if (formsData[from] === null) {
                                vue.set(widget, 'isBlocked', true);
                            }
                        }
                    },
                },
            },
        },
    },
};

export default {
    state
}