<template>
    <div v-html="deleteScriptTag()"></div>
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
                window.instgrm.Embeds.process();
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