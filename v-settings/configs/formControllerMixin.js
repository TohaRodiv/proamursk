import vue from 'vue';

export const formController = {
    methods: {
        onChangeData(newFormData, oldFormData) {
            // Мониторинг изменений данных
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

            if (model === 'users') {
                const superuser = this.isSuperUser.flag
                const rolesConfig = flatConfig.roles

                if (superuser) {
                    this.$set(rolesConfig, 'required', false)
                }
            }

            return modifiedConfig;
        }
    }
}