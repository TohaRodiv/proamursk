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
                    name: 'Статьи о местах',
                    view: 'places',
                    formsName: 'Статья о месте #',
                    newFormName: 'Новая статья о месте',
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
                {
                    name: 'Спецпроекты',
                    view: 'specials',
                    formsName: 'Спецпроект #',
                    newFormName: 'Новый спецпроект',
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
                },
                {
                    name: 'Статические страницы',
                    formsName: 'Статическая страница #',
                    newFormName: 'Новая статическая страница',
                    view: 'static-pages',
                    hasAddButton: false,
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
            name: 'Обратная связь',
            'sub-headers': [
                {
                    name: 'Обращения в редакцию',
                    view: 'feedbacks',
                    hasAddButton: false
                },
                {
                    name: 'Отзывы о местах',
                    view: 'reviews',
                    formsName: 'Отзыв о месте #',
                    newFormName: 'Новый отзыв о месте',
                    hasAddButton: true
                },
            ]
        },
        {
            name: 'Email-рассылки',
            'sub-headers': [
                {
                    name: 'Подписчики',
                    view: 'subscribers',
                    formsName: 'Подписчик #',
                    newFormName: 'Новый подписчик',
                    hasAddButton: true
                },
                {
                    name: 'Рассылки',
                    view: 'campaigns',
                    formsName: 'Рассылка #',
                    newFormName: 'Новая рассылка',
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
            name: 'Журнал операций',
            'sub-headers': [
                {
                    name: 'Поведение пользователей',
                    view: 'operation-log',
                    hasAddButton: false,
                },
            ]
        },
        {
            name: 'Настройки',
            'sub-headers': [
                {
                    name: 'Статические страницы',
                    formsName: 'Статическая страница #',
                    newFormName: 'Новая статическая страница',
                    view: 'static-page-settings',
                    hasAddButton: true,
                },
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