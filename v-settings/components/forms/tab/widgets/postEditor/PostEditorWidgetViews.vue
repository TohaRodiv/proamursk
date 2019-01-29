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
    </div>
</template>

<script>
    import imageComponent from './postEditorWidgetViews/Image.vue'
    import textComponent from './postEditorWidgetViews/Text.vue'

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
            textComponent
        }
    }
</script>