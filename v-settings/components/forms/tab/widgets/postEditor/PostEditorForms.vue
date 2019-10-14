<template>
    <div>
        <textForm
            v-if="data.popupType === 'text'"
            :passedData="(Object.keys(data.widget).length ? data.widget : false)"
            @changed="handleChanging"
            @closePopup = "$emit('clearStore')"
        />
        <directSpeech
            v-if="data.popupType === 'direct-speech'"
            :passedData="(Object.keys(data.widget).length ? data.widget : false)"
            @changed="handleChanging"
            @closePopup = "$emit('clearStore')"
        />
        <imageComp
            v-if="data.popupType === 'image'"
            :passedData="(Object.keys(data.widget).length ? data.widget : false)"
            @changed="handleChanging"
            @closePopup = "$emit('clearStore')"
        />
        <HR
            v-if="data.popupType === 'hr'"
            :passedData="(Object.keys(data.widget).length ? data.widget : false)"
            @changed="handleChanging"
            @closePopup = "$emit('clearStore')"
        />
        <slider
            v-if="data.popupType === 'slider'"
            :passedData="(Object.keys(data.widget).length ? data.widget : false)"
            @changed="handleChanging"
            @closePopup = "$emit('clearStore')"
        />
        <quote
            v-if="data.popupType === 'quote'"
            :passedData="(Object.keys(data.widget).length ? data.widget : false)"
            @changed="handleChanging"
            @closePopup = "$emit('clearStore')"
        />
        <videoComponent
            v-if="data.popupType === 'video'"
            :passedData="(Object.keys(data.widget).length ? data.widget : false)"
            @changed="handleChanging"
            @closePopup = "$emit('clearStore')"
        />
        <instagram
            v-if="data.popupType === 'instagram'"
            :passedData="(Object.keys(data.widget).length ? data.widget : false)"
            @changed="handleChanging"
            @closePopup = "$emit('clearStore')"
        />
    </div>
</template>

<script>
import vue from 'vue';

import imageComp from './postEditorForms/Image.vue';
import text from './postEditorForms/Text.vue';
import directSpeech from './postEditorForms/DirectSpeech.vue';
import slider from './postEditorForms/Slider.vue';
import HR from './postEditorForms/HR.vue';
import video from './postEditorForms/Video.vue';
import quote from './postEditorForms/Quote.vue';
import instagram from './postEditorForms/Instagram.vue';

export default {
    name: 'widgetLoader',

    props: {
        data: Object,
    },

    methods: {
        handleChanging(payload) {
            let widget = {
                type: this.data.popupType,
            };
            Object.assign(widget, payload);

            if (!this.data.block.widgets) {
                vue.set(this.data.block, 'widgets', [widget,]);
            } else if (typeof this.data.insertIndex !== 'undefined' && typeof this.data.insertIndex !== 'string') {
                const index = this.data.insertIndex;
                // this.$emit('add', { index, widget, })
                this.data.block.widgets.splice(this.data.insertIndex, 0, widget);
            } else if (typeof this.data.widgetIndex === 'undefined' && typeof this.data.widgetIndex !== 'string') {
                // const index = this.data.block.widgets.length;
                // this.$emit('add', { index, widget, })
                this.data.block.widgets.splice(amount, 0, widget);
            } else if (typeof this.data.widgetIndex !== 'undefined' && typeof this.data.widgetIndex !== 'string') {
                // const index = this.data.widgetIndex;
                this.data.block.widgets.splice(this.data.widgetIndex, 1, widget);
                // this.$emit('change', { index, widget, })
            }

            this.$emit('clearStore');
        },
    },
    components: {
        textForm: text,
        directSpeech,
        imageComp,
        HR,
        videoComponent: video,
        slider,
        quote,
        instagram,
    },
};
</script>