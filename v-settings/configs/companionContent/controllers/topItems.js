const dict = {
    'event-announcements': 'Анонс события',
    reports: 'Репортаж о событии',
    persons: 'Статья о жителе Амурска',
    history: 'Историческая статья',
    places: 'Статья о месте',
    'city-guides': 'Гид по городу',
    specials: 'Спецпроект',
};

export default {
    change: {
        entity(entity, { fields, formData, $set, }) {
            if (entity) {
                fields.item.api = entity;
                fields.item.label = dict[entity];
                $set(fields.item, 'blocked', false);
            } else {
                $set(fields.item, 'blocked', true);
            }

            formData.item = null;
        },

        item(item, { formData, }) {
            formData.object_id = (item || {}).id;
        },
    },
};