const state = {
    postEditor: {
        default: {
            blocks: [
                {
                    name: 'Полноразмерная (по ширине экрана)',
                    columns: ['100%', '50%:50%']
                },
                {
                    name: 'Широкая',
                    columns: ['8', '4:4', '2:2:2:2', '3:2:3']
                },
                {
                    name: 'Узкая',
                    columns: ['6', '3:3']
                },
            ]
        },
    }
};

export default {
    state
}