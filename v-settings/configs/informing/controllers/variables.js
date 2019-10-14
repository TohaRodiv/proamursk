import api from '../../../../cp_vue/frontend/vue/store/utils/api.js';

export default {
    change: {
        async construction_type(constructionType, { fields, $store, setValues, }) {
            const contentTypeConfig = fields.content_type;
            const channelsConfig = fields.channels;

            if (constructionType === 'var') {
                contentTypeConfig.show = true;
                contentTypeConfig.required = true;
            } else {
                contentTypeConfig.show = false;
                contentTypeConfig.required = false;

                // Проверка
                const codename = 'channels';
                const url = `/${ codename }/select/`;

                try {
                    const { items: channels, } = await api.get(url);

                    if (channels.length === 1) {
                        setValues({ channels, });
                    } else if (channels.length > 1) {
                        channelsConfig.blocked = false;
                    }
                } catch (error) {
                    $store.commit('API_ERROR_HANDLER', { url, error, });
                }
            }

            if (constructionType === 'tag') {
                channelsConfig.show = true;
                channelsConfig.required = true;
            } else {
                channelsConfig.show = false;
                channelsConfig.required = false;
            }
        },
    },
};