

const state = {
    formsOptions: {
        'user-roles': [
            {
                id: 1,
                title: 'ИНФОРМАЦИЯ',
                blocks: [
                    {
                        labelPosition: 'left',
                        modClass: 'marginBottom50',
                        direction: 'row',
                        elements: [
                            {
                                label: 'Название',
                                required: true,
                                width: 8,
                                codename: 'name',
                                widget: 'input',
                            },
                        ],
                    },
                    {
                        elements: [
                            {
                                widget: 'rights',
                                codename: 'permissions',
                                sections: [],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

export default {
    state,
};