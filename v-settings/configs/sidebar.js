const state = {
    sidebarConfig: [
        {
            name: 'Публикации',
            'sub-headers': [
                {
                    name: 'Новости',
                    view: 'news',
                    formsName: 'Новость #',
                    newFormName: 'Новая новость',
                    hasAddButton: true
                },
                {
                    name: 'Анонсы событий',
                    view: 'event-announcements',
                    formsName: 'Анонс события #',
                    newFormName: 'Новый анонс события',
                    hasAddButton: true
                },
            ]
        },
    ],
};


const getters = {
    sidebarListInterfaceName: state => (payload) => {
        for (let i = 0; i < state.sidebarConfig.length; i++) {
            let node = state.sidebarConfig[i];
            for (let j = 0; j < node['sub-headers'].length; j++) {
                if (node['sub-headers'][j].view === payload.params.view)
                    return node.name + ' / ' + node['sub-headers'][j].name
            }
        }
        return 'Hеизвестный раздел'
    },

    sidebarFormsInterfaceName: state => (payload) => {
        for (let i = 0; i < state.sidebarConfig.length; i++) {
            let node = state.sidebarConfig[i];
            for (let j = 0; j < node['sub-headers'].length; j++) {
                if (node['sub-headers'][j].view === payload.params.view) {
                    if (payload.params.id === 'add')
                        return node.name + ' / ' + node['sub-headers'][j].newFormName;
                    else if (payload.params.id !== 'add')
                        return node.name + ' / ' + node['sub-headers'][j].formsName;
                }
            }
        }
        return 'Неизвестный раздел'
    },
};


export default {
    state,
    getters,
}