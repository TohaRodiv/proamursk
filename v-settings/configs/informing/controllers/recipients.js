export default {
    change: {
        channel(data, component) {
            const channel = data.channel;
            const emailConfig = component.FORM_CONFIG.email;

            if (channel == 1) {
                component.$set(emailConfig, 'show', true);
                component.$set(emailConfig, 'required', true);
            } else {
                component.$set(emailConfig, 'show', false);
                component.$set(emailConfig, 'required', false);
            }
        },
    },
};