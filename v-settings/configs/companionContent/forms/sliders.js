
const state = {
    formsOptions: {
        'sliders': [
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
                                // controlFlag: [
                                //     {
                                //         toBeChecked: 'codename',
                                //         value: 'format_3x2',
                                //         flag: 'is3x2'
                                //     },
                                //     {
                                //         toBeChecked: 'codename',
                                //         value: 'format_2x1',
                                //         flag: 'is2x1'
                                //     },
                                // ],
                                label: 'Формат слайдера',
                                codename: 'format',
                                required: true,
                                invalid: false,
                                width: 6,
                                available_values: [
                                    {
                                        name: 'Легковые шины',
                                        codename: 'simple_tire',
                                    },
                                    {
                                        name: 'Грузовые шины',
                                        codename: 'truck_tire',
                                    },
                                    {
                                        name: 'Легковые диски',
                                        codename: 'simple_rim',
                                    },
                                ],
                                sortFlag: {
                                    value: 'name',
                                    flex: 1.5
                                },
                                widget: 'singleSelector',
                                hint: '',
                                values: [
                                    {
                                        codename: 'format_3x2',
                                        name: 'Формат 3х2',
                                        value: 'Любое'
                                    },
                                    {
                                        codename: 'format_2x1',
                                        name: 'Формат 2х1',
                                        value: 'Любое'
                                    }
                                ],
                                view_structure: [
                                    {
                                        value: 'name',
                                        flex: 1.5
                                    },
                                ]
                            }
                        ]
                    },
                    
                ]
            },
        ],
    },
};

export default {
    state
}