<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" @click.self="closePopup">
        <div class="popup-container" style="max-width: 540px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Цитата</div>
            <div class="popup-post-editor-forms-wrapper">
                <div class="popup-post-editor-forms-indents-wrapper">
                    <textComp
                            style="width: 460px;"
                            :labelPosition="'top'"
                            :type="'childEntity'"
                            :passedData="(passedData.link) ? passedData.link : ''"
                            @callback="link = $event.name"
                            :options="textareaOptions">
                    </textComp>
                    <radioButtonGroup
                            :direction="'row'"
                            :type="'postEditor'"
                            style="margin-top: 20px; margin-bottom: 50px; margin-left: 15px;"
                            :passedData="(passedData.align) ? passedData.align : undefined"
                            @callback="align = $event"
                            :options="alignConfig">
                    </radioButtonGroup>
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
    import selector from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'
    import textarea from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/Textarea.vue'
    import radioButtonGroup from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/RadioButtons.vue'

    export default {
        props: {
            passedData: [Object, Boolean],
        },

        data() {
            return {
                showTransition: false,

                textareaOptions:  {
                    type: 'field',
                    label: 'Embed код',
                    required: true,
                    invalid: false,
                    width: 12,
                    height: 100,
                    codename: 'name',
                    widget: 'textarea',
                    hint: ''
                },

                alignConfig: {
                    type: 'field',
                    codename: 'align',
                    required: false,
                    invalid: false,
                    widget: 'radioButtons',
                    hint: '',
                    width: 6,
                    values: [
                        {
                            label: 'Слева',
                            flag: true,
                            codename: 'left'
                        },
                        {
                            label: 'По центру',
                            flag: false,
                            codename: 'center'
                        },
                        {
                            label: 'Справа',
                            flag: false,
                            codename: 'right'
                        }
                    ]
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

                link: '',
                align: '',

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
                if (!this.link) {
                    this.textareaOptions.invalid = true;
                    this.textareaOptions.message = 'Заполните поле';
                    hasError = true;
                }
                if (!hasError) this.saveForm()
            },

            saveForm(){
                let payload = {};
                payload.link = this.link;
                payload.align = this.align;
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
            textComp: textarea,
            radioButtonGroup,
        }
    }
</script>