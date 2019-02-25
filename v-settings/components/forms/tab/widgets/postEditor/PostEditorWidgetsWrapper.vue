<template>
    <div class="post-editor-render-wrapper"
         ref="widgetWrapper"
         :class="{'post-editor-render-wrapper-on-drag': thisWidgetOnDrag}"
         :style="calculateMargin() + (thisWidgetOnDrag ? 'boxShadow: 0 2px 8px 0 rgba(35, 41, 46, 0.15);' : '') + (hovered ? `border: 1px dashed #d1d6da;` : '')"
         @mouseenter="!widgetsDragActivated ? hovered = true : hovered = false"
         @mouseleave="hovered = false">
        <div class="post-editor-render-margin-top-em" v-if="widget.marginTop">{{hovered ? widget.marginTop + ' em' : ''}}</div>
        <div class="post-editor-render-info" v-if="hovered || thisWidgetOnDrag">
            <div class="post-editor-render-info-name ellipsis" :title="getWidgetType()">
                <div>{{getWidgetType()}}</div>
            </div>
            <div class="post-editor-render-info-buttons">
                <button class="button icon-moving" style="font-size: 14px" @mousedown="$emit('dragWidget')"></button>
                <button class="button icon-edit" style="font-size: 14px" @click="$emit('editWidget')"></button>
                <button class="button icon-copy" style="font-size: 14px" @click="$emit('copyWidget')"></button>
                <button class="button icon-close" style="font-size: 11px" @click="$emit('deleteWidget')"></button>
            </div>
        </div>
        <div class="post-editor-render-content" :style="calculatePadding()">
            <div class="post-editor-render-padding-top-em" v-if="widget.paddingTop">{{hovered ? widget.paddingTop + ' em' : ''}}</div>
            <widgetLoader :widget="widget" :isDragOn="widgetsDragActivated"></widgetLoader>
            <div class="post-editor-render-padding-bottom-em" v-if="widget.paddingBottom">{{hovered ? widget.paddingBottom + ' em' : ''}}</div>
            <div class="post-editor-iframe-bug-preventer" v-if="widgetsDragActivated"></div>
        </div>
        <div class="post-editor-render-block-buttons-container" :style="hovered ? {zIndex: 10} : ''">
            <div
                    class="post-editor-column-empty"
                    v-if="hovered && !thisWidgetOnDrag">
                <div>
                    <div
                            class="button edit-entity-round-button icon-plus post-editor-big-icon-add"
                            @mouseenter="mouseOverButton = uniqKey + 'add'"
                            @mouseleave="mouseOverButton = ''"
                            style="margin-right: 0;"
                            @click="$emit('addBlock')">
                    </div>
                    <div class="hint-wrapper" @mouseenter="hovered = false" v-if="mouseOverButton === uniqKey + 'add'">
                        <div class="hint-inner-wrapper">
                            <div class="arrow-wrapper">
                                <div class="hint-arrow"></div>
                            </div>
                            <div class="hint-message" style="padding: 6px 13px 9px 13px; color: #fff">Добавить блок</div>
                        </div>
                    </div>
                </div>
                <div v-if="canBePasted">
                    <div
                            class="button edit-entity-round-button icon-paste post-editor-big-icon-paste"
                            @click="$emit('pasteWidget')"
                            @mouseenter="mouseOverButton= uniqKey + 'paste'"
                            @mouseleave="mouseOverButton = ''"
                            style="margin-right: 0;">
                    </div>
                    <div class="hint-wrapper" @mouseenter="hovered = false" v-if="mouseOverButton === uniqKey + 'paste'">
                        <div class="hint-inner-wrapper">
                            <div class="arrow-wrapper">
                                <div class="hint-arrow"></div>
                            </div>
                            <div class="hint-message" style="padding: 6px 13px 9px 13px; color: #fff">Вставить блок</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="post-editor-render-margin-bottom-em" v-if="widget.marginBottom">{{hovered ? widget.marginBottom + ' em' : ''}}</div>
    </div>
</template>

<script>
    import widgetLoader from './PostEditorWidgetViews.vue'

    import vue from 'vue';
    import {mapState} from 'vuex'

    export default {
        props: {
            widgetsDragActivated: Boolean,
            thisWidgetOnDrag: Boolean,
            onDragHeight: Number,
            canBePasted: Boolean,
            widget: Object,
            uniqKey: String,
        },
        data() {
            return {
                mouseOverButton: '',
                absoluteHeight: '',
                hovered: false,
            }
        },

        watch: {
            'widgetsDragActivated': function (newValue) {
                //У таких виджетов при драге ресайзится контент и всё скачет. Если при начале драга жётско задать им высоту то всё будет хорошо.
                if (this.widget.type === 'slider' || this.widget.type === 'instagram' || this.widget.type === 'video') {
                    if (newValue === true) {
                        let element = this.$refs.widgetWrapper;
                        vue.set(this.widget, 'absoluteHeight', window.getComputedStyle(element)['height']);
                    } else {
                        setTimeout(() => {
                            vue.delete(this.widget, 'absoluteHeight');
                        }, 2000);
                    }
                }
            }
        },

        computed: {
            ...mapState({
                widgetBuffer: state => state.postEditorMain.postEditorWidgetBuffer,
            })
        },

        methods: {
            calculateMargin(){
                let result = '';
                if (this.widget.marginTop) result += 'marginTop: ' + this.widget.marginTop + 'em;';
                if (this.widget.marginBottom) result += 'marginBottom: ' + this.widget.marginBottom + 'em;';
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
            widgetLoader,
        }
    }
</script>