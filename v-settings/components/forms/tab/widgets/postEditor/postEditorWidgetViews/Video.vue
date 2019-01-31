<template>
    <iframe
            width="656"
            height="315"
            :src="handleYoutubeLinkFormat()"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
    </iframe>
</template>

<script>
    export default {
        props: {
            code: String
        },

        methods: {
            handleYoutubeLinkFormat(){
                let link = this.code;
                let withoutWatch = link.split('watch?v=');
                withoutWatch[0] = withoutWatch[0] + 'embed/';
                link = withoutWatch.join('');
                if (link.indexOf('&t')) {
                    let withoutTime = link.split('&t');
                    link = withoutTime[0];
                }
                if (link.indexOf('?t')) {
                    let withoutTime = link.split('?t');
                    link = withoutTime[0];
                }
                return link
            },
        },
    }
</script>