import slides from './companionContent/controllers/slides';

const controllers = {
    change: {
        slides,
    },
};

export default {
    methods: {
        // Всё остальное вычисляется в самом попапе
        changeHook(model, codename, value) {
            controllers.change[model][codename](value);
        },
    },
};