import seo from '../../../../cp_vue/frontend/vue/store/seoConfig';

// const dict = {
//     news: 'Новость',
//     'event-announcements': 'Анонс события',
//     reports: 'Репортаж о событии',
//     persons: 'Статья о жителе Амурска',
//     history: 'Историческая статья',
//     places: 'Статья о месте',
//     'city-guides': 'Гид по городу',
//     specials: 'Спецпроект',
// };

const optionsForIndex = [
    {
        value: 'news',
        label: 'Новость',
    },
    {
        value: 'event-announcements',
        label: 'Анонс события',
    },
    {
        value: 'reports',
        label: 'Репортаж о событии',
    },
    {
        value: 'history',
        label: 'Историческая статья',
    },
    {
        value: 'persons',
        label: 'Статья о жителе Амурска',
    },
    {
        value: 'places',
        label: 'Статья о месте',
    },
    // {
    //     value: 'city-guides',
    //     label: 'Гид по городу',
    // },
    // {
    //     value: 'specials',
    //     label: 'Спецпроект',
    // },
];

const optionsForEvents = [
    {
        value: 'event-announcements',
        label: 'Анонс события',
    },
    {
        value: 'reports',
        label: 'Репортаж о событии',
    },
];

// const optionsForPlaces = [
//     {
//         id: 'places',
//         name: 'Статья о месте',
//     },
// ];
//
// const optionsForPersons = [
//     {
//         id: 'persons',
//         name: 'Статья о жителе Амурска',
//     },
// ];
//
// const optionsForHistory = [
//     {
//         id: 'history',
//         name: 'Историческая статья',
//     },
// ];
//
// const optionsForReports = [
//     {
//         id: 'reports',
//         name: 'Репортаж о событии',
//     },
// ];

const twoSelectorStructure = [
    {
        map: {
            layout: 'column',
            elements: [
                {
                    codename: 'item.title',
                },
                {
                    codename: 'entity',
                    class: ['halfTransparent',],
                    dict: {
                        event: 'event-announcements',
                        news: 'news',
                        report: 'reports',
                        history: 'history',
                        place: 'places',
                        person: 'persons',
                    },
                },
            ],
        },
    },
];

const oneSelectorStructure = [
    {
        map: {
            layout: 'row',
            elements: [
                {
                    codename: 'item.title',
                },
            ],
        },
    },
];

const defaultItemConfig = {
    codename: 'item',
    widget: 'select',
    label: 'Публикация',
    width: 8,
    required: true,
    api: 'event-announcements',
    template: 'title',
};

const defaultEntityConfig = {
    codename: 'entity',
    widget: 'radioButtons',
    label: 'Тип материала',
    width: 6,
    required: true,
    borders: true,
    default: 'news',
    options: [],
};

const defaultBlock = {
    labelPosition: 'left',
    modClass: 'marginBottom20',
    direction: 'row',
    show: true,
    hasWideLabel: false,
    elements: [],
};

const defaultTab = {
    id: 1,
    blocks: [],
};

const defaultTopItemsConfig = {
    label: 'Избранные материалы',
    widget: 'childEntity',
    codename: 'top_items',
    rows: [],
    menu: ['edit', 'delete',],
    noAddButton: false,
    popup: {},
};

const showBannerBlock = {
    labelPosition: 'top',
    modClass: 'marginBottom20',
    direction: 'row',
    elements: [
        {
            widget: 'singleCheckbox',
            name: 'Показывать на Главной странице баннер-растяжку вместо слайдера со спецпроектами',
            label: '',
            codename: 'show_banner',
        },
    ],
};

const generateTab = function(codename) {
    if (codename === 'index') {
        const entityConfig = Object.assign({}, defaultEntityConfig, {
            options: optionsForIndex,
        });
        const itemConfig = defaultItemConfig;
        const entityBlock = Object.assign({}, defaultBlock, {
            elements: [entityConfig,],
        });
        const itemBlock = Object.assign({}, defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({}, defaultTab, {
            blocks: [entityBlock, itemBlock,],
        });
        const topItemsConfig = Object.assign({}, defaultTopItemsConfig, {
            rows: twoSelectorStructure,
            label: 'Закрепленный материал',
            popup: {
                label: 'Закрепленный материал',
                disableClickaway: true,
                config: [topItemsConfigPopup,],
            },
        });
        const topItemsBlock = Object.assign({}, defaultBlock, {
            hasWideLabel: true,
            modClass: 'marginBottom50',
            elements: [topItemsConfig,],
        });
        return Object.assign({}, defaultTab, {
            blocks: [topItemsBlock, showBannerBlock,],
            title: 'КОНТЕНТ',
        });
    } else if (codename === 'events-index') {
        const entityConfig = Object.assign({}, defaultEntityConfig, {
            options: optionsForEvents,
            default: 'event-announcements',
        });
        const itemConfig = defaultItemConfig;
        const entityBlock = Object.assign({}, defaultBlock, {
            elements: [entityConfig,],
        });
        const itemBlock = Object.assign({}, defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({}, defaultTab, {
            blocks: [entityBlock, itemBlock,],
        });
        const topItemsConfig = Object.assign({}, defaultTopItemsConfig, {
            rows: twoSelectorStructure,
            popup: {
                label: 'Публикация в топе',
                disableClickaway: true,
                config: [topItemsConfigPopup,],
            },
        });
        const topItemsBlock = Object.assign({}, defaultBlock, {
            hasWideLabel: true,
            modClass: 'marginBottom50',
            elements: [topItemsConfig,],
        });
        return Object.assign({}, defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
    } else if (codename === 'history-list') {
        // const entityConfig = Object.assign({}, defaultEntityConfig, {
        //     options: optionsForHistory,
        //     default: 'history',
        //     blocked: true,
        // });
        const itemConfig = Object.assign({}, defaultItemConfig, {
            label: 'Историческая статья',
            api: 'history',
        });
        // const entityBlock = Object.assign({}, defaultBlock, {
        //     elements: [entityConfig,],
        // });
        const itemBlock = Object.assign({}, defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({}, defaultTab, {
            // blocks: [entityBlock, itemBlock,],
            blocks: [itemBlock,],
        });
        const topItemsConfig = Object.assign({}, defaultTopItemsConfig, {
            rows: oneSelectorStructure,
            popup: {
                label: 'Публикация в топе',
                disableClickaway: true,
                config: [topItemsConfigPopup,],
            },
        });
        const topItemsBlock = Object.assign({}, defaultBlock, {
            hasWideLabel: true,
            modClass: 'marginBottom50',
            elements: [topItemsConfig,],
        });
        return Object.assign({}, defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
    } else if (codename === 'places-list') {
        // const entityConfig = Object.assign({}, defaultEntityConfig, {
        //     options: optionsForPlaces,
        //     default: 'places',
        //     blocked: true,
        // });
        const itemConfig = Object.assign({}, defaultItemConfig, {
            label: 'Статья о месте',
            api: 'places',
        });
        // const entityBlock = Object.assign({}, defaultBlock, {
        //     elements: [entityConfig,],
        // });
        const itemBlock = Object.assign({}, defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({}, defaultTab, {
            // blocks: [entityBlock, itemBlock,],
            blocks: [itemBlock,],
        });
        const topItemsConfig = Object.assign({}, defaultTopItemsConfig, {
            rows: oneSelectorStructure,
            popup: {
                label: 'Публикация в топе',
                disableClickaway: true,
                config: [topItemsConfigPopup,],
            },
        });
        const topItemsBlock = Object.assign({},defaultBlock, {
            hasWideLabel: true,
            modClass: 'marginBottom50',
            elements: [topItemsConfig,],
        });
        return Object.assign({}, defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
    } else if (codename === 'persons-list') {
        // const entityConfig = Object.assign({}, defaultEntityConfig, {
        //     options: optionsForPersons,
        //     default: 'persons',
        //     blocked: true,
        // });
        const itemConfig = Object.assign({}, defaultItemConfig, {
            label: 'Статья о жителе Амурска',
            api: 'persons',
        });
        // const entityBlock = Object.assign({}, defaultBlock, {
        //     elements: [entityConfig,],
        // });
        const itemBlock = Object.assign({}, defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({}, defaultTab, {
            // blocks: [entityBlock, itemBlock,],
            blocks: [itemBlock,],
        });
        const topItemsConfig = Object.assign({}, defaultTopItemsConfig, {
            rows: oneSelectorStructure,
            popup: {
                label: 'Публикация в топе',
                disableClickaway: true,
                config: [topItemsConfigPopup,],
            },
        });
        const topItemsBlock = Object.assign({},defaultBlock, {
            hasWideLabel: true,
            modClass: 'marginBottom50',
            elements: [topItemsConfig,],
        });
        return Object.assign({}, defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
    } else if (codename === 'reports-list') {
        // const entityConfig = Object.assign({}, defaultEntityConfig, {
        //     options: optionsForReports,
        //     default: 'reports',
        //     blocked: true,
        // });
        const itemConfig = Object.assign({}, defaultItemConfig, {
            label: 'Репортаж о событии',
            api: 'reports',
        });
        // const entityBlock = Object.assign({}, defaultBlock, {
        //     elements: [entityConfig,],
        // });
        const itemBlock = Object.assign({}, defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({}, defaultTab, {
            // blocks: [entityBlock, itemBlock,],
            blocks: [itemBlock,],
        });
        const topItemsConfig = Object.assign({}, defaultTopItemsConfig, {
            rows: oneSelectorStructure,
            popup: {
                label: 'Публикация в топе',
                disableClickaway: true,
                config: [topItemsConfigPopup,],
            },
        });
        const topItemsBlock = Object.assign({}, defaultBlock, {
            hasWideLabel: true,
            modClass: 'marginBottom50',
            elements: [topItemsConfig,],
        });
        return Object.assign({}, defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
    }
};

const codenames = ['events-index', 'history-list', 'places-list', 'persons-list', 'reports-list',];

export default {
    setConfigHook(config, data) {
        // const codename = data.codename;
        // if (codenames.includes(codename)) {
        //     config.splice(0, 0, generateTab(codename));
        // }
        config.push(seo);
    },

    change: {
        // top_items(topItems, { fields, }) {
        //     const topItemsConfig = fields.top_items;
        //     topItemsConfig.noAddButton = !!(topItems && topItems.length > 3);
        // },
        top_items(topItems, { fields, fullData, }) {
            console.log('top_items');
            const codename = fullData.codename;
            if (codename === 'index') {
                fields.top_items.noAddButton = !!(topItems && topItems.length);
            } else if (codename === 'events-index' || codename === 'places-list') {
                fields.top_items.noAddButton = !!(topItems && topItems.length > 3);
            }
        },
    },
};