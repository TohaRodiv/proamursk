<template>
    <div class="post-editor-text-widget" style="margin-left: 0; margin-right: 0;" v-html="text"></div>
</template>

<script>
    export default {
        props: {
            text: String
        },
    }
</script>