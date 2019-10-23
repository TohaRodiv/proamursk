export default {
    afterSetConfigHook(data, { fields, isAdd, }) {
        fields.roles.show = !data.is_superuser;
        fields.password1.required = isAdd;
        fields.password2.required = isAdd;
    },
};