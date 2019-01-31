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
        <quote
                v-if="widget.type === 'quote'"
                :text="widget.text"
        ></quote>
        <directSpeech
                v-if="widget.type === 'direct-speech'"
                :data="widget"
        ></directSpeech>
        <videoComponent
                v-if="widget.type === 'video'"
                :code="widget.link"
        ></videoComponent>
    </div>
</template>

<script>
    import imageComponent from './postEditorWidgetViews/Image.vue'
    import textComponent from './postEditorWidgetViews/Text.vue'
    import separator from './postEditorWidgetViews/HR.vue'
    import slider from './postEditorWidgetViews/Slider.vue'
    import quote from './postEditorWidgetViews/Quote.vue'
    import directSpeech from './postEditorWidgetViews/DirectSpeech.vue'
    import video from './postEditorWidgetViews/Video.vue'

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
            slider,
            quote,
            directSpeech,
            videoComponent: video,
        }
    }
</script>