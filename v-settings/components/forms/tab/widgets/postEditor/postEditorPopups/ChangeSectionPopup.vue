<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" @click.self="closePopup">
        <div class="popup-container" style="max-width: 700px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-section-label">Редактирование секции</div>
            <div class="popup-post-editor-edit-wrapper">
                <div class="popup-post-editor-edit-container" v-if="config && config.hasMargins">
                    <selector
                            style="margin-bottom: 20px;"
                            :isBlocked="false"
                            :type="'childEntity'"
                            :passedData="currentState.marginTop ? currentState.marginTop : ''"
                            :labelPosition="'left'"
                            :options="initialiseConfig('Внешний отступ сверху, em')"
                            @callback="callbax('marginTop', $event)"
                    ></selector>
                    <selector
                            :isBlocked="false"
                            :type="'childEntity'"
                            :passedData="currentState.marginBottom ? currentState.marginBottom : ''"
                            :labelPosition="'left'"
                            :options="initialiseConfig('Внешний отступ снизу, em')"
                            @callback="callbax('marginBottom', $event)"
                    ></selector>
                </div>
                <div class="popup-post-editor-edit-container" v-if="config && config.hasPaddings">
                    <selector
                            style="margin-bottom: 20px;"
                            :isBlocked="false"
                            :type="'childEntity'"
                            :passedData="currentState.paddingTop ? currentState.paddingTop : ''"
                            :labelPosition="'left'"
                            :options="initialiseConfig('Внутрений отступ сверху, em')"
                            @callback="callbax('paddingTop', $event)"
                    ></selector>
                    <selector
                            :isBlocked="false"
                            :type="'childEntity'"
                            :passedData="currentState.paddingBottom ? currentState.paddingBottom : ''"
                            :labelPosition="'left'"
                            :options="initialiseConfig('Внутрений отступ снизу, em')"
                            @callback="callbax('paddingBottom', $event)"
                    ></selector>
                </div>
                <!-- <div class="popup-post-editor-edit-container" v-if="config && config.hasHorizontalMargin">
                    <selector
                            :isBlocked="false"
                            :type="'childEntity'"
                            :passedData="currentState.betweenBlocksMargin ? currentState.betweenBlocksMargin : ''"
                            :labelPosition="'left'"
                            :options="initialiseConfig('Отступ между колонками, px')"
                            @callback="callbax('betweenBlocksMargin', $event)"
                    ></selector>
                </div> -->
            </div>
            <div class="popup-buttons-wrapper">
                <div class="popup-buttons-post-editor-container">
                    <button class="button borderless-button forms-cancel-button" style="border-right: none !important;" @click="closePopup">Отмена</button>
                    <button class="button forms-save-button" @click="applyChanges">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import selector from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'

    import cloneDeep from 'lodash/cloneDeep'

    export default {
        props: {
            config: Object,
            currentState: Object,
        },

        data() {
            return {
                collector: {},
                showTransition: false,
                selectorConfig: {
                    type: 'field',
                    label: '',
                    codename: 'callback',
                    required: false,
                    invalid: false,
                    width: 4,
                    available_values: [
                        {
                            name: '1',
                            id: 1,
                        },
                        {
                            name: '2',
                            id: 2,
                        },
                        {
                            name: '3',
                            id: 3,
                        },
                        {
                            name: '4',
                            id: 4,
                        },
                        {
                            name: '5',
                            id: 5,
                        },
                    ],
                    sortFlag: {
                        value: 'name'
                    },
                    view_structure: [
                        {
                            value: 'name',
                            flex: 1.5
                        },
                    ],
                    returnFromAvailableValues: 'id'
                },
            }
        },

        mounted() {
            setTimeout(() => this.showTransition = true, 200);
        },

        methods: {
            callbax(from, value){
                if (from === 'marginTop') this.collector.marginTop = value.callback;
                else if (from === 'marginBottom') this.collector.marginBottom = value.callback;
                else if (from === 'paddingTop') this.collector.paddingTop = value.callback;
                else if (from === 'paddingBottom') this.collector.paddingBottom = value.callback;
                else if (from === 'betweenBlocksMargin') this.collector.betweenBlocksMargin= value.callback;
            },

            initialiseConfig(label){
                let copy = cloneDeep(this.selectorConfig);
                copy.label = label;
                return copy
            },

            applyChanges(){
                this.$emit('changes', this.collector);
            },

            closePopup(){
                this.$emit('closePopup')
            },
        },
        components: {
            selector
        }
    }
</script>