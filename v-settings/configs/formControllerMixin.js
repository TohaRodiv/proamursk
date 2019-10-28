import notificationTemplatesController from '../configs/informing/controllers/notificationTemplates';
import recipientsController from '../configs/informing/controllers/recipients';
import staticPagesController from '../configs/companionContent/controllers/staticPages';
import slidersController from '../configs/companionContent/controllers/sliders';
import cityGuidesController from '../configs/publications/controllers/cityGuides';
import reportsController from '../configs/publications/controllers/reports.js';
import usersController from '../configs/administration/controllers/users';

const controllers = {
    change: {
        'notification-templates': notificationTemplatesController.change,
        recipients: recipientsController.change,
        'static-pages': staticPagesController.change,
        sliders: slidersController.change,
        'city-guides': cityGuidesController.change,
        reports: reportsController.change,
    },

    requestHook: {
        users: usersController.requestHook,
    },

    afterSetConfigHook: {
        users: usersController.afterSetConfigHook,
    },

    setConfigHook: {
        'static-pages': staticPagesController.setConfigHook,
    },
};

export const formController = {
    methods: {
        changeHook(codename, value) {
            if (controllers.change[this.view]) {
                if (controllers.change[this.view][codename]) {
                    controllers.change[this.view][codename](value, this);
                }
            }
        },

        afterSetConfigHook(data) {
            if (controllers.afterSetConfigHook[this.view]) {
                controllers.afterSetConfigHook[this.view](data, this);
            }
        },

        requestHook(data, response) {
            if (controllers.requestHook[this.view]) {
                controllers.requestHook[this.view](data, response, this);
            }
        },
        
        setConfigHook(config, data) {
            if (controllers.setConfigHook[this.view]) {
                controllers.setConfigHook[this.view](config, data, this);
            }
        },
    },
};