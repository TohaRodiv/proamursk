<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" @click.self="closePopup">
        <div class="popup-container" style="max-width: 780px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Текст</div>
            <div class="popup-post-editor-forms-wrapper">
                <formatter
                        :labelPosition="'top'"
                        :options="element">
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
                                @callback="callbax('marginTop', $event)"
                        ></selector>
                        <selector
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfig('Внешний снизу, em')"
                                @callback="callbax('marginBottom', $event)"
                        ></selector>
                        <selector
                                style="margin-bottom: 20px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfig('Внутр. сверху, em')"
                                @callback="callbax('paddingTop', $event)"
                        ></selector>
                        <selector
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfig('Внутр. снизу, em')"
                                @callback="callbax('paddingBottom', $event)"
                        ></selector>
                    </div>
                </div>
            </div>
            <div class="popup-buttons-wrapper">
                <div class="popup-buttons-post-editor-container">
                    <button class="button borderless-button forms-cancel-button" @click="closePopup" style="border-right: none !important;">Отмена</button>
                    <button class="button forms-save-button" @click="saveForm">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    import selector from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'
    import textarea from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/Textarea.vue'

    export default {
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
                textareaOptions:  {
                    type: 'field',
                    label: 'Комментарий',
                    required: true,
                    invalid: false,
                    width: 12,
                    height: 58,
                    codename: 'comment',
                    widget: 'textarea',
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

            callbax(from, value){
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
        }
    }
</script>