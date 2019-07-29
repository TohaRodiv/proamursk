const dict = {
    'event-announcements': 'Анонс события',
    reports: 'Репортаж о событии',
    persons: 'Статья о жителе Амурска',
    history: 'Историческая статья',
    places: 'Статья о месте',
    'city-guides': 'Гид по городу',
    specials: 'Спецпроект',
};

const valuesForIndex = [
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

const valuesForEvents = [
    {
        id: 'event-announcements',
        name: 'Анонс события',
    },
    {
        id: 'reports',
        name: 'Репортаж о событии',
    },
];

const valuesForPlaces = [
    {
        id: 'places',
        name: 'Статья о месте',
        isDefault: true,
    },
];

const valuesForPersons = [
    {
        id: 'persons',
        name: 'Статья о жителе Амурска',
        isDefault: true,
    },
];

const valuesForHistory = [
    {
        id: 'history',
        name: 'Историческая статья',
        isDefault: true,
    },
];

const valuesForReports = [
    {
        id: 'reports',
        name: 'Репортаж о событии',
        isDefault: true,
    },
];

const twoSelectorScructure = [
    {
        type: 'vertical_list',
        list: [
            {
                requiredValue: 'item.title',
            },
            {
                requiredValue: 'entity',
                isTransparent: true,
                value: dict,
            },
        ],
    },
];

const oneSelectorScructure = [
    {
        type: 'vertical_list',
        list: [
            {
                requiredValue: 'item.title',
            },
        ],
    },
];

export default {
    change: {
        _getTopItemsConfig(component) {
            return new Promise((resolve, reject) => {
                let counter = 0;

                const timeout = () => setTimeout(() => {
                    counter += 1;
                    const config = component.FORM_CONFIG.top_items;
                    if (counter == 10) {
                        clearTimeout(timeout);
                        reject('В конфиге отсутствует значение top_items');
                    } else {
                        if (config) {
                            clearTimeout(timeout);
                            resolve(config);
                        } else {
                            timeout();
                        }
                    }
                }, 1000);

                timeout();
            });
        },

        codename(data, component) {
            const codename = data.codename;
            const codenames = ['index', 'events-index', 'history-list', 'places-list', 'persons-list', 'reports-list',];

            if (codenames.includes(codename)) {
                this._getTopItemsConfig(component)
                    .then(config => {
                        const firstSelector = config.popup_structure[0].blocks[0].elements[0];
                        const secondSelector = config.popup_structure[0].blocks[1].elements[0];

                        if (codename == 'index') {
                            component.$set(config.popup_structure[0].blocks[0], 'show', true);
                            component.$set(secondSelector, 'api_route', 'event-announcements');
                            component.$set(secondSelector, 'label', dict['event-announcements']);
                            component.$set(secondSelector, 'isBlocked', true);
                            component.$set(secondSelector, 'required', true);
                            component.$set(firstSelector, 'available_values', valuesForIndex);
                            component.$set(firstSelector, 'required', true);
                            component.$set(config, 'show', true),
                            component.$set(config, 'entity_structure', twoSelectorScructure);
                        } else if (codename == 'events-index') {
                            component.$set(config.popup_structure[0].blocks[0], 'show', true);
                            component.$set(secondSelector, 'api_route', 'event-announcements');
                            component.$set(secondSelector, 'label', dict['event-announcements']);
                            component.$set(secondSelector, 'isBlocked', true);
                            component.$set(secondSelector, 'required', true);
                            component.$set(firstSelector, 'available_values', valuesForEvents);
                            component.$set(firstSelector, 'required', true);
                            component.$set(config, 'show', true),
                            component.$set(config, 'entity_structure', twoSelectorScructure);
                        } else if (codename == 'history-list') {
                            component.$set(config.popup_structure[0].blocks[0], 'show', false);
                            component.$set(firstSelector, 'available_values', valuesForHistory);
                            component.$set(firstSelector, 'required', false);
                            component.$set(secondSelector, 'api_route', 'history');
                            component.$set(secondSelector, 'label', dict['history']);
                            component.$set(secondSelector, 'isBlocked', false);
                            component.$set(secondSelector, 'required', true);
                            component.$set(config, 'show', true);
                            component.$set(config, 'entity_structure', oneSelectorScructure);
                        } else if (codename == 'places-list') {
                            component.$set(config.popup_structure[0].blocks[0], 'show', false);
                            component.$set(firstSelector, 'available_values', valuesForPlaces);
                            component.$set(firstSelector, 'required', false);
                            component.$set(secondSelector, 'api_route', 'places');
                            component.$set(secondSelector, 'label', dict['places']);
                            component.$set(secondSelector, 'isBlocked', false);
                            component.$set(secondSelector, 'required', true);
                            component.$set(config, 'show', true);
                            component.$set(config, 'entity_structure', oneSelectorScructure);
                        } else if (codename == 'persons-list') {
                            component.$set(config.popup_structure[0].blocks[0], 'show', false);
                            component.$set(firstSelector, 'available_values', valuesForPersons);
                            component.$set(firstSelector, 'required', false);
                            component.$set(secondSelector, 'api_route', 'persons');
                            component.$set(secondSelector, 'label', dict['persons']);
                            component.$set(secondSelector, 'isBlocked', false);
                            component.$set(secondSelector, 'required', true);
                            component.$set(config, 'show', true);
                            component.$set(config, 'entity_structure', oneSelectorScructure);
                        } else if (codename == 'reports-list') {
                            component.$set(config.popup_structure[0].blocks[0], 'show', false);
                            component.$set(firstSelector, 'available_values', valuesForReports);
                            component.$set(firstSelector, 'required', false);
                            component.$set(secondSelector, 'api_route', 'reports');
                            component.$set(secondSelector, 'label', dict['reports']);
                            component.$set(secondSelector, 'isBlocked', false);
                            component.$set(secondSelector, 'required', true);
                            component.$set(config, 'show', true);
                            component.$set(config, 'entity_structure', oneSelectorScructure);
                        } else {
                            component.$set(config, 'show', false);
                            component.$set(firstSelector, 'required', false);
                            component.$set(secondSelector, 'required', false);
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        },
    },
};