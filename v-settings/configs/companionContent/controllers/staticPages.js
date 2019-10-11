import seo from '../../../../cp_vue/frontend/vue/store/seoConfig';

const dict = {
    'event-announcements': 'Анонс события',
    reports: 'Репортаж о событии',
    persons: 'Статья о жителе Амурска',
    history: 'Историческая статья',
    places: 'Статья о месте',
    'city-guides': 'Гид по городу',
    specials: 'Спецпроект',
};

const optionsForIndex = [
    {
        id: 'event-announcements',
        name: 'Анонс события',
    },
    {
        id: 'reports',
        name: 'Репортаж о событии',
    },
    {
        id: 'history',
        name: 'Историческая статья',
    },
    {
        id: 'persons',
        name: 'Статья о жителе Амурска',
    },
    {
        id: 'places',
        name: 'Статья о месте',
    },
    {
        id: 'city-guides',
        name: 'Гид по городу',
    },
    {
        id: 'specials',
        name: 'Спецпроект',
    },
];

const optionsForEvents = [
    {
        id: 'event-announcements',
        name: 'Анонс события',
    },
    {
        id: 'reports',
        name: 'Репортаж о событии',
    },
];

const optionsForPlaces = [
    {
        id: 'places',
        name: 'Статья о месте',
    },
];

const optionsForPersons = [
    {
        id: 'persons',
        name: 'Статья о жителе Амурска',
    },
];

const optionsForHistory = [
    {
        id: 'history',
        name: 'Историческая статья',
    },
];

const optionsForReports = [
    {
        id: 'reports',
        name: 'Репортаж о событии',
    },
];

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
                    dict,
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
    label: '',
    width: 12,
    required: true,
    api: 'event-anouncements',
    template: 'title',
    params: {
        order_by: '-id',
    },
};

const defaultEntityConfig = {
    codename: 'entity',
    widget: 'select',
    label: 'Тип материала',
    width: 6,
    required: true,
    options: [],
};

const defaultBlock = {
    labelPosition: 'top',
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
    dragOrder: 'weight',
    isDraggable: true,
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
            label: 'Показывать на Главной странице баннер-растяжку вместо слайдера со спецпроектами',
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
            show: false,
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
        const tab = Object.assign({}, defaultTab, {
            blocks: [topItemsBlock, showBannerBlock,],
            title: 'КОНТЕНТ',
        });
        return tab;
    } else if (codename === 'events-index') {
        const entityConfig = Object.assign({},defaultEntityConfig, {
            options: optionsForEvents,
        });
        const itemConfig = defaultItemConfig;
        const entityBlock = Object.assign({},defaultBlock, {
            elements: [entityConfig,],
        });
        const itemBlock = Object.assign({},defaultBlock, {
            elements: [itemConfig,],
            show: false,
        });
        const topItemsConfigPopup = Object.assign({},defaultTab, {
            blocks: [entityBlock, itemBlock,],
        });
        const topItemsConfig = Object.assign({},defaultTopItemsConfig, {
            rows: twoSelectorStructure,
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
        const tab = Object.assign({},defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
        return tab;
    } else if (codename === 'history-list') {
        const entityConfig = Object.assign({},defaultEntityConfig, {
            options: optionsForHistory,
            default: 'history',
            blocked: true,
        });
        const itemConfig = Object.assign({},defaultItemConfig, {
            label: 'Историческая статья',
            api: 'history',
        });
        const entityBlock = Object.assign({},defaultBlock, {
            elements: [entityConfig,],
        });
        const itemBlock = Object.assign({},defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({},defaultTab, {
            blocks: [entityBlock, itemBlock,],
        });
        const topItemsConfig = Object.assign({},defaultTopItemsConfig, {
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
        const tab = Object.assign({},defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
        return tab;
    } else if (codename === 'places-list') {
        const entityConfig = Object.assign({},defaultEntityConfig, {
            options: optionsForPlaces,
            default: 'places',
            blocked: true,
        });
        const itemConfig = Object.assign({},defaultItemConfig, {
            label: 'Статья о месте',
            api: 'places',
        });
        const entityBlock = Object.assign({},defaultBlock, {
            elements: [entityConfig,],
        });
        const itemBlock = Object.assign({},defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({},defaultTab, {
            blocks: [entityBlock, itemBlock,],
        });
        const topItemsConfig = Object.assign({},defaultTopItemsConfig, {
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
        const tab = Object.assign({},defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
        return tab;
    } else if (codename === 'persons-list') {
        const entityConfig = Object.assign({},defaultEntityConfig, {
            options: optionsForPersons,
            default: 'persons',
            blocked: true,
        });
        const itemConfig = Object.assign({},defaultItemConfig, {
            label: 'Статья о жителе Амурска',
            api: 'persons',
        });
        const entityBlock = Object.assign({},defaultBlock, {
            elements: [entityConfig,],
        });
        const itemBlock = Object.assign({},defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({},defaultTab, {
            blocks: [entityBlock, itemBlock,],
        });
        const topItemsConfig = Object.assign({},defaultTopItemsConfig, {
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
        const tab = Object.assign({},defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
        return tab;
    } else if (codename === 'reports-list') {
        const entityConfig = Object.assign({},defaultEntityConfig, {
            options: optionsForReports,
            default: 'reports',
            blocked: true,
        });
        const itemConfig = Object.assign({},defaultItemConfig, {
            label: 'Репортаж о событии',
            api: 'reports',
        });
        const entityBlock = Object.assign({},defaultBlock, {
            elements: [entityConfig,],
        });
        const itemBlock = Object.assign({},defaultBlock, {
            elements: [itemConfig,],
        });
        const topItemsConfigPopup = Object.assign({},defaultTab, {
            blocks: [entityBlock, itemBlock,],
        });
        const topItemsConfig = Object.assign({},defaultTopItemsConfig, {
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
        const tab = Object.assign({},defaultTab, {
            blocks: [topItemsBlock,],
            title: 'КОНТЕНТ',
        });
        return tab;
    }
};

const codenames = ['index', 'events-index', 'history-list', 'places-list', 'persons-list', 'reports-list',];

export default {
    setConfigHook(config, data) {
        const codename = data.codename;
        if (codenames.includes(codename)) {
            const tab = generateTab(codename);
            config.splice(0, 0, tab);
        }
        config.push(seo);
    },

    change: {
        top_items(topItems, { fields, }) {
            const topItemsConfig = fields.top_items;
            if (topItems && topItems.length > 3) {
                topItemsConfig.noAddButton = true;
            } else {
                topItemsConfig.noAddButton = false;
            }
        },
    },
};