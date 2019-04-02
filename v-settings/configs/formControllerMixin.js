export const formController = {
    data() {
        return {}
    },

    watch: {
        getFormsImmutableData: function() {
            // мониторить изменения формы с бэка
        }
    },

    methods: {
        modifyFormData(rawFormData) {
            // мониторить изменения formsData
        },

        modifyConfig(rawConfig) {
            // модификация конфига при загрузке
            let modifiedConfig = rawConfig;
            return modifiedConfig;
        }
    }
}