<template>
    <div :style="[widget.type === 'instagram' ? {minHeight: '576px', backgroundColor: 'rgba(233, 243, 253, .2)', borderRadius: '5px'} : '', widget.type === 'video' ? {backgroundColor: 'rgba(233, 243, 253, .2)', borderRadius: '5px'} : '']">
        <imageComponent
            v-if="widget.type === 'image'"
            :data="widget"
        />
        <textComponent
            v-if="widget.type === 'text' && widget.text"
            :text="widget.text"
        />
        <slider
            v-if="widget.type === 'slider'"
            :isDragOn="isDragOn"
            :widget="widget"
        />
        <separator
            v-if="widget.type === 'hr'"/>
        <quote
            v-if="widget.type === 'quote'"
            :widget="widget"
        />
        <directSpeech
            v-if="widget.type === 'direct-speech'"
            :data="widget"
        />
        <videoComponent
            v-if="widget.type === 'video'"
            :code="widget.link"
            :description="widget.description"
        />
        <instagram
            v-if="widget.type === 'instagram' && instaReloader"
            @reloadMe="reloadInstargam()"
            :code="widget.link"
        />
    </div>
</template>

<script>
import imageComponent from './postEditorWidgetViews/Image.vue';
import textComponent from './postEditorWidgetViews/Text.vue';
import separator from './postEditorWidgetViews/HR.vue';
import slider from './postEditorWidgetViews/Slider.vue';
import quote from './postEditorWidgetViews/Quote.vue';
import directSpeech from './postEditorWidgetViews/DirectSpeech.vue';
import video from './postEditorWidgetViews/Video.vue';
import instagram from './postEditorWidgetViews/Instagram.vue';

export default {
    props: {
        widget: Object,
        isDragOn: Boolean,
    },

    data() {
        return {
            instaReloader: true,
        };
    },

    methods: {
        reloadInstargam(){
            this.instaReloader = false;
            setTimeout(() => {
                this.instaReloader = true;
            }, 500);
        },
    },

    components: {
        imageComponent,
        textComponent,
        separator,
        slider,
        quote,
        directSpeech,
        videoComponent: video,
        instagram,
    },
};
</script>