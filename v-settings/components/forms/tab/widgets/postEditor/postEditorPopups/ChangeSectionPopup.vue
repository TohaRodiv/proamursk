<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}">
        <div class="popup-container" style="max-width: 700px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-section-label">Редактирование секции</div>
            <div class="popup-post-editor-edit-wrapper">
                <div class="popup-post-editor-forms-indents-title">Отступы</div>
                <div class="popup-post-editor-forms-indents-container" v-if="config && config.hasMargins">
                    <cp-select
                        style="margin-right: 20px; margin-bottom: 20px;"
                        labelPosition="top"
                        :value="marginTop"
                        :config="marginTopConfig"
                        @change="onChange"
                        @clearError="clearError"
                    ></cp-select>
                    <cp-select
                        labelPosition="top"
                        :value="marginBottom"
                        :config="marginBottomConfig"
                        @change="onChange"
                        @clearError="clearError"
                    ></cp-select>
                </div>
                <div class="popup-post-editor-forms-indents-container" v-if="config && config.hasPaddings">
                    <cp-select
                        style="margin-right: 20px; margin-bottom: 20px;"
                        labelPosition="top"
                        :value="paddingTop"
                        :config="paddingTopConfig"
                        @change="onChange"
                        @clearError="clearError"
                    ></cp-select>
                    <cp-select
                        labelPosition="top"
                        :value="paddingBottom"
                        :config="paddingBottomConfig"
                        @change="onChange"
                        @clearError="clearError"
                    ></cp-select>
                </div>
            </div>
            <div class="popup-buttons-wrapper">
                <div class="popup-buttons-post-editor-container">
                    <button class="button borderless-button forms-cancel-button" style="border-right: none !important;" @click="closePopup">Отмена</button>
                    <button class="button forms-save-button" @click="saveForm">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue'

    import cloneDeep from 'lodash/cloneDeep'

    const marginOptions = [
        {
            id: 1,
            name: 1,
        },
        {
            id: 2,
            name: 2,
        },
        {
            id: 3,
            name: 3,
        },
        {
            id: 4,
            name: 4,
        },
        {
            id: 5,
            name: 5,
        }
    ]

    export default {
        components: {
            CpSelect,
        },

        props: {
            config: Object,
            currentState: Object,
        },

        data() {
            return {
                collector: {},
                showTransition: false,
                marginTopConfig: {
                    codename: 'marginTop',
                    width: 4,
                    options: marginOptions,
                    placeholder: '',
                    label: 'Внешний сверху, em',
                },
                marginBottomConfig: {
                    codename: 'marginBottom',
                    width: 4,
                    options: marginOptions,
                    placeholder: '',
                    label: 'Внешний снизу, em',
                },
                paddingTopConfig: {
                    codename: 'paddingTop',
                    width: 4,
                    options: marginOptions,
                    placeholder: '',
                    label: 'Внутренний сверху, em',
                },
                paddingBottomConfig: {
                    codename: 'paddingBottom',
                    width: 4,
                    options: marginOptions,
                    placeholder: '',
                    label: 'Внутренний снизу, em',
                },
                marginTop: null,
                marginBottom: null,
                paddingTop: null,
                paddingBottom: null,
            }
        },

        mounted() {
            setTimeout(() => this.showTransition = true, 200);
            this.setData();
        },

        methods: {
            setData() {
                this.marginTop = this.currentState.marginTop || null;
                this.marginBottom = this.currentState.marginBottom || null;
                this.paddingTop = this.currentState.paddingTop || null;
                this.paddingBottom = this.currentState.paddingBottom || null;
            },

            saveForm(){
                const { marginTop, marginBottom, paddingTop, paddingBottom } = this;
                const payload = { marginTop, marginBottom, paddingTop, paddingBottom };
                this.$emit('changes', payload);
            },

            closePopup(){
                this.$emit('closePopup')
            },

            onChange(item) {
                const [codename, value] = Object.entries(item)[0];
                this[codename] = value;
            },

            setError({ codename, message }) {
                this[codename + 'Config'].invalid = true;
                this[codename + 'Config'].message = message;
            },

            clearError(codename) {
                this[codename + 'Config'].invalid = false;
            }
        },
    }
</script>