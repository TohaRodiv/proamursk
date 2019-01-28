<template>
    <div class="post-editor-render-wrapper" :style="calculateMargin()" @mouseenter="hovered = true" @mouseleave="hovered = false">
        <div class="post-editor-render-margin-top-em" v-if="widget.marginTop">{{widget.marginTop + ' em'}}</div>
        <div class="post-editor-render-info">
            <div class="post-editor-render-info-name ellipsis" :title="getWidgetType()">
                <span>{{getWidgetType()}}</span>
            </div>
            <div class="post-editor-render-info-buttons">
                <button class="button icon-moving" style="font-size: 14px"></button>
                <button class="button icon-edit" style="font-size: 14px" @click="$emit('editWidget')"></button>
                <button class="button icon-copy" style="font-size: 14px"></button>
                <button class="button icon-close" style="font-size: 11px" @click="$emit('deleteWidget')"></button>
            </div>
        </div>
        <div class="post-editor-render-content" :style="calculatePadding()">
            <div class="post-editor-render-padding-top-em" v-if="widget.paddingTop">{{widget.paddingTop + ' em'}}</div>
            <textView
                    v-if="widget.type === 'text' && widget.text"
                    :text="widget.text"
            ></textView>
            <imageView
                    v-if="widget.type === 'image'"
                    :data="widget"
            ></imageView>
            <div class="post-editor-render-padding-bottom-em" v-if="widget.paddingBottom">{{widget.paddingBottom + ' em'}}</div>
        </div>
        <div class="post-editor-render-margin-bottom-em" v-if="widget.marginBottom">{{widget.marginBottom + ' em'}}</div>
        <div class="post-editor-render-block-buttons-container">
            <div class="post-editor-column-empty" v-if="hovered">
                <div
                        class="button edit-entity-round-button icon-plus"
                        style="margin-right: 0;"
                        @click="$emit('addBlock')"
                        @mouseenter="mouseOverButton= uniqKey"
                        @mouseleave="mouseOverButton = ''">
                </div>
                <div class="hint-wrapper" style="top: 10px;" v-if="mouseOverButton === uniqKey">
                    <div class="hint-inner-wrapper">
                        <div class="arrow-wrapper">
                            <div class="hint-arrow"></div>
                        </div>
                        <div class="hint-message" style="padding: 6px 13px 9px 13px; color: #fff">Добавить блок</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import textView from './postEditorWidgetViews/Text.vue'
    import imageView from './postEditorWidgetViews/Image.vue'

    export default {
        props: {
            widget: Object,
            uniqKey: String,
        },
        data() {
            return {
                mouseOverButton: '',
                hovered: false,
            }
        },
        mounted() {

        },
        computed: {},
        methods: {
            calculateMargin(){
                let result = '';
                if (this.widget.marginTop) result += 'marginTop:' + this.widget.marginTop + 'em;';
                if (this.widget.marginBottom) result += 'marginBottom:' + this.widget.marginBottom + 'em;';
                return result
            },

            calculatePadding(){
                let result = '';
                if (this.widget.paddingTop) result += 'marginTop:' + this.widget.paddingTop + 'em;';
                if (this.widget.paddingBottom) result += 'marginBottom:' + this.widget.paddingBottom + 'em;';
                return result
            },

            getWidgetType(){
                if (this.widget.type === 'image') return 'Изображение';
                else if (this.widget.type === 'text') return 'Текст';
                else if (this.widget.type === 'hr') return 'Разделитель';
                else if (this.widget.type === 'video') return 'Видео';
                else if (this.widget.type === 'slider') return 'Слайдер';
                else if (this.widget.type === 'quote') return 'Цитата';
                else if (this.widget.type === 'direct-speech') return 'Прямая речь';
                else if (this.widget.type === 'instagram') return 'Инстраграм';
            },
        },
        components: {
            textView,
            imageView,
        }
    }
</script>