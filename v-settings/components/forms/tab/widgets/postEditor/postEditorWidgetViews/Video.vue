<template>
    <div>
        <iframe
                v-if="code.indexOf('youtube.com') !== -1"
                width="656"
                height="360"
                :src="handleYoutubeLinkFormat()"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
        </iframe>
        <iframe
                v-if="code.indexOf('vimeo.com') !== -1"
                :src="handleVimeoLinkFormat()"
                width="656"
                height="360"
                frameborder="0"
                webkitallowfullscreen
                mozallowfullscreen
                allowfullscreen>
        </iframe>
    </div>
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
                if (link.indexOf('&t') !== -1) {
                    let withoutTime = link.split('&t');
                    link = withoutTime[0];
                }
                if (link.indexOf('?t') !== -1) {
                    let withoutTime = link.split('?t');
                    link = withoutTime[0];
                }
                return link
            },

            handleVimeoLinkFormat(){
                let base = 'https://player.vimeo.com/video/';
                let link = this.code.split('/');
                return base + link[link.length - 1];
            },
        },
    }
</script>