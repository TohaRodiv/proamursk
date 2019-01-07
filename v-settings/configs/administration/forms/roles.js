

const state = {
    formsOptions: {
        'user-roles': [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom47',
                        direction: 'row',
                        elements: [
                            {
                                type: 'field',
                                label: 'Название',
                                required: true,
                                invalid: false,
                                width: 8,
                                codename: 'name',
                                widget: 'simpleInput',
                                hint: '',
                            },
                        ]
                    }
                ]
            },
        ],
    },
};

export default {
    state
}