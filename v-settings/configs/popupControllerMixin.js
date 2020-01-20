import slides from './companionContent/controllers/slides';
import topItems from './companionContent/controllers/topItems';
import variables from './informing/controllers/variables';
import items from './publications/controllers/items';

const controllers = {
    change: {
        slides,
        top_items: topItems.change,
        variables: variables.change,
        items: items.change,
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