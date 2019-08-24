export default {
    change: {
        format(data, component) {
            const format = data.format;
            const slidesConfig = component.FORM_CONFIG.slides;
            const coverConfig = slidesConfig.popup_structure[0].blocks[0].elements[0];

            if (format == 'format_3x2') {
                component.$set(coverConfig, 'image', { width: 1720, height: 1144, });
                component.$set(slidesConfig, 'isBlocked', false);
            } else if (format == 'format_2x1') {
                component.$set(coverConfig, 'image', { width: 1720, height: 860, });
                component.$set(slidesConfig, 'isBlocked', false);
            } else if (format === null) {
                component.$set(slidesConfig, 'isBlocked', true);
            }
        },

        slides(data, component) {
            console.log('slides');
            const slides = data.slides;

            if (slides && slides.length) {
                const formatConfig = component.FORM_CONFIG.format;
                component.$set(formatConfig, 'isBlocked', true);
            }
        },
    },
};