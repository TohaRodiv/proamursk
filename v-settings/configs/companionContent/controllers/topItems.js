const apis = {
    event: 'event-announcements',
    news: 'news',
    report: 'reports',
    history: 'history',
    place: 'places',
    person: 'persons',
};

export default {
    change: {
        entity(entity, { fields, formData, }) {
            if (entity) {
                fields.item.api = apis[entity];
            }

            formData.item = null;
        },

        item(item, { formData, }) {
            formData.object_id = (item || {}).id;
        },
    },
};