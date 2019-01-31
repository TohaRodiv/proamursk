<template>
    <div class="post-editor-quote-container">
        <div class="post-editor-quote">{{text}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            text: String,
        },
    }
</script>