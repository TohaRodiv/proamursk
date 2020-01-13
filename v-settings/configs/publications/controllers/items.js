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
            fields.object_data.api = apis[entity];
            formData.object_data = null;
            formData.object_id = null;
        },

        object_data(objectData, { formData, }) {
            formData.object_id = objectData.id || null;
        },
    },
};