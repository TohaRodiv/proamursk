import api from '../../../../cp_vue/frontend/vue/store/utils/api.js';

export default {
    change: {
        async construction_type(constructionType, { config, rows, fields, $store, setValues, }) {
            const contentTypeConfig = fields.content_type;
            const contentTypeRow = rows['0-3'];
            const channelRow = rows['0-4'];
            const channelsConfig = fields.channels;

            if (constructionType === 'var') {
                contentTypeRow.show = true;
                contentTypeConfig.required = true;
            } else {
                contentTypeRow.show = false;
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
                channelRow.show = true;
                channelsConfig.required = true;
            } else {
                channelRow.show = false;
                channelsConfig.required = false;
            }
        },
    },
};