<template>
    <div>
        <iframe
                v-if="computedIsYoutube"
                width="656"
                height="360"
                :src="handleYoutubeLinkFormat()"
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
        </iframe>
        <iframe
                v-if="computedIsVimeo"
                :src="handleVimeoLinkFormat()"
                width="656"
                height="360"
                frameborder="0"
                webkitallowfullscreen
                mozallowfullscreen
                allowfullscreen>
        </iframe>
        <div class="post-editor-image-widget-sign" v-if="description" style="text-align: left">{{description}}</div>
    </div>
</template>

<script>
    export default {
        props: {
            code: String,
            description: String,
        },

        data() {
            return {}
        },

        computed: {
            computedIsShortYoutube() {
                
                const link = this.code;

                if (link.indexOf('youtu.be') != -1) {
                    return true;
                }

                return false;
            },

            computedIsYoutube() {
                const link = this.code;

                if (link.indexOf('youtube.com') != -1) {
                    return true;
                }

                if (this.computedIsShortYoutube) {
                    return true;
                }

                return false;
            },

            computedIsVimeo() {
                const link = this.code;
                
                if (link.indexOf('vimeo.com') != -1) {
                    return true;
                }

                return false;
            }
        },

        methods: {
            handleYoutubeLinkFormat() {
                const baseUrl = 'https://www.youtube.com/embed/'
                let link = this.code;
                
                const element = document.createElement('a');
                
                element.setAttribute('href', link);
                
                const pathname = element.pathname;
                
                element.remove();

                if (this.computedIsShortYoutube) {
                    return baseUrl + pathname.replace('/', '');
                } else {
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
                    return link;
                }
                
            },

            handleVimeoLinkFormat(){
                let base = 'https://player.vimeo.com/video/';
                let link = this.code.split('/');
                return base + link[link.length - 1];
            },
        },
    }
</script>