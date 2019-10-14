export default {
    change: {
        channel(channel, { fields, }) {
            const emailConfig = fields.email;

            if (channel.codename === 'email') {
                emailConfig.show = true;
                emailConfig.required = true;
            } else {
                emailConfig.show = false;
                emailConfig.required = false;
            }
        },
    },
};