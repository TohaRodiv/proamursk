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
        entity(entity, { fields, formData, rows, loading, }) {
            if (entity) {
                fields.item.api = entity;
                fields.item.label = dict[entity];
                rows['0-1'].show = true;
            } else {
                rows['0-1'].show = false;
            }

            if (!loading) {
                formData.item = null;
            }
        },

        item(item, { formData, }) {
            formData.object_id = (item || {}).id;
        },
    },
};