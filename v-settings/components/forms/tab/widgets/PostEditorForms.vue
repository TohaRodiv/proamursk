<template>
    <div>
        <textForm
                v-if="data.popupType === 'text'"
                :passedData="(Object.keys(data.widget).length ? data.widget : undefined)"
                @changed="handleChanging"
                @closePopup = "$emit('clearStore')"
        ></textForm>
        <directSpeech
                v-if="data.popupType === 'direct-speech'"
                :passedData="(Object.keys(data.widget).length ? data.widget : undefined)"
                @changed="handleChanging"
                @closePopup = "$emit('clearStore')"
        ></directSpeech>
        <imageComp
                v-if="data.popupType === 'image'"
                :passedData="(Object.keys(data.widget).length ? data.widget : false)"
                @changed="handleChanging"
                @closePopup = "$emit('clearStore')"
        ></imageComp>
    </div>
</template>

<script>
    import vue from 'vue'

    import imageComp from './postEditorForms/Image.vue'
    import text from './postEditorForms/Text.vue'
    import directSpeech from './postEditorForms/DirectSpeech.vue'

    export default {
        props: {
            data: Object
        },

        data() {
            return {}
        },
        mounted() {

        },
        computed: {},
        methods: {
            handleChanging(payload){
                let widget = {
                    type: this.data.popupType
                };
                Object.assign(widget, payload);

                if (!this.data.block.widgets) vue.set(this.data.block, 'widgets', [widget]);
                else if (typeof this.data.insertIndex !== 'undefined' && typeof this.data.insertIndex !== 'string') {
                    console.log(this.data.insertIndex);
                    this.data.block.widgets.splice(this.data.insertIndex, 0, widget);
                }
                else if (typeof this.data.widgetIndex === 'undefined' || !this.data.widgetIndex) this.data.block.widgets.push(widget);
                else if (typeof this.data.widgetIndex !== 'undefined') this.data.block.widgets.splice(this.data.index, 1, widget);

                this.$emit('clearStore');
            },
        },
        components: {
            textForm: text,
            directSpeech,
            imageComp,
        }
    }
</script>