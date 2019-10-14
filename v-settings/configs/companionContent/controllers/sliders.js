export default {
    change: {
        format(format, { fields, $set, }) {
            const slidesConfig = fields.slides;
            const coverConfig = slidesConfig.popup.config[0].blocks[0].elements[0];

            if (format == 'format_3x2') {
                $set(coverConfig, 'image', { width: 1720, height: 1144, });
                $set(slidesConfig, 'blocked', false);
            } else if (format == 'format_2x1') {
                $set(coverConfig, 'image', { width: 1720, height: 860, });
                $set(slidesConfig, 'blocked', false);
            } else if (!format) {
                $set(slidesConfig, 'blocked', true);
            }
        },

        slides(slides, { fields, $set, }) {
            const formatConfig = fields.format;
            if (slides && slides.length) {
                $set(formatConfig, 'blocked', true);
            } else {
                $set(formatConfig, 'blocked', false);
            }
        },
    },
};