<template>
    <div class="post-editor-image-widget">
        <div class="post-editor-image-widget-container">
            <div ref="blacked" class="post-editor-image-widget-blacked" v-if="!data.backgroundFlag || !data.link">
                <a class="post-editor-image-widget-link" v-if="data.link" :href="data.link" target="_blank"></a>
            </div>
            <a class="post-editor-image-widget-link" v-if="data.link && data.backgroundFlag" :href="data.link" target="_blank"></a>
            <img ref="image" :src="data.image.large_url" style="width: 100%;">
        </div>
        <div class="post-editor-image-widget-sign" :style="{textAlign: data.align}">{{data.sign}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            data: Object,
        },

        watch: {
            'data': function () {
                this.setBlackedHeight();
            }
        },

        mounted() {
            this.setBlackedHeight();
            console.log('sssSSsss');
        },
        methods: {
            setBlackedHeight(){
                let image = this.$refs.image;
                let blacked = this.$refs.blacked;
                blacked.style.height = getComputedStyle(image).height;
            },
        },
    }
</script>