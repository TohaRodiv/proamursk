import slides from './companionContent/controllers/slides';
import topItems from './companionContent/controllers/topItems';

const controllers = {
    change: {
        slides,
        top_items: topItems.change,
    },
};

export default {
    methods: {
        changeHook(model, codename, value) {
            if (controllers.change[model]) {
                if (controllers.change[model][codename]) {
                    controllers.change[model][codename](value, this);
                }
            }
        },
    },
};