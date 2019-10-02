<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}">
        <div class="popup-container" style="max-width: 540px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Цитата</div>
            <div class="popup-post-editor-forms-wrapper">
                <div class="popup-post-editor-forms-indents-wrapper">
                    <cp-input
                        style="width: 460px; margin-bottom: 22px;"
                        labelPosition="top"
                        :value="title"
                        @change="onChange"
                        @clearError="clearError"
                        :config="titleConfig"
                    >
                    </cp-input>
                    <textareaComp
                        style="width: 460px; margin-bottom: 50px;"
                        labelPosition="top"
                        :propData="text"
                        @change="onChange"
                        @clearError="clearError"
                        :config="textConfig"
                    ></textareaComp>
                    <div class="popup-post-editor-forms-indents-title">Отступы</div>
                    <div class="popup-post-editor-forms-indents-container">
                        <cp-select
                            style="margin-right: 20px"
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
                    <div class="popup-post-editor-forms-indents-container">
                        <cp-select
                            style="margin-right: 20px"
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
    import CpInput from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/CpInput.vue'
    import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue'
    import textarea from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/Textarea.vue'

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
    ];

    export default {
        components: {
            CpSelect,
            CpInput,
            textareaComp: textarea,
        },

        props: {
            passedData: {
                type: [Object, Boolean],
                default() {
                    return {};
                }
            }
        },

        data() {
            return {
                showTransition: false,

                textConfig: {
                    label: 'Текст',
                    required: true,
                    invalid: false,
                    message: '',
                    width: 8,
                    height: 80,
                    codename: 'text',
                },
                
                titleConfig: {
                    label: 'Заголовок',
                    placeholder: 'Введите значение',
                    width: 8,
                    codename: 'title',
                },

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

                text: '',
                title: '',

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
                this.title = this.passedData.title || '';
                this.text = this.passedData.text || '';
                this.marginTop = this.passedData.marginTop || null;
                this.marginBottom = this.passedData.marginBottom || null;
                this.paddingTop = this.passedData.paddingTop || null;
                this.paddingBottom = this.passedData.paddingBottom || null;
            },

            validate(){
                let hasError = false;
                if (!this.text) {
                    this.textConfig.invalid = true;
                    this.textConfig.message = 'Заполните поле';
                    hasError = true;
                }
                if (!hasError) this.saveForm()
            },

            saveForm(){
                const { 
                    text,
                    title,
                    marginTop, 
                    marginBottom, 
                    paddingTop, 
                    paddingBottom,
                } = this;
                const payload = {
                    text,
                    title,
                    marginTop, 
                    marginBottom, 
                    paddingTop, 
                    paddingBottom,
                };
                this.$emit('changed', payload);
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