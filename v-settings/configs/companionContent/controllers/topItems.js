export default {
    change: {
        entity(entity, { fields, formData, }) {
            if (entity) {
                fields.item.api = entity;
            }

            formData.item = null;
        },

        item(item, { formData, }) {
            formData.object_id = (item || {}).id;
        },
    },
};