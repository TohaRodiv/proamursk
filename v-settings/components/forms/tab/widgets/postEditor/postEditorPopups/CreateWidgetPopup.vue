<template>
    <cp-popup-wrap
        @clickaway="close"
        @close="close"
        disable-preloader
    >
        <div class="popup-post-editor-section-label">
            Добавление блока
        </div>
        <div class="popup-post-editor-block-picker-wrapper">
            <div
                @click="click(widget)"
                v-if="widget.available.includes(data.width)"
                v-for="widget in availableWidgets"
                class="popup-post-editor-block-picker-container"
            >
                <div
                    v-if="widget.type === 'text'"
                    class="icon-text"
                />
                <span v-if="widget.type === 'text'">Текст</span>

                <div
                    v-if="widget.type === 'hr'"
                    class="icon-separator"
                />
                <span v-if="widget.type === 'hr'">Разделитель</span>

                <div
                    v-if="widget.type === 'card'"
                    class="icon-card"
                />
                <span v-if="widget.type === 'card'">Карточка</span>

                <div
                    v-if="widget.type === 'mobile-ad'"
                    class="icon-mobile-advertising"
                />
                <span v-if="widget.type === 'mobile-ad'">Мобильная реклама</span>

                <div
                    v-if="widget.type === 'quote'"
                    class="icon-quote"
                />
                <span v-if="widget.type === 'quote'">Цитата</span>

                <div
                    v-if="widget.type === 'image'"
                    class="icon-imagee"
                />
                <span v-if="widget.type === 'image'">Изображение</span>

                <div
                    v-if="widget.type === 'gallery'"
                    class="icon-gallery"
                />
                <span v-if="widget.type === 'gallery'">Галерея</span>

                <div
                    v-if="widget.type === 'audio'"
                    class="icon-audio"
                />
                <span v-if="widget.type === 'audio'">Аудио</span>

                <div
                    v-if="widget.type === 'test'"
                    class="icon-test"
                />
                <span v-if="widget.type === 'test'">Бальный тест</span>

                <div
                    v-if="widget.type === 'simpleTest'"
                    class="icon-test"
                />
                <span v-if="widget.type === 'simpleTest'">Простой тест</span>

                <div
                    v-if="widget.type === 'popular'"
                    class="icon-popular"
                />
                <span v-if="widget.type === 'popular'">Популярное</span>

                <div
                    v-if="widget.type === 'video'"
                    class="icon-video"
                />
                <span v-if="widget.type === 'video'">Видео</span>

                <div
                    v-if="widget.type === 'slider'"
                    class="icon-slider"
                />
                <span v-if="widget.type === 'slider'">Слайдер</span>

                <div
                    v-if="widget.type === 'direct-speech'"
                    class="icon-direct-speech"
                />
                <span v-if="widget.type === 'direct-speech'">Прямая речь</span>

                <div
                    v-if="widget.type === 'instagram'"
                    class="icon-instagram"
                />
                <span v-if="widget.type === 'instagram'">Инстаграм</span>

                <div
                    v-if="widget.type === 'twitter'"
                    class="icon-tvitter"
                />
                <span v-if="widget.type === 'twitter'">Твитер</span>
            </div>
        </div>
    </cp-popup-wrap>
</template>

<script>
import CpPopupWrap from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupWrap.vue';
import popupMixin from '../../../../../../../cp_vue/frontend/vue/components/popups/popupMixin';

export default {
    name: 'CreateWidgetPopup',

    components: {
        CpPopupWrap,
    },

    mixins: [popupMixin,],

    props: {
        data: Object,
        availableWidgets: Array,
    },

    methods: {
        click(widget) {
            this.callback(widget.type);
            this.close();
        },
    },
};
</script>