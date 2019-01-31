<template>
    <iframe width="364" height="440" :src="formatInstagramLink()" frameborder="0"></iframe>
</template>

<script>
    export default {
        props: {
            code: String,
        },

        methods: {
            formatInstagramLink(){
                if (this.code[this.code.length - 1] === '/') return this.code + 'embed';
                else return this.code + '/embed'
            },
        },
    }
</script>