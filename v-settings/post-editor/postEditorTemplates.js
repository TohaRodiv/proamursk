const state = {
    postEditor: {
        default: {
            sections: [
                {
                    name: 'Полноразмерная (по ширине экрана)',
                    columns: ['100%', '50%:50%']
                },
                {
                    name: 'Широкая',
                    columns: ['8', '4:4', '2:2:2:2', '3:2:3', '3:3:2', '2:1:5']
                },
                {
                    name: 'Узкая',
                    columns: ['6', '3:3']
                },
            ],
            sectionConfigs: {
                hasMargins: true,
                hasPaddings: true,
                hasHorizontalMargin: true,
            },

            widgets: [
                {
                    type: 'text',
                    available: [6, 4, 3],
                },
                {
                    type: 'image',
                    available: [8, 6, 4, 3],
                },
                {
                    type: 'hr',
                    available: [8, 6, 4, 3],
                },
                {
                    type: 'video',
                    available: [8, 6,],
                },
                {
                    type: 'slider',
                    available: [8],
                },
                {
                    type: 'quote',
                    available: [8],
                },
                {
                    type: 'direct-speech',
                    available: [8],
                },
                {
                    type: 'instagram',
                    available: [4, 3],
                },
            ],
        },
    },
};

export default {
    state
}