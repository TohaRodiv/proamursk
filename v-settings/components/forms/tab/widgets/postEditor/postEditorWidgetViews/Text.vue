<template>
    <div class="post-editor-text-widget" v-html="text"></div>
</template>

<script>
    export default {
        props: {
            text: String
        },
    }
</script>