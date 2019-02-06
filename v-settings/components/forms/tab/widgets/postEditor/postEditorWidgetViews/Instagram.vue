<template>
    <div v-html="deleteScriptTag()" class="post-editor-instagram"></div>
</template>

<script>


    export default {
        name: 'instagramComponent',
        props: {
            code: String,
        },

        watch: {
            'code': function () {
                this.$emit('reloadMe');
            }
        },

        data(){
            return {
                instaScript: '',
            }
        },

        mounted(){
            let instaScript = document.createElement('script');
            instaScript.setAttribute('src', '//www.instagram.com/embed.js');
            document.head.appendChild(instaScript);
            if (window.instgrm) {
                setTimeout(() => {
                    window.instgrm.Embeds.process();
                }, 1000);
            }
        },

        methods: {
            deleteScriptTag(){
                let parted = this.code.split('<script');
                return parted[0];
            },
        },
    }
</script>