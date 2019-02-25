<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" @click.self="closePopup">
        <div class="popup-container" style="max-width: 600px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-section-label">Добавление блока</div>
            <div class="popup-post-editor-block-picker-wrapper">
                <div
                        class="popup-post-editor-block-picker-container"
                        @click="callback(widget)"
                        v-if="widget.available.includes(data.width)"
                        v-for="widget in available_widgets">
                    <div class="icon-text" v-if="widget.type === 'text'"></div>
                    <span v-if="widget.type === 'text'">Текст</span>

                    <div class="icon-separator" v-if="widget.type === 'hr'"></div>
                    <span v-if="widget.type === 'hr'">Разделитель</span>

                    <div class="icon-card" v-if="widget.type === 'card'"></div>
                    <span v-if="widget.type === 'card'">Карточка</span>

                    <div class="icon-mobile-advertising" v-if="widget.type === 'mobile-ad'"></div>
                    <span v-if="widget.type === 'mobile-ad'">Мобильная реклама</span>

                    <div class="icon-quote" v-if="widget.type === 'quote'"></div>
                    <span v-if="widget.type === 'quote'">Цитата</span>

                    <div class="icon-imagee" v-if="widget.type === 'image'"></div>
                    <span v-if="widget.type === 'image'">Изображение</span>

                    <div class="icon-gallery" v-if="widget.type === 'gallery'"></div>
                    <span v-if="widget.type === 'gallery'">Галерея</span>

                    <div class="icon-audio" v-if="widget.type === 'audio'"></div>
                    <span v-if="widget.type === 'audio'">Аудио</span>

                    <div class="icon-test" v-if="widget.type === 'test'"></div>
                    <span v-if="widget.type === 'test'">Бальный тест</span>

                    <div class="icon-test" v-if="widget.type === 'simpleTest'"></div>
                    <span v-if="widget.type === 'simpleTest'">Простой тест</span>

                    <div class="icon-popular" v-if="widget.type === 'popular'"></div>
                    <span v-if="widget.type === 'popular'">Популярное</span>

                    <div class="icon-video" v-if="widget.type === 'video'"></div>
                    <span v-if="widget.type === 'video'">Видео</span>

                    <div class="icon-slider" v-if="widget.type === 'slider'"></div>
                    <span v-if="widget.type === 'slider'">Слайдер</span>

                    <div class="icon-direct-speech" v-if="widget.type === 'direct-speech'"></div>
                    <span v-if="widget.type === 'direct-speech'">Прямая речь</span>

                    <div class="icon-instagram" v-if="widget.type === 'instagram'"></div>
                    <span v-if="widget.type === 'instagram'">Инстаграм</span>

                    <div class="icon-tvitter" v-if="widget.type === 'twitter'"></div>
                    <span v-if="widget.type === 'twitter'">Твитер</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            data: Object,
            available_widgets: Array,
        },

        data() {
            return {
                showTransition: false,
            }
        },
        mounted() {
            setTimeout(() => this.showTransition = true, 200);
        },
        computed: {},
        methods: {
            callback(widget){
                this.$emit('createBlock', widget.type);
                this.closePopup();
            },

            closePopup(){
                this.$emit('closePopup')
            },
        },
        components: {}
    }
</script>