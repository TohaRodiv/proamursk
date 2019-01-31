<template>
    <div class="post-editor-direct-speech-wrapper">
        <div class="post-editor-direct-speech-image-container icon-image">
            <img v-if="data.image && data.image.medium_url" :src="data.image.medium_url" alt="">
        </div>
        <div class="post-editor-direct-speech-info-container">
            <div class="post-editor-direct-speech-name">{{data.fio}}</div>
            <div class="post-editor-direct-speech-job">{{data.job}}</div>
            <div class="post-editor-direct-speech-text" v-html="data.text"></div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: Object,
        },

        data() {
            return {}
        },
        mounted() {

        },
        computed: {},
        methods: {},
        components: {}
    }
</script>