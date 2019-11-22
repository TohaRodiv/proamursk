<template>
    <div>
        <div
            v-if="widget.marginTop"
            :style="{ height: widget.marginTop + 'em' }"
            class="post-editor-render-margin-top-em"
        >
            <p>{{ hovered ? widget.marginTop + ' em' : '' }}</p>
        </div>
        <div
            ref="widgetWrapper"
            :class="postEditorRenderWrapperClass"
            :style="(thisWidgetOnDrag ? 'boxShadow: 0 2px 8px 0 rgba(35, 41, 46, 0.15);' : '') + (hovered ? `border: 1px dashed #d1d6da;` : '')"
            @mouseenter="!widgetsDragActivated ? hovered = true : hovered = false"
            @mouseleave="hovered = false"
            class="post-editor-render-wrapper"
        >
            <div
                v-if="hovered || thisWidgetOnDrag"
                class="post-editor-render-info"
            >
                <div
                    :title="getWidgetType()"
                    class="post-editor-render-info-name ellipsis"
                >
                    <div>{{ getWidgetType() }}</div>
                </div>
                <div class="post-editor-render-info-buttons">
                    <button
                        @mousedown="$emit('dragWidget')"
                        class="button icon-moving"
                        style="font-size: 14px"
                    />
                    <button
                        @click="$emit('editWidget')"
                        class="button icon-edit"
                        style="font-size: 14px"
                    />
                    <button
                        @click="$emit('copyWidget')"
                        class="button icon-copy"
                        style="font-size: 14px"
                    />
                    <button
                        @click="$emit('deleteWidget')"
                        class="button icon-close"
                        style="font-size: 11px"
                    />
                </div>
            </div>
            <div
                v-if="widget.paddingTop"
                :style="{ height: widget.paddingTop + 'em' }"
                class="post-editor-render-padding-top-em"
            >
                <p>{{ hovered ? widget.paddingTop + ' em' : '' }}</p>
            </div>
            <div class="post-editor-render-content">
                <widgetLoader
                    :widget="widget"
                    :isDragOn="widgetsDragActivated"
                />
                
                <div
                    v-if="widgetsDragActivated"
                    class="post-editor-iframe-bug-preventer"
                />
            </div>
            <div
                v-if="widget.paddingBottom"
                :style="{ height: widget.paddingBottom + 'em' }"
                class="post-editor-render-padding-bottom-em"
            >
                <p>{{ hovered ? widget.paddingBottom + ' em' : '' }}</p>
            </div>
            <div
                :style="hovered ? {zIndex: 10} : ''"
                class="post-editor-render-block-buttons-container"
            >
                <div
                    v-if="hovered && !thisWidgetOnDrag"
                    class="post-editor-column-empty"
                >
                    <div>
                        <div
                            @mouseenter="mouseOverButton = uniqKey + 'add'"
                            @mouseleave="mouseOverButton = ''"
                            @click="$emit('addBlock')"
                            class="button edit-entity-round-button icon-plus post-editor-big-icon-add"
                            style="margin-right: 0;"
                        />
                        <div
                            @mouseenter="hovered = false"
                            v-if="mouseOverButton === uniqKey + 'add'"
                            class="hint-wrapper"
                        >
                            <div class="hint-inner-wrapper">
                                <div class="arrow-wrapper">
                                    <div class="hint-arrow" />
                                </div>
                                <div
                                    class="hint-message"
                                    style="padding: 6px 13px 9px 13px; color: #fff"
                                >
                                    Добавить блок
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="canBePasted">
                        <div
                            @click="$emit('pasteWidget')"
                            @mouseenter="mouseOverButton= uniqKey + 'paste'"
                            @mouseleave="mouseOverButton = ''"
                            class="button edit-entity-round-button icon-paste post-editor-big-icon-paste"
                            style="margin-right: 0;"
                        />
                        <div
                            @mouseenter="hovered = false"
                            v-if="mouseOverButton === uniqKey + 'paste'"
                            class="hint-wrapper"
                        >
                            <div class="hint-inner-wrapper">
                                <div class="arrow-wrapper">
                                    <div class="hint-arrow" />
                                </div>
                                <div
                                    class="hint-message"
                                    style="padding: 6px 13px 9px 13px; color: #fff"
                                >
                                    Вставить блок
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="widget.marginBottom"
            :style="{ height: widget.marginBottom + 'em' }"
            class="post-editor-render-margin-bottom-em"
        >
            <p>{{ hovered ? widget.marginBottom + ' em' : '' }}</p>
        </div>
    </div>
</template>

<script>
import widgetLoader from './PostEditorWidgetViews.vue';

import vue from 'vue';
import { mapState, } from 'vuex';

export default {
    name: 'PostEditorWidgetWrapper',

    components: {
        widgetLoader,
    },

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
        };
    },

    computed: {
        ...mapState({
            widgetBuffer: state => state.postEditorMain.postEditorWidgetBuffer,
        }),

        postEditorRenderWrapperClass: function() {
            return {
                'post-editor-render-wrapper-on-drag': this.thisWidgetOnDrag,
                'text': this.widget.type === 'text',
            };
        },

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
        },
    },

    methods: {
        calculateMargin(){
            let result = '';
            if (this.widget.marginTop) result += 'marginTop: ' + this.widget.marginTop + 'em;';
            if (this.widget.marginBottom) result += 'marginBottom: ' + this.widget.marginBottom + 'em;';
            return result;
        },

        calculatePadding(){
            let result = '';
            if (this.widget.paddingTop) result += 'marginTop:' + this.widget.paddingTop + 'em;';
            if (this.widget.paddingBottom) result += 'marginBottom:' + this.widget.paddingBottom + 'em;';
            return result;
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

};
</script>