export default {
    setConfigHook(config, data) {
        if (data.is_superuser) {
            config[0].blocks[1].elements[1].required = false;
        }
    },
};