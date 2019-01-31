<template>
    <div>
        <imageComponent
                v-if="widget.type === 'image'"
                :data="widget"
        ></imageComponent>
        <textComponent
                v-if="widget.type === 'text' && widget.text"
                :text="widget.text"
        ></textComponent>
        <slider
                v-if="widget.type === 'slider'"
                :sliderId="widget.slides"
        ></slider>
    </div>
</template>

<script>
    import imageComponent from './postEditorWidgetViews/Image.vue'
    import textComponent from './postEditorWidgetViews/Text.vue'
    import separator from './postEditorWidgetViews/HR.vue'
    import slider from './postEditorWidgetViews/Slider.vue'

    export default {
        props: {
            widget: Object,
        },

        data() {
            return {}
        },
        mounted() {

        },
        computed: {},
        methods: {},
        components: {
            imageComponent,
            textComponent,
            separator,
            slider
        }
    }
</script>