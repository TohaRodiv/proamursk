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
                {
                    name: 'Репортажи о событиях',
                    view: 'reports',
                    formsName: 'Репортаж о событии #',
                    newFormName: 'Новый репортаж о событии',
                    hasAddButton: true
                },
                {
                    name: 'Киноанонсы',
                    view: 'films',
                    formsName: 'Киноанонс #',
                    newFormName: 'Новый киноанонс',
                    hasAddButton: true
                },
                {
                    name: 'Исторические статьи',
                    view: 'history',
                    formsName: 'Историческая статья #',
                    newFormName: 'Новая историческая статья',
                    hasAddButton: true
                },
                {
                    name: 'Cтатьи о людях',
                    view: 'persons',
                    formsName: 'Cтатья о людях #',
                    newFormName: 'Новая статья о людях',
                    hasAddButton: true
                },
                {
                    name: 'Гиды по городу',
                    view: 'city-guides',
                    formsName: 'Гид по городу #',
                    newFormName: 'Новый гид по городу',
                    hasAddButton: true
                },
            ]
        },
        {
            name: 'Сопутствующий контент',
            'sub-headers': [
                {
                    name: 'Слайдеры',
                    view: 'sliders',
                    formsName: 'Слайдер #',
                    newFormName: 'Новый слайдер',
                    hasAddButton: true
                }
            ]
        },
        {
            name: 'Реклама',
            'sub-headers': [
                {
                    name: 'Баннеры-растяжки',
                    view: 'wide-banners',
                    formsName: 'Баннер-растяжка #',
                    newFormName: 'Новый баннер-растяжка',
                    hasAddButton: true
                },
                {
                    name: 'Баннеры для сайдбара',
                    view: 'sidebar-banners',
                    formsName: 'Баннер для сайдабара #',
                    newFormName: 'Новый баннер для сайдбара',
                    hasAddButton: true
                }
            ]
        },
        {
            name: 'Информирование',
            'sub-headers': [
                {
                    name: 'Шаблоны уведомлений',
                    view: 'notification-templates',
                    formsName: 'Шаблон уведомлений #',
                    newFormName: 'Новый шаблон уведомлений',
                    hasAddButton: true
                },
                {
                    name: 'Получатели уведомлений',
                    view: 'recipients',
                    formsName: 'Получатель уведомлений #',
                    newFormName: 'Новый получатель уведомлений',
                    hasAddButton: true
                },
                {
                    name: 'События для уведомлений',
                    view: 'events',
                    formsName: 'Событие для уведомления #',
                    newFormName: 'Новое событие для уведомления',
                    hasAddButton: true
                },
            ]
        },
        {
            name: 'Учетные записи',
            'sub-headers': [
                {
                    name: 'Пользователи',
                    view: 'users',
                    formsName: 'Пользователь #',
                    newFormName: 'Новый пользователь',
                    hasAddButton: true
                },
                {
                    name: 'Роли',
                    view: 'user-roles',
                    formsName: 'Роль #',
                    newFormName: 'Новая роль',
                    hasAddButton: true
                },
            ]
        },
        {
            name: 'Настройки',
            'sub-headers': [
                {
                    name: 'Общие настройки сервиса',
                    view: 'settings',
                    formsName: 'Общие настройки сервиса',
                    newFormName: 'Общие настройки сервиса',
                    hasAddButton: false,
                    onlyForm: true
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