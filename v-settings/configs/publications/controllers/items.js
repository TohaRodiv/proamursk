export default {
    change: {
        entity(entity, { fields, formData, }) {
            fields.object_data.api = entity;
            formData.object_data = null;
            formData.object_id = null;
        },

        object_data(objectData, { formData, }) {
            formData.object_id = objectData.id || null;
        },
    },
};