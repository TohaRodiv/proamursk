<template>
    <div class="post-editor-quote-wrapper">
        <div class="post-editor-quote-container">
            <div class="post-editor-direct-speech-name" style="font-style: italic; font-weight: 400;">{{widget.title}}</div>
            <div class="post-editor-quote">{{widget.text}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            widget: Object,
        },
    }
</script>