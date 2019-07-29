import vue from 'vue';
import _ from 'lodash';

import notificationTemplatesController from '../configs/informing/controllers/notificationTemplates';
import recipientsController from '../configs/informing/controllers/recipients';
import staticPagesController from '../configs/companionContent/controller/staticPages';

const actions = {
    change: {
        notificationTemplates: notificationTemplatesController.change,
        recipients: recipientsController.change,
        staticPages: staticPagesController.change,
    },
};

export const formController = {
    data() {
        return {
            oldFormData: {},
        };
    },

    methods: {
        toCamelCase(str) {
            let s =
              str &&
              str
                  .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                  .map(x => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
                  .join('');
            return s.slice(0, 1).toLowerCase() + s.slice(1);
        },
        
        getDifferentValues(newData, oldData) {
            const differentValues = [];
            const keys = _.keys(newData);

            for (let key of keys) {
                if (!_.isEqual(newData[key], oldData[key])) {
                    differentValues.push(key);
                }
            }

            return differentValues;
        },

        getNewValues(newData, oldData) {
            const newValues = [];
            const keys = _.keys(newData);

            for (let key of keys) {
                if (!_.has(oldData, key)) {
                    newValues.push(key);
                }
            }

            return newValues;
        },

        onChangeData(newFormData, oldFormData) {
            const differentValues = this.getDifferentValues(newFormData, this.oldFormData);
            const newValues = this.getNewValues(newFormData, this.oldFormData);
            const model = this.toCamelCase(this.computedModel);

            _.map(differentValues, key => {
                if (_.has(actions, ['change', model, key,])) {
                    actions.change[model][key](newFormData, this);
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