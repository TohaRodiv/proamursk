<template>
    <div class="post-editor-wrapper">
        <div
            class="post-editor-empty-wrapper"
            v-if="!content.length">
            <div class="tab-left-label col4"/>
            <div
                class="post-editor-empty-container"
                :class="{ 'post-editor-empty-error' : options.invalid }"
                @mouseenter="focusEmptyContainer = true"
                @mouseleave="focusEmptyContainer = false"
            >
                <img
                    src="../../../../../src/images/post-editor-placeholder.svg"
                    class="post-editor-empty-icon"
                    alt="">
                <div>
                    Пустая публикация. Чтобы добавить контент, создайте первую секцию
                </div>
                <button
                    class="button post-editor-button"
                    @click="addSectionPopup = true">
                    <div class="icon-plus post-editor-button-icon"/>
                    <div>
                        Добавить секцию
                    </div>
                </button>
            </div>
        </div>
        <div
            v-if="content.length"
            class="post-editor-outer-wrapper">
            <div
                class="post-editor-add-section-wrapper"
                style="margin-left: 240px; margin-top: 0;">
                <div
                    class="post-editor-add-section"
                    @click="addSectionPopup = 0">
                    <div class="icon-plus"/>
                    <div>
                        Добавить секцию
                    </div>
                </div>
                <div
                    class="post-editor-paste-section"
                    v-if="sectionBuffer.length"
                    @click="pasteSection(0)">
                    <div class="icon-paste"/>
                    <div>
                        Вставить секцию
                    </div>
                </div>
            </div>
            <div
                class="post-editor-block-wrapper"
                :class="{'post-editor-block-wrapper-on-drag': isOnDrag(section)}"
                :style="[section.marginTop && secDex !== 0 ? {marginTop: `calc(60px + ${section.marginTop}em)`} : '', section.marginBottom && secDex !== content.length - 1 ? {marginBottom: `calc(60px + ${section.marginBottom}em)`} : '']"
                v-for="(section, secDex) in content"
                :id="section.dragId"
                @mouseenter="sectionHovered = secDex"
                @mouseleave="sectionHovered = ''">
                <div
                    class="post-editor-add-section-helper-top"
                    v-if="secDex !== 0">
                    <div
                        style="margin-top: 32px;"
                        v-if="section.marginTop && (sectionHovered !== secDex || sectionOnDrag)">
                        {{section.marginTop + ' em'}}
                    </div>
                    <div
                        v-if="sectionHovered === secDex && !sectionOnDrag && !widgetOnDrag"
                        class="post-editor-add-section-wrapper">
                        <div
                            class="post-editor-add-section"
                            @click="addSectionPopup = secDex">
                            <div class="icon-plus"/>
                            <div>
                                Добавить секцию
                            </div>
                        </div>
                        <div
                            class="post-editor-paste-section"
                            v-if="sectionBuffer.length"
                            @click="pasteSection(secDex)">
                            <div class="icon-paste"/>
                            <div>
                                Вставить секцию
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-left-label col4 post-editor-block-info">
                    <div>
                        {{numberToWord(section.columns.length)}} {{multiEnds(section.columns.length)}} / {{concatColumnNumbers(section)}}
                    </div>
                    <div
                        class="post-editor-block-info-buttons"
                        v-if="sectionHovered === secDex && !sectionOnDrag && !widgetOnDrag">
                        <button
                            class="button blue-button-small icon-moving"
                            @mousedown="startSectionDnd(secDex, $event)"/>
                        <button
                            v-if="sectionIsConfigurable"
                            class="button blue-button-small icon-edit"
                            @click="showChangeSectionPopup(secDex, section)"/>
                        <button
                            class="button blue-button-small icon-copy"
                            @click="copySection(section)"/>
                        <button
                            class="button delete-button-round-small icon-close"
                            @click="deleteSection(secDex)"/>
                    </div>
                </div>
                <div class="post-editor-inned-block-wrapper">
                    <div
                        class="post-editor-column"
                        v-for="(block, blockDex) in section.columns"
                        :id="block.dragId ? block.dragId : ''"
                        :style="(`flex: ${block.width}`)">
                        <div :style="setSectionPadding(section, block) + (`box-shadow: ${isOnDrag(section) ? '0 2px 8px 0 rgba(35, 41, 46, 0.15)' : ''}`)">
                            <div
                                style="height: 15px; width: 100%;"
                                v-if="!block.widgets || !block.widgets.length"/>
                            <div
                                class="post-editor-column-empty"
                                v-if="!block.widgets || !block.widgets.length">
                                <div>
                                    <div
                                        class="button edit-entity-round-button icon-plus post-editor-big-icon-add"
                                        @mouseenter="mouseOverButton=`${secDex}_${blockDex}_add`"
                                        @mouseleave="mouseOverButton = ''"
                                        @click="openCreateWidgetPopup(block, section)"
                                        style="margin-right: 0;"/>
                                    <div
                                        class="hint-wrapper"
                                        v-if="mouseOverButton === `${secDex}_${blockDex}_add`">
                                        <div class="hint-inner-wrapper">
                                            <div class="arrow-wrapper">
                                                <div class="hint-arrow"/>
                                            </div>
                                            <div
                                                class="hint-message"
                                                style="padding: 6px 13px 9px 13px; color: #fff">
                                                Добавить блок
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="canWidgetBePasted(block.width)">
                                    <div
                                        @click="pasteWidget(secDex, blockDex)"
                                        @mouseenter="mouseOverButton=`${secDex}_${blockDex}_paste`"
                                        @mouseleave="mouseOverButton = ''"
                                        class="button edit-entity-round-button icon-paste post-editor-big-icon-paste"
                                        style="margin-right: 0;"/>
                                    <div
                                        class="hint-wrapper"
                                        v-if="mouseOverButton === `${secDex}_${blockDex}_paste`">
                                        <div class="hint-inner-wrapper">
                                            <div class="arrow-wrapper">
                                                <div class="hint-arrow"/>
                                            </div>
                                            <div
                                                class="hint-message"
                                                style="padding: 6px 13px 9px 13px; color: #fff">
                                                Вставить блок
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="post-editor-column-inner-padding"
                                style="top: 10px;"
                                v-if="section.paddingTop && block.widgets && block.widgets.length">
                                <div>
                                    {{section.paddingTop + ' em'}}
                                </div>
                            </div>
                            <postEditorWidgetWrapper
                                v-if="block.widgets && block.widgets.length"
                                v-for="(widget, widDex) in block.widgets"
                                :id="widget.dragId ? widget.dragId : ''"
                                :style="widget.absoluteHeight ? `height: ${widget.absoluteHeight}` : ''"
                                :key="`${secDex}_${blockDex}_${widDex}`"
                                :uniqKey="`${secDex}_${blockDex}_${widDex}`"
                                :widget="widget"
                                :canBePasted="canWidgetBePasted(block.width)"
                                :onDragHeight="+heightOnDrag"
                                :thisWidgetOnDrag="isWidgetOnDrag(widget)"
                                :widgetsDragActivated="widgetOnDrag !== false"
                                @deleteWidget="deleteWidget(block.widgets, widDex)"
                                @addBlock="openCreateWidgetPopup(block, section, widDex)"
                                @editWidget="editWidget(block, widget, widDex)"
                                @copyWidget="copyWidget(widget)"
                                @pasteWidget="pasteWidget(secDex, blockDex, widDex)"
                                @dragWidget="widgetDragStart(secDex, blockDex, widDex)"
                            />
                            <div
                                class="post-editor-column-inner-padding"
                                style="bottom: 10px;"
                                v-if="section.paddingBottom && block.widgets && block.widgets.length">
                                <div>
                                    {{section.paddingBottom + ' em'}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    class="post-editor-add-section-helper-bottom"
                    v-if="secDex !== content.length - 1">
                    <div
                        style="margin-top: 7px;"
                        v-if="section.marginBottom && (sectionHovered !== secDex || sectionOnDrag)">
                        {{section.marginBottom + ' em'}}
                    </div>
                    <div
                        v-if="sectionHovered === secDex && !sectionOnDrag && !widgetOnDrag"
                        class="post-editor-add-section-wrapper">
                        <div
                            class="post-editor-add-section"
                            @click="addSectionPopup = secDex + 1">
                            <div class="icon-plus"/>
                            <div>
                                Добавить секцию
                            </div>
                        </div>
                        <div
                            class="post-editor-paste-section"
                            v-if="sectionBuffer.length"
                            @click="pasteSection(secDex + 1)">
                            <div class="icon-paste"/>
                            <div>
                                Вставить секцию
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="post-editor-add-section-wrapper"
                style="margin-left: 240px; margin-bottom: 0;">
                <div
                    class="post-editor-add-section"
                    @click="addSectionPopup = content.length">
                    <div class="icon-plus"/>
                    <div>
                        Добавить секцию
                    </div>
                </div>
                <div
                    class="post-editor-paste-section"
                    v-if="sectionBuffer.length"
                    @click="pasteSection(content.length)">
                    <div class="icon-paste"/>
                    <div>
                        Вставить секцию
                    </div>
                </div>
            </div>
        </div>
        <addSectionPopup
            v-if="addSectionPopup !== false"
            @createSection="createSection"
            @closePopup="addSectionPopup = false"
            :placeIn="addSectionPopup !== false ? addSectionPopup : false"
            :config="editorConfig"
        />
        <changeSectionPopup
            v-if="changeSectionPopup !== false"
            :currentState="sectionForEdit"
            :config="editorConfig.sectionConfigs"
            @changes="changeSection"
            @closePopup="closeChangeSectionPopup"
        />
        <pickToCreatePopup
            v-if="createPicker.showPicker"
            :data="createPicker"
            :available_widgets="editorConfig.widgets"
            @createBlock="callProperForm"
            @closePopup="closeCreateWidget()"
        />
        <formsComponent
            :data="widgetForm"
            @clearStore="clearFormsConfig"
        />
        <div
            class="post-editor-error-empty-container"
            v-if="options.invalid && focusEmptyContainer"
        >
            <div class="tab-left-label col4"/>
            <div class="post-editor-error-message">
                {{ options.message }}
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import vue from 'vue';

import addSectionPopup from './postEditorPopups/AddSectionPopup.vue';
import changeSectionPopup from './postEditorPopups/ChangeSectionPopup.vue';
import pickToCreatePopup from './postEditorPopups/CreateWidgetPopup.vue';
import postEditorWidgetWrapper from './PostEditorWidgetsWrapper.vue';
import formsComponent from './PostEditorForms.vue';


import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import wordFormHelper from '../../../../../../cp_vue/frontend/vue/helpers/wordForms';
import { mapGetters, mapState, } from 'vuex';

export default {
    props: {
        options: Object,
        isBlocked: Boolean,
        passedData: [Array, String,],
    },

    data(){
        return {
            createPicker: {
                showPicker: false,
                width: '',
                isPercentage: false,
            },

            widgetForm: {
                widgetIndex: '',
                insertIndex: '',
                popupType: false,
                block: {},
                widget: {},
            },

            addSectionPopup: false,
            changeSectionPopup: false,
            sectionHovered: '',
            mouseOverButton: '',
            sectionForEdit: {},
            content: [],

            sectionOnDrag: false,
            sectionOnDragHTML: false,
            clonedOnDrag: false,
            stopScroll: true,
            positionOnClick: {
                top: 0,
                left: 0,
                y: 0,
                x: 0,
            },
            lastDeltaY: '',
            currentMoveDirection: '', //top, bottom
            lastKnownDirection: '',
            lastKnownId: '',

            mouseOverWidget: [],
            mouseEvent: {},

            widgetCoords: {},
            widgetOnDrag: false,
            widgetOnDragHTML: false,
            clonedWidgetOnDrag: false,
            heightOnDrag: 0,
            widgetPositionOnClick: {
                top: 0,
                left: 0,
                y: 0,
                x: 0,
            },
            lastKnownWidgetY: '',
            currentWidgetMoveDirection: '', //top, bottom
            lastKnownWidgetDirection: '',
            lastKnownWidgetId: '',
            focusEmptyContainer: false,
        };
    },

    watch: {
        'content': {
            handler: function () {
                this.$store.commit('setFormsObject', { [this.options.codename]: this.content, });
                this.clearError();
            },

            deep: true,
        },

        'passedData': function () {
            if (this.passedData && this.passedData.length && typeof this.passedData !== 'string') {
                this.content = this.passedData;
            }
        },
    },

    created(){
        document.addEventListener('mouseup', this.DragEnd);
        document.addEventListener('mousemove', function (e) {
            if (this.sectionOnDrag) this.sectionHoverFunction(e);
            if (this.widgetOnDrag) this.widgetHoverFunction(e);
            this.mouseEvent = e;
        }.bind(this));
    },

    mounted(){
        if (this.passedData && this.passedData.length && typeof this.passedData !== 'string') {
            this.content = this.passedData;
        }
    },

    computed: {
        ...mapState({
            allConfigs: state => state.configs.postEditor,
            widgetBuffer: state => state.postEditorMain.postEditorWidgetBuffer,
        }),

        sectionBuffer(){
            return this.$store.getters.getPostEditorSection(!this.options.configCodename ? 'default' : this.options.configCodename);
        },

        editorConfig(){
            if (this.options.configCodename)
                return this.allConfigs[this.options.configCodename];
            else
                return this.allConfigs.default;
        },

        sectionIsConfigurable(){
            if (this.editorConfig.sectionConfigs) {
                let object = this.editorConfig.sectionConfigs;
                for (let prop in object) {
                    if (object.hasOwnProperty(prop) && object[prop]) {
                        return true;
                    }
                }
            }
            return false;
        },
    },

    methods: {
        //-------------Начало функций для dragNDrop виджета--------------------
        widgetDragStart(secDex, blockDex, widDex, e){
            this.widgetCoords = { secDex, blockDex, widDex , };
            this.widgetOnDrag = this.content[secDex].columns[blockDex].widgets[widDex];
            this.createWidgetDragIds();
            this.$nextTick(() => { //$nexttick чтобы все ненужные элементы успели спрятатся, а не тянулись в призраке
                let element = document.getElementsByClassName('post-editor-render-wrapper-on-drag')[this.widgetOnDrag.dragId];
                this.widgetOnDragHTML = element;
                this.heightOnDrag = window.getComputedStyle(this.widgetOnDragHTML)['height'];
                this.heightOnDrag = this.heightOnDrag.slice(0, this.heightOnDrag.length - 2);
                let clone = element.cloneNode(true);
                clone.style.backgroundColor = '#fff';
                this.clonedWidgetOnDrag = clone;
                clone.classList.remove('post-editor-render-wrapper-on-drag');
                clone.style.position = 'fixed';
                clone.style.zIndex = 1000;
                document.body.appendChild(clone);
                this.setWidgetClonePositionOnClick(this.mouseEvent);
            });
        },

        setWidgetClonePositionOnClick(mouseE){
            let style = window.getComputedStyle(this.widgetOnDragHTML);
            let marginTop = style['margin-top'];
            let marginTopNumbers = marginTop.slice(0, marginTop.length - 2);

            let wrapperCords = this.widgetOnDragHTML.getBoundingClientRect();
            let buttonCords = document.elementFromPoint(mouseE.pageX, mouseE.pageY).getBoundingClientRect();
            let fromBorderToButtonClick = mouseE.pageY - 7 - buttonCords.top;
            let calculatedTop = mouseE.pageY - fromBorderToButtonClick - marginTopNumbers;
            this.clonedWidgetOnDrag.style.top = calculatedTop + 'px';
            this.clonedWidgetOnDrag.style.left = wrapperCords.left + 'px';
            this.clonedWidgetOnDrag.style.width = style['width'];

            vue.set(this.widgetPositionOnClick, 'top', calculatedTop);
            vue.set(this.widgetPositionOnClick, 'left', wrapperCords.left);
            vue.set(this.widgetPositionOnClick, 'y', mouseE.pageY);
            vue.set(this.widgetPositionOnClick, 'x', mouseE.pageX);
        },

        setCloneWidgetPositionOnMove(e){
            let deltaY = e.pageY - this.widgetPositionOnClick.y;
            let deltaX = e.pageX - this.widgetPositionOnClick.x;
            this.clonedWidgetOnDrag.style.top = this.widgetPositionOnClick.top + deltaY + 'px';
            this.clonedWidgetOnDrag.style.left = this.widgetPositionOnClick.left + deltaX + 'px';
        },

        findWidgetDeltaYDirection(e){
            if (this.lastKnownWidgetY !== e.pageY && this.lastKnownWidgetY && Math.abs(this.lastKnownWidgetY - e.pageY) >= 5) {
                if (this.lastKnownWidgetY < e.pageY) this.currentWidgetMoveDirection = 'bottom';
                else this.currentWidgetMoveDirection = 'top';
            }

            this.lastKnownWidgetY = e.pageY;
        },

        widgetHoverFunction: throttle (function (e) {
            this.mouseOverWidget = document.elementsFromPoint(e.pageX, e.pageY);
            if (this.widgetOnDrag) {
                this.findWidgetDeltaYDirection(e);
                this.setCloneWidgetPositionOnMove(e);
                let element = {};
                for (let i = 0; i < this.mouseOverWidget.length; i++) {
                    if (this.dragBlockAvailable(this.mouseOverWidget[i]) && this.dragWidthAvailable(this.mouseOverWidget[i].id) && this.isAbleToMoveWidget(this.mouseOverWidget[i].id)) {
                        this.lastKnownWidgetDirection = this.currentWidgetMoveDirection;
                        this.lastKnownWidgetId = this.mouseOverWidget[i].id;
                        element = this.mouseOverWidget[i];
                        this.changeWidgetCloneWidth(this.mouseOverWidget[i], e);
                        this.moveWidgetTo(element.id);
                        break;
                    }
                }

                if (e.pageY <= 200) {
                    this.stopScroll = false;
                    this.scrollTo('top');
                } else if (e.pageY >= window.innerHeight - 200) {
                    this.stopScroll = false;
                    this.scrollTo('bottom');
                } else {
                    this.stopScroll = true;
                }
            }
        }, 100),

        changeWidgetCloneWidth(element, e){
            let elementWidth = window.getComputedStyle(element)['width'];
            let elementClearWidth = +elementWidth.slice(0, elementWidth.length - 2);

            let cloneWidth = window.getComputedStyle(this.clonedWidgetOnDrag)['width'];
            let cloneClearWidth = +cloneWidth.slice(0, cloneWidth.length - 2);

            let cloneLeft = window.getComputedStyle(this.clonedWidgetOnDrag)['left'];
            let cloneClearLeft = +cloneLeft.slice(0, cloneLeft.length - 2);

            let deltaLeft = cloneClearWidth - elementClearWidth;
            this.clonedWidgetOnDrag.style.height = 'auto';
            this.clonedWidgetOnDrag.style.left = (cloneClearLeft + deltaLeft) + 'px';
            vue.set(this.widgetPositionOnClick, 'left', (cloneClearLeft + deltaLeft));
            vue.set(this.widgetPositionOnClick, 'x', e.pageX);
            this.clonedWidgetOnDrag.style.width = elementWidth;
        },

        isAbleToMoveWidget(id){
            if (this.lastKnownWidgetId && this.lastKnownWidgetId !== id) return true;
            return this.currentWidgetMoveDirection !== this.lastKnownWidgetDirection;
        },

        moveWidgetTo(newId){
            let oldElementStore = this.content[this.widgetCoords.secDex].columns[this.widgetCoords.blockDex].widgets;
            for (let i = 0; i < this.content.length; i++) {
                let columns = this.content[i].columns;
                for (let k = 0; k < columns.length; k++) {
                    let widgets = columns[k].widgets;
                    if (columns[k].dragId && (!columns[k].widgets || !columns[k].widgets.length) && columns[k].dragId === newId) {
                        //переход в пустой блок
                        oldElementStore.splice(this.widgetCoords.widDex, 1);

                        if (!oldElementStore.length) {
                            //Если после удаления оригинала из секции она пустеет, надо давать ей dragId.
                            // Чтобы можно было опять туда положить что-нибудь.
                            let oldBlock = this.content[this.widgetCoords.secDex].columns[this.widgetCoords.blockDex];
                            vue.set(oldBlock, 'dragId', Math.random() + `_${oldBlock.width}`);
                        }

                        vue.set(columns[k], 'widgets', [this.widgetOnDrag,]);
                        this.widgetCoords = { //После смены местоположения оригинала, обнови координаты
                            secDex: i,
                            blockDex: k,
                            widDex: 0,
                        };
                        return;
                    } else {
                        //переход в непустой блок и внутри блока
                        for (let j = 0; j < widgets.length; j++) {
                            if (widgets[j].dragId === newId) {
                                oldElementStore.splice(this.widgetCoords.widDex, 1);
                                if (!oldElementStore.length) {
                                    //Если после удаления оригинала из секции она пустеет, надо давать ей dragId.
                                    // Чтобы можно было опять туда положить что-нибудь.
                                    let oldBlock = this.content[this.widgetCoords.secDex].columns[this.widgetCoords.blockDex];
                                    vue.set(oldBlock, 'dragId', Math.random() + `_${oldBlock.width}`);
                                    this.clearWidgetDirection();
                                }

                                widgets.splice(j, 0, this.widgetOnDrag);
                                if (this.widgetCoords.secDex !== i) { //Сбрасываем значение при драге между непустыми секциями
                                    this.lastKnownWidgetDirection = '';
                                }

                                this.widgetCoords = { //После смены местоположения оригинала, обнови координаты
                                    secDex: i,
                                    blockDex: k,
                                    widDex: j,
                                };
                                return;
                            }
                        }
                    }
                }
            }
        },

        clearWidgetDirection(){
            this.lastKnownWidgetId = '';
            this.lastKnownWidgetDirection = '';
            this.currentWidgetMoveDirection = '';
        },

        dragBlockAvailable(hovered){
            if (hovered.className === 'post-editor-render-wrapper' || hovered.className === 'post-editor-column') {
                if (hovered.id !== this.widgetOnDrag.dragId) {
                    return true;
                }
            }
            return false;
        },

        dragWidthAvailable(hoverId){
            let hoverLength = +hoverId.split('_')[1]; //Ширина колонки на ховере находится в конце его айдишника через нижний слэш
            let dragedWidgetConfig = {};
            this.editorConfig.widgets.map((widget) => {
                if (widget.type === this.widgetOnDrag.type) dragedWidgetConfig = widget;
            });

            if (Object.keys(dragedWidgetConfig).length) {
                if (dragedWidgetConfig.available.includes(hoverLength)) {
                    return true;
                }
            }

            return false;
        },

        createWidgetDragIds(){
            for (let i = 0; i < this.content.length; i++) {
                let columns = this.content[i].columns;
                for (let k = 0; k < columns.length; k++) {
                    let widgets = columns[k].widgets;

                    if (!widgets || !widgets.length) {
                        vue.set(columns[k], 'widgets', []);
                        vue.set(columns[k], 'dragId', Math.random() + `_${columns[k].width}`);
                    } else {
                        for (let j = 0; j < widgets.length; j++) {
                            vue.set(widgets[j], 'dragId', Math.random() + `_${columns[k].width}`);
                        }
                    }
                }
            }
        },

        clearWidgetDragIds(){
            for (let i = 0; i < this.content.length; i++) {
                let columns = this.content[i].columns;
                for (let k = 0; k < columns.length; k++) {
                    let widgets = columns[k].widgets;
                    vue.delete(columns[k], 'dragId');
                    for (let j = 0; j < widgets.length; j++) {
                        vue.delete(widgets[j], 'dragId');
                    }
                }
            }
        },

        isWidgetOnDrag(widget){
            return typeof widget.dragId !== 'undefined' && this.widgetOnDrag && this.widgetOnDrag.dragId === widget.dragId;
        },
        //-------------Конец Функций для dragNDrop виджета--------------------


        //-------------Начало общих функций драга-----------------------------

        DragEnd(){
            if (this.sectionOnDrag) {
                this.sectionOnDrag = false;
                this.stopScroll = true;
                this.lastDeltaY = '';
                this.currentMoveDirection = '';
                this.lastKnownDirection = '';
                this.lastKnownId = '';
                document.body.removeChild(this.clonedOnDrag);
                this.clearSectionDragIds();
            }

            if (this.widgetOnDrag) {
                this.widgetOnDrag = false;
                this.widgetCoords = {};
                this.stopScroll = true;
                this.lastKnownWidgetY = '';
                this.currentWidgetMoveDirection = '';
                this.lastKnownWidgetDirection = '';
                this.lastKnownWidgetId = '';
                document.body.removeChild(this.clonedWidgetOnDrag);
                this.clearWidgetDragIds();
            }
        },

        scrollTo(direction){
            let element = document.getElementsByClassName('forms-wrapper')[0];
            const scrollBottom = function () {
                setTimeout(() => {
                    element.scrollTop = element.scrollTop + 1;
                    if (element.scrollTop !== element.scrollHeight - element.clientHeight && !this.stopScroll) {
                        scrollBottom();
                    }
                }, 20);
            }.bind(this);

            const scrollTop = function () {
                setTimeout(() => {
                    if (element.scrollTop >= 10) element.scrollTop = element.scrollTop - 1;
                    else element.scrollTop = element.scrollTop - element.scrollTop;

                    if (element.scrollTop > 0 && !this.stopScroll) {
                        scrollTop();
                    }
                }, 20);
            }.bind(this);

            if (direction === 'top') scrollTop();
            else if (direction === 'bottom') scrollBottom();
        },

        //-------------конец общих функций драга------------------------------


        //-------------Начало функций для dragNDrop секции--------------------
        isOnDrag(section) {
            return section.dragId && section.dragId === this.sectionOnDrag.dragId;
        },

        startSectionDnd(index, e){
            this.createSectionDragIds();
            this.sectionOnDrag = this.content[index];
            this.$nextTick(() => { //$nexttick чтобы все ненужные элементы успели спрятатся, а не тянулись в призраке
                let element = document.getElementsByClassName('post-editor-block-wrapper')[index];
                this.sectionOnDragHTML = element;
                let clone = element.cloneNode(true);
                this.clonedOnDrag = clone;
                clone.classList.remove('post-editor-block-wrapper-on-drag');
                clone.style.position = 'fixed';
                document.body.appendChild(clone);
                this.setClonePositionOnClick(e);
            });
        },

        setClonePositionOnClick(mouseE){
            let style = window.getComputedStyle(this.sectionOnDragHTML);
            let marginTop = style['margin-top'];
            if (marginTop === '0px') marginTop = '60px';

            let wrapperCords = this.sectionOnDragHTML.getBoundingClientRect();
            let buttonCords = document.elementFromPoint(mouseE.pageX, mouseE.pageY).getBoundingClientRect();

            let fromBorderToButtonClick = (buttonCords.y - (buttonCords.y - mouseE.pageY)) - wrapperCords.y;
            let onlyNumberMargin = +marginTop.slice(0, marginTop.length - 2);

            let calculatedTop = mouseE.pageY - onlyNumberMargin - fromBorderToButtonClick;
            this.clonedOnDrag.style.top = calculatedTop + 'px';
            this.clonedOnDrag.style.left = wrapperCords.left + 'px';

            vue.set(this.positionOnClick, 'top', calculatedTop);
            vue.set(this.positionOnClick, 'left', wrapperCords.left);
            vue.set(this.positionOnClick, 'y', mouseE.pageY);
            vue.set(this.positionOnClick, 'x', mouseE.pageX);
        },

        setClonePositionOnMove(e){
            let deltaY = e.pageY - this.positionOnClick.y;
            let deltaX = e.pageX - this.positionOnClick.x;
            this.clonedOnDrag.style.top = this.positionOnClick.top + deltaY + 'px';
            this.clonedOnDrag.style.left = this.positionOnClick.left + deltaX + 'px';
            this.lastDeltaY = deltaY;
        },

        findDeltaYDirection(e){
            if (this.lastDeltaY) {
                let deltaY = e.pageY - this.positionOnClick.y;
                if (this.lastDeltaY !== deltaY) {
                    if (this.lastDeltaY < deltaY) this.currentMoveDirection = 'bottom';
                    else this.currentMoveDirection = 'top';
                }
            }
        },

        sectionHoverFunction: throttle(function (e) {
            if (this.sectionOnDrag) {
                this.findDeltaYDirection(e);
                this.setClonePositionOnMove(e);
                let element = {};
                let mouseOver = document.elementsFromPoint(e.pageX, e.pageY);
                for (let i = 0; i < mouseOver.length; i++) {
                    if (mouseOver[i].className === 'post-editor-block-wrapper' && +mouseOver[i].id !== this.sectionOnDrag.dragId && this.isAbleToMoveElement(+mouseOver[i].id)) {
                        this.lastKnownDirection = this.currentMoveDirection;
                        this.lastKnownId = +mouseOver[i].id;
                        element = mouseOver[i];
                        this.moveElementTo(element.id);
                        break;
                    }
                }

                if (e.pageY <= 200) {
                    this.stopScroll = false;
                    this.scrollTo('top');
                } else if (e.pageY >= window.innerHeight - 200) {
                    this.stopScroll = false;
                    this.scrollTo('bottom');
                } else {
                    this.stopScroll = true;
                }
            }
        }, 100),

        isAbleToMoveElement(id){
            if (!this.lastKnownDirection || !this.lastKnownId) return true;
            if (id !== this.lastKnownId) return true;
            return this.currentMoveDirection !== this.lastKnownDirection;
        },

        moveElementTo(newId){
            let oldIndex = '';
            let newIndex = '';

            for (let i = 0; i < this.content.length; i++) {
                if (this.content[i].dragId === this.sectionOnDrag.dragId) {
                    oldIndex = i;
                }
                if (this.content[i].dragId === +newId) {
                    newIndex = i;
                }
            }
            this.sectionHovered = newIndex;
            let movable = this.content.slice(oldIndex, oldIndex + 1)[0];
            this.content.splice(oldIndex, 1);
            this.content.splice(newIndex, 0, movable);
        },

        createSectionDragIds(){
            for (let i = 0; i < this.content.length; i++) {
                vue.set(this.content[i], 'dragId', Math.random());
            }
        },

        clearSectionDragIds(){
            for (let i = 0; i < this.content.length; i++) {
                vue.delete(this.content[i], 'dragId');
            }
        },

        //-------------Конец Функций для dragNDrop секции--------------------

        setSectionPadding(section, block){
            let styles = '';
            if (block.widgets && block.widgets.length) {
                if (section.paddingTop) styles += 'paddingTop:' + 'calc(15px + ' + section.paddingTop + 'em);';
                if (section.paddingBottom) styles += 'paddingBottom:' + 'calc(20px + ' + section.paddingBottom + 'em);';
            }
            return styles;
        },

        canWidgetBePasted(width){
            if (this.widgetBuffer.length) {
                let configWidgets = this.editorConfig.widgets;
                for (let i = 0; i < configWidgets.length; i++) {
                    if (this.widgetBuffer[0].widget.type === configWidgets[i].type && configWidgets[i].available.includes(width)) {
                        return true;
                    }
                }
            }
            return false;
        },

        clearFormsConfig(){
            this.widgetForm = {
                widgetIndex: '',
                popupType: false,
                block: {},
                widget: {},
                insertIndex: '',
            };
        },

        copyWidget(widget){
            let width = [];

            let configWidgets = this.editorConfig.widgets;
            for (let i = 0; i < configWidgets.length; i++) {
                if (widget.type === configWidgets[i].type) {
                    width = configWidgets[i].available;
                    break;
                }
            }

            this.$store.commit('postEditorCopyWidget', { width, widget , });
        },

        pasteWidget(secDex, blockDex, widgetIndex){
            let copy = cloneDeep(this.widgetBuffer[0].widget);
            if (typeof widgetIndex === 'undefined') {
                vue.set(this.content[secDex].columns[blockDex], 'widgets', [copy,]);
            } else {
                this.content[secDex].columns[blockDex].widgets.splice(widgetIndex + 1, 0, copy);
            }

            this.mouseOverButton = '';
        },

        editWidget(block, widget, index){
            this.widgetForm = {
                widgetIndex: index,
                popupType: widget.type,
                block,
                widget,
            };
        },

        callProperForm(e){
            //Даю время на закрытие попапа
            setTimeout(() => this.widgetForm.popupType = e, 200);
        },

        openCreateWidgetPopup(block, section, index){
            if (section.isPercentage) this.createPicker.isPercentage = true;
            this.createPicker.width = block.width;
            this.createPicker.showPicker = true;
            this.widgetForm.block = block;
            this.widgetForm.insertIndex = index + 1;
        },

        closeCreateWidget(){
            this.createPicker = {
                showPicker: false,
                indexWidget: '',
                width: '',
                isPercentage: false,
            };
        },

        changeSection(payload){
            let merged = Object.assign(this.content[this.changeSectionPopup], payload);
            for (let prop in merged) {
                if (merged.hasOwnProperty(prop) && typeof merged[prop] === 'undefined') {
                    delete merged[prop];
                }
            }
            vue.set(this.content, this.changeSectionPopup, merged);
            this.closeChangeSectionPopup();
        },

        showChangeSectionPopup(index, section) {
            this.changeSectionPopup = index;
            this.sectionForEdit = section;
        },

        closeChangeSectionPopup(){
            this.changeSectionPopup = false;
            this.sectionForEdit = {};
        },

        createSection(data){
            if (typeof data.index !== 'undefined') {
                let index = data.index;
                delete data.index;
                this.content.splice(index, 0, data);
            } else {
                this.content.push(data);
            }
        },

        copySection(section){
            this.$store.commit('postEditorCopySection', { config: !this.options.configCodename ? 'default' : this.options.configCodename, data: section, });
        },

        pasteSection(index) {
            let clone = cloneDeep(this.sectionBuffer[0]);
            this.content.splice(index, 0, clone);
            if (index + 1 === this.content.length) {
                setTimeout(() => {
                    let element = document.getElementsByClassName('forms-wrapper')[0];
                    element.scrollTo(0, element.scrollHeight);
                }, 150);
            }
        },

        deleteSection(index) {
            vue.delete(this.content, index);
        },

        multiEnds(number){
            let ends = {
                '1': 'колонка',
                '2_4': 'колонки',
                '5_20': 'колонок',
            };
            return wordFormHelper.numberDependantEnd(number, ends);
        },

        numberToWord(number) {
            return wordFormHelper.numberColumnsToWord(number);
        },

        concatColumnNumbers(section){
            if (section.isPercentage) {
                let widthArray = [];
                for (let i = 0; i < section.columns.length; i++) {
                    widthArray.push(section.columns[i].width);
                }

                for (let i = 0; i < widthArray.length; i++) {
                    widthArray[i] = widthArray[i].toString() + '%';
                }
                return widthArray.join(' : ');
            } else {
                let widthArray = [];
                for (let i = 0; i < section.columns.length; i++) {
                    widthArray.push(section.columns[i].width);
                }

                return widthArray.join(':');
            }
        },

        deleteWidget(widgets, index){
            widgets.splice(index, 1);
        },

        clearError() {
            if (this.options.invalid === true) {
                this.$emit('clearError', this.options.codename);
            }

            //     let tabHasErrors = {
            //         tabId: 0,
            //         status: false
            //     };

            //     const payload = {view: this.$route.params.view};
            //     const config = this.$store.getters.getFormsConfig(payload);

            //     for (let a = 0; a < config.length; a++) {
            //         const tab = config[a];
            //         for (let b = 0; b < tab.blocks.length; b++) {
            //             const block = tab.blocks[b];
            //             for (let c = 0; c < block.elements.length; c++) {
            //                 const element = block.elements[c];
            //                 if (element.codename === this.options.codename) {
            //                     tabHasErrors.tabId = tab.id;
            //                     this.$store.commit('setInvalidStatus', {view: this.$route.params.view, tabIndex: a, blockIndex: b, elementIndex: c, status: false, message: ''});
            //                     break;
            //                 }
            //                 tabHasErrors.status = element.invalid;
            //             }
            //         }
            //     }
            //     if (tabHasErrors.status === false)
            //         this.$store.commit('setInvalidStatusOnTab', {view: this.$route.params.view, tabId: tabHasErrors.tabId, status: false});
            // }
        },
    },

    components: {
        addSectionPopup,
        changeSectionPopup,
        postEditorWidgetWrapper,
        pickToCreatePopup,
        formsComponent,
    },

    beforeDestroy(){
        document.removeEventListener('mouseup', this.DragEnd);
        document.removeEventListener('mousemove', function (e) {
            this.sectionHoverFunction(e);
        }.bind(this));
    },
};
</script>