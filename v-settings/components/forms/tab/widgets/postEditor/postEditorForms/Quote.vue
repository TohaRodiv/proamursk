<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" @click.self="closePopup">
        <div class="popup-container" style="max-width: 540px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Цитата</div>
            <div class="popup-post-editor-forms-wrapper">
                <div class="popup-post-editor-forms-indents-wrapper">
                    <simpleInput
                            style="width: 460px; margin-bottom: 22px;"
                            :labelPosition="'top'"
                            :type="'childEntity'"
                            :passedData="(passedData.title) ? passedData.title : ''"
                            @callback="title = $event.name"
                            :options="titleConfig">
                    </simpleInput>
                    <textComp
                            style="width: 460px; margin-bottom: 50px;"
                            :labelPosition="'top'"
                            :type="'childEntity'"
                            :passedData="(passedData.text) ? passedData.text : ''"
                            @callback="text = $event.name"
                            :options="textareaOptions">
                    </textComp>
                    <div class="popup-post-editor-forms-indents-container">
                        <selector
                                style="margin-right: 20px; margin-bottom: 22px; width: 220px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :passedData="(passedData.marginTop) ? passedData.marginTop : ''"
                                :options="initialiseConfig('Внешний отступ сверху, em')"
                                @callback="indentsCallbacks('marginTop', $event)"
                        ></selector>
                        <selector
                                style="margin-right: 0; margin-bottom: 22px; width: 220px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :passedData="(passedData.marginBottom) ? passedData.marginBottom : ''"
                                :options="initialiseConfig('Внешний отступ снизу, em')"
                                @callback="indentsCallbacks('marginBottom', $event)"
                        ></selector>
                        <selector
                                style="margin-right: 20px; margin-bottom: 20px; width: 220px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :passedData="(passedData.paddingTop) ? passedData.paddingTop : ''"
                                :options="initialiseConfig('Внутренний отступ сверху, em')"
                                @callback="indentsCallbacks('paddingTop', $event)"
                        ></selector>
                        <selector
                                style="margin-right: 0; margin-bottom: 20px; width: 220px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :passedData="(passedData.paddingBottom) ? passedData.paddingBottom : ''"
                                :options="initialiseConfig('Внутренний отступ снизу, em')"
                                @callback="indentsCallbacks('paddingBottom', $event)"
                        ></selector>
                    </div>
                </div>
            </div>
            <div class="popup-buttons-wrapper">
                <div class="popup-buttons-post-editor-container">
                    <button class="button borderless-button forms-cancel-button" style="border-right: none !important;" @click="closePopup">Отмена</button>
                    <button class="button forms-save-button" @click="validate">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    import simpleInput from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SimpleInput.vue'
    import selector from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'
    import textarea from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/Textarea.vue'

    export default {
        props: {
            passedData: [Object, Boolean],
        },

        data() {
            return {
                showTransition: false,

                textareaOptions:  {
                    type: 'field',
                    label: 'Текст',
                    required: true,
                    invalid: false,
                    width: 12,
                    height: 100,
                    codename: 'name',
                    widget: 'textarea',
                    hint: ''
                },

                titleConfig: {
                    type: 'field',
                    label: 'Заголовок',
                    required: false,
                    invalid: false,
                    placeholder: 'Введите значение',
                    width: 12,
                    codename: 'name',
                    widget: 'simpleInput',
                    hint: '',
                },

                indentsConfig: {
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

                text: '',
                title: '',

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
                    this.textareaOptions.invalid = true;
                    this.textareaOptions.message = 'Заполните поле';
                    hasError = true;
                }
                if (!hasError) this.saveForm()
            },

            saveForm(){
                let payload = {};
                payload.text = this.text;
                payload.title = this.title;
                Object.assign(payload, this.indents);
                this.$emit('changed', payload);
            },

            initialiseConfig(label){
                let copy = cloneDeep(this.indentsConfig);
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
            simpleInput,
            textComp: textarea,
        }
    }
</script>