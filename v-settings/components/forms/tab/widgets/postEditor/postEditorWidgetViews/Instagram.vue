<template>
    <div>
        <iframe width="364" height="500" :src="`https://www.instagram.com/p/${formatInstagramLink()}/embed`" frameborder="0"></iframe>
    </div>
</template>

<script>
    export default {
        name: 'instagramComponent',
        props: {
            code: String,
        },

        methods: {
            formatInstagramLink(){
                let firstSplit = this.code.split('/p/');
                let secondSplit = firstSplit[firstSplit.length - 1].split('/?');
                
                return secondSplit[0]
            },
        },
    }
</script>