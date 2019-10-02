<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" style="display: block;">
        <div class="popup-container" style="max-width: 780px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Прямая речь</div>
            <div class="popup-post-editor-forms-wrapper">
                <div style="display: flex; margin-bottom: 22px;">
                    <imageLoader
                        style="width: 340px;"
                        labelPosition="top"
                        @change="onChange"
                        @setError="setError"
                        @clearError="clearError"
                        :image="image"
                        :config="imageConfig"
                    >
                    </imageLoader>
                    <div style="margin-left: 20px;">
                        <cp-input
                            style="width: 340px; margin-bottom: 22px;"
                            :labelPosition="'top'"
                            :value="fio"
                            @change="onChange"
                            @clearError="clearError"
                            :config="fioConfig"
                        >
                        </cp-input>
                        <cp-input
                            style="width: 340px;"
                            labelPosition="top"
                            :value="job"
                            @change="onChange"
                            @clearError="clearError"
                            :config="jobConfig"
                        >
                        </cp-input>
                    </div>
                </div>
                <formatter
                    style="margin-bottom: 43px;"
                    :text="text"
                    @change="onChange"
                    @clearError="clearError"
                    :labelPosition="'top'"
                    :config="formatterConfig"
                >
                </formatter>
                <div class="popup-post-editor-forms-indents-wrapper">
                    <span>Отступы</span>
                    <div class="popup-post-editor-forms-indents-container" style="margin-top: 30px;">
                        <cp-select
                            style="margin-bottom: 20px; margin-right: 15px"
                            labelPosition="top"
                            :value="marginTop"
                            :config="marginTopConfig"
                            @change="onChange"
                            @clearError="clearError"
                        ></cp-select>
                        <cp-select
                            style="margin-bottom: 20px; margin-right: 15px"
                            labelPosition="top"
                            :value="marginBottom"
                            :config="marginBottomConfig"
                            @change="onChange"
                            @clearError="clearError"
                        ></cp-select>
                        <cp-select
                            style="margin-bottom: 20px; margin-right: 15px"
                            labelPosition="top"
                            :value="paddingTop"
                            :config="paddingTopConfig"
                            @change="onChange"
                            @clearError="clearError"
                        ></cp-select>
                        <cp-select
                            style="margin-bottom: 20px; margin-right: 15px"
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
                    <button class="button borderless-button forms-cancel-button" @click="closePopup" style="border-right: none !important;">Отмена</button>
                    <button class="button forms-save-button" @click="validate">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    // import simpleInput from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SimpleInput.vue'
    import CpInput from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/CpInput.vue'
    // import selector from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'
    import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue'
    import imageLoader from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/loaders/SingleImageLoader.vue'
    import formatter from '../../Formatter.vue'

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
            // selector,
            formatter,
            imageLoader,
            // simpleInput,
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
                fioConfig: {
                    label: 'ФИО',
                    required: true,
                    invalid: false,
                    message: '',
                    placeholder: 'Введите значение',
                    width: 6,
                    codename: 'fio',
                },
                jobConfig: {
                    label: 'Род деятельности',
                    required: true,
                    invalid: false,
                    message: '',
                    placeholder: 'Введите значение',
                    width: 6,
                    codename: 'job',
                },
                marginTopConfig: {
                    codename: 'marginTop',
                    width: 3,
                    options: marginOptions,
                    placeholder: '',
                    label: 'Внешний сверху, em',
                },
                marginBottomConfig: {
                    codename: 'marginBottom',
                    width: 3,
                    options: marginOptions,
                    placeholder: '',
                    label: 'Внешний снизу, em',
                },
                paddingTopConfig: {
                    codename: 'paddingTop',
                    width: 3,
                    options: marginOptions,
                    placeholder: '',
                    label: 'Внутренний сверху, em',
                },
                paddingBottomConfig: {
                    codename: 'paddingBottom',
                    width: 3,
                    options: marginOptions,
                    placeholder: '',
                    label: 'Внутренний снизу, em',
                },
                formatterConfig: {
                    label: 'Текст',
                    required: true,
                    invalid: false,
                    message: '',
                    codename: 'text',
                },
                imageConfig: {
                    label: 'Фото',
                    codename: 'image',
                    required: true,
                    invalid: false,
                    message: '',
                    width: 6,
                    image: {
                        width: 700,
                        height: 700,
                    },
                },

                fio: '',
                job: '',
                image: {},
                text: '',
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
                this.fio = this.passedData.fio || '';
                this.job = this.passedData.job || '';
                this.image = this.passedData.image || {};
                this.text = this.passedData.text || '';
                this.marginTop = this.passedData.marginTop || null;
                this.marginBottom = this.passedData.marginBottom || null;
                this.paddingTop = this.passedData.paddingTop || null;
                this.paddingBottom = this.passedData.paddingBottom || null;
            },

            validate(){
                let hasError = false;
                if (!Object.keys(this.image).length) {
                    this.imageConfig.invalid = true;
                    this.imageConfig.message = 'Загрузите изображение или вставьте из Галереи';
                    hasError = true;
                }
                if (!this.text) {
                    this.formatterOptions.invalid = true;
                    this.formatterOptions.message = 'Заполните поле';
                    hasError = true;
                }
                if (!this.fio) {
                    this.fioConfig.invalid = true;
                    this.fioConfig.message = 'Заполните поле';
                    hasError = true;
                }
                if (!this.job) {
                    this.jobConfig.invalid = true;
                    this.jobConfig.message = 'Заполните поле';
                    hasError = true;
                }
                if (!hasError) this.saveForm()
            },

            saveForm(){
                const { text, image, fio, job, marginTop, marginBottom, paddingTop, paddingBottom } = this;
                const payload = { text, image, fio, job, marginTop, marginBottom, paddingTop, paddingBottom };
                this.$emit('changed', payload);
            },

            closePopup(){
                this.$emit('closePopup')
            },

            onChange(item) {
                // console.log('onChange', item);
                const [codename, value] = Object.entries(item)[0];
                this[codename] = value;
            },

            setError({ codename, message }) {
                // console.log('setError', codename, message);
                this[codename + 'Config'].invalid = true;
                this[codename + 'Config'].message = message;
            },

            clearError(codename) {
                // console.log('clearError', codename);
                this[codename + 'Config'].invalid = false;
            }
        },
    }
</script>