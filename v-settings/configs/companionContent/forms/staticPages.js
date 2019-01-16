

const state = {
    formsOptions: {
        'static-pages': [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                invalid: false,
                blocks: [
                    {
                        labelPosition: 'left',
                        direction: 'row',
                        modClass: 'marginBottom22',
                        elements: [
                            {
                                type: 'field',
                                label: 'Название',
                                required: true,
                                invalid: false,
                                width: 12,
                                codename: 'name',
                                widget: 'simpleInput',

                                hint: ''
                            },
                        ]
                    },
                ]
            },
        ],
    },
    additionalFormsInterface: {
        'static-pages': {
            isDynamicForm: 'static-page-settings'
        },
    }
};

export default {
    state
}