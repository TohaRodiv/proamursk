<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" @click.self="closePopup">
        <div class="popup-container" style="max-width: 780px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Текст</div>
            <div class="popup-post-editor-forms-wrapper">
                <formatter
                        style="margin-bottom: 43px;"
                        :text="(passedData.text) ? passedData.text : ''"
                        :onlyEmit="true"
                        @callback="text = $event.text"
                        :labelPosition="'none'"
                        :options="formatterOptions">
                </formatter>
                <div class="popup-post-editor-forms-indents-wrapper">
                    <span>Отступы</span>
                    <div class="popup-post-editor-forms-indents-container" style="margin-top: 30px;">
                        <selector
                                style="margin-bottom: 20px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfig('Внешний сверху, em')"
                                :passedData="(passedData.marginTop) ? passedData.marginTop : ''"
                                @callback="indentsCallbacks('marginTop', $event)"
                        ></selector>
                        <selector
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfig('Внешний снизу, em')"
                                :passedData="(passedData.marginBottom) ? passedData.marginBottom : ''"
                                @callback="indentsCallbacks('marginBottom', $event)"
                        ></selector>
                        <selector
                                style="margin-bottom: 20px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfig('Внутр. сверху, em')"
                                :passedData="(passedData.paddingTop) ? passedData.paddingTop : ''"
                                @callback="indentsCallbacks('paddingTop', $event)"
                        ></selector>
                        <selector
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfig('Внутр. снизу, em')"
                                :passedData="(passedData.paddingBottom) ? passedData.paddingBottom : ''"
                                @callback="indentsCallbacks('paddingBottom', $event)"
                        ></selector>
                    </div>
                </div>
            </div>
            <div class="popup-buttons-wrapper">
                <div class="popup-buttons-post-editor-container">
                    <button class="button borderless-button forms-cancel-button" @click="closePopup" style="border-right: none !important;">Отмена</button>
                    <button class="button forms-save-button" @click="validate">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    import selector from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'
    import formatter from '../Formatter.vue'

    export default {
        props: {
            passedData: [Object, Boolean],
        },

        data() {
            return {
                showTransition: false,
                selectorConfig: {
                    type: 'field',
                    label: '',
                    codename: 'callback',
                    required: false,
                    invalid: false,
                    width: 3,
                    available_values: [
                        {
                            name: '1',
                            codename: 1,
                            id: 1,
                        },
                        {
                            name: '2',
                            codename: 2,
                            id: 2,
                        },
                        {
                            name: '3',
                            codename: 3,
                            id: 3,
                        },
                        {
                            name: '4',
                            codename: 4,
                            id: 4,
                        },
                        {
                            name: '5',
                            codename: 5,
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
                },
                formatterOptions: {
                    label: '',
                    required: false,
                    invalid: false,
                    widget: 'formatter',
                    codename: 'text',
                    width: 12,
                    hint: ''
                },

                text: '',
                indents: {
                    marginTop: '',
                    marginBottom: '',
                    paddingTop: '',
                    paddingBottom: '',
                }
            }
        },
        mounted() {
            setTimeout(() => this.showTransition = true, 200);
        },
        computed: {},
        methods: {
            validate(){
                let hasError = false;
                if (!this.text) {
                    this.formatterOptions.invalid = true;
                    this.formatterOptions.message = 'Заполните поле';
                    hasError = true;
                }
                if (!hasError) this.saveForm()
            },

            saveForm(){
                let payload = {};
                payload.text = this.text;
                Object.assign(payload, this.indents);
                this.$emit('changed', payload);
            },

            initialiseConfig(label){
                let copy = cloneDeep(this.selectorConfig);
                copy.label = label;
                return copy
            },

            indentsCallbacks(from, value){
                if (from === 'marginTop') this.indents.marginTop = value.callback;
                else if (from === 'marginBottom') this.indents.marginBottom = value.callback;
                else if (from === 'paddingTop') this.indents.paddingTop = value.callback;
                else if (from === 'paddingBottom') this.indents.paddingBottom = value.callback;
            },

            closePopup(){
                this.$emit('closePopup')
            },
        },

        components: {
            selector,
            formatter,
        }
    }
</script>