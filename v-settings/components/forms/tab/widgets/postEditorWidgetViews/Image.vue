<template>
    <div class="post-editor-image-widget">
        <img :src="data.image.large_url" style="width: 100%;">
        <div class="post-editor-image-widget-sign" :style="{textAlign: data.align}">{{data.sign}}</div>
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