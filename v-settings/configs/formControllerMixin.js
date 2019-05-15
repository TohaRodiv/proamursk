export const formController = {
    methods: {
        watchBackendData(value) {
            // мониторить изменения данных, пришедших из бэка
        },

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