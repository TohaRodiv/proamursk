import vue from 'vue';
import _ from 'lodash';

import notificationTemplatesController from '../configs/informing/controllers/notificationTemplates';
import recipientsController from '../configs/informing/controllers/recipients';
import staticPagesController from '../configs/companionContent/controllers/staticPages';
import slidersController from '../configs/companionContent/controllers/sliders';
import cityGuidesController from '../configs/publications/controllers/cityGuides';

const controllers = {
    change: {
        notificationTemplates: notificationTemplatesController.change,
        recipients: recipientsController.change,
        staticPages: staticPagesController.change,
        sliders: slidersController.change,
        cityGuides: cityGuidesController.change,
    },

    // modifyConfig: {
    //     'static-pages': staticPagesController.modifyConfig,
    // },
};

export const formController = {
    data() {
        return {
            oldFormData: {},
        };
    },

    methods: {
        onChangeData(newFormData, oldFormData) {
            const differentValues = this.getDifferentValues(newFormData, this.oldFormData);
            const newValues = this.getNewValues(newFormData, this.oldFormData);
            const model = this.toCamelCase(this.computedModel);

            _.map(differentValues, key => {
                if (_.has(controllers, ['change', model, key,])) {
                    controllers.change[model][key](newFormData, this);
                }
            });

            // Сохраняю всё в отдельный файл, а не использую oldVal,
            // потому что oldVal не передаёт изменений в массивах и объектах
            this.oldFormData = _.cloneDeep(newFormData);
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

            const hasModify = controllers.modifyConfig
                && controllers.modifyConfig[model];

            if (hasModify) {
                modifiedConfig = controllers.modifyConfig[model](modifiedConfig, this);
            }

            if (model === 'sliders') {
                const slidesConfig = flatConfig.slides;

                if (this.computedIsEditForm) {
                    vue.set(slidesConfig, 'isBlocked', false);
                }
            }

            if (model === 'users') {
                const superuser = this.isSuperUser.flag;
                const rolesConfig = flatConfig.roles;

                if (superuser) {
                    this.$set(rolesConfig, 'required', false);
                }
            }

            return modifiedConfig;
        },
    },
};