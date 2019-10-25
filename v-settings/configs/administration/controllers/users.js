import EventBus from '../../../../cp_vue/frontend/vue/EventBus';

export default {
    afterSetConfigHook(data, { fields, isAdd, }) {
        fields.roles.show = !data.is_superuser;
        fields.password1.required = isAdd;
        fields.password2.required = isAdd;
    },

    requestHook(data, { id, }, { userInfo, }) {
        if (id === userInfo.id) {
            EventBus.$emit('UPDATE_USER_INFO');
        }
    },
};