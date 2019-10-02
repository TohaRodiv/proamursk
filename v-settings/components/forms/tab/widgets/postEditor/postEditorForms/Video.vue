<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}">
        <div class="popup-container" style="max-width: 540px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Видео</div>
            <div class="popup-post-editor-forms-wrapper">
                <div class="popup-post-editor-forms-indents-wrapper">
                    <cp-input
                        style="width: 460px; margin-bottom: 20px;"
                        labelPosition="top"
                        :value="link"
                        @change="onChange"
                        @clearError="clearError"
                        :config="linkConfig"
                    ></cp-input>
                    <cp-input
                        style="width: 460px; margin-bottom: 50px;"
                        labelPosition="top"
                        :value="description"
                        @change="onChange"
                        @clearError="clearError"
                        :config="descriptionConfig"
                    ></cp-input>
                    <div class="popup-post-editor-forms-indents-container">
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
            CpInput,
            CpSelect,
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

                linkConfig: {
                    label: 'Ссылка на видео Youtube или Vimeo',
                    required: true,
                    invalid: false,
                    message: '',
                    placeholder: 'http(s)://',
                    width: 8,
                    codename: 'link'
                },

                descriptionConfig: {
                    label: 'Подпись',
                    width: 8,
                    codename: 'description'
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

                link: '',
                description: '',

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
                this.link = this.passedData.link || '';
                this.description = this.passedData.description || '';
                this.marginTop = this.passedData.marginTop || null;
                this.marginBottom = this.passedData.marginBottom || null;
                this.paddingTop = this.passedData.paddingTop || null;
                this.paddingBottom = this.passedData.paddingBottom || null;
            },

            validate(){
                let hasError = false;
                if (!this.link) {
                    this.linkConfig.invalid = true;
                    this.linkConfig.message = 'Заполните поле';
                    hasError = true;
                }
                if (!hasError) this.saveForm()
            },

            saveForm(){
                const { 
                    link,
                    description,
                    marginTop, 
                    marginBottom, 
                    paddingTop, 
                    paddingBottom,
                } = this;
                const payload = {
                    link,
                    description,
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