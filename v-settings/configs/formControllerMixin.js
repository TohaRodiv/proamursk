import vue from 'vue';

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
            const model = this.computedModel;
            const flatConfig = {};

            for (let i = 0; i < modifiedConfig.length; i++) {
                for (let block of modifiedConfig[i]['blocks']) {
                    for (let widget of block['elements']) {
                        let codename = widget['codename'];
                        flatConfig[codename] = widget;
                    }
                }
            }

            if (model === 'sliders') {
                const slidesConfig = flatConfig.slides;

                if (this.computedIsEditForm) {
                    vue.set(slidesConfig, 'isBlocked', false)
                }
            }

            return modifiedConfig;
        }
    }
}