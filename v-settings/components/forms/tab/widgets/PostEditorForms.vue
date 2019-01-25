<template>
    <div>
        <textForm
                v-if="data.popupType === 'text'"
                :passedData="(Object.keys(data.widget).length ? data.widget : false)"
                @changed="handleChanging"
                @closePopup = "$emit('clearStore')"
        ></textForm>
    </div>
</template>

<script>
    import vue from 'vue'

    import text from './postEditorForms/Text.vue'

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

                if (!this.data.block.widgets) {
                    vue.set(this.data.block, 'widgets', [widget])
                }
                this.$emit('clearStore');
            },
        },
        components: {
            textForm: text,
        }
    }
</script>