<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}">
        <div class="popup-container" style="max-width: 540px; display: block;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Изображение</div>
            <div class="popup-post-editor-forms-wrapper">
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
                <radioButtonGroup
                    style="margin-top: 20px; margin-left: 15px;"
                    :config="alignConfig"
                    :value="align"
                    @change="onChange"
                    @clearError="clearError"
                >
                </radioButtonGroup>
                <textareaComp
                    style="margin-top: 22px"
                    labelPosition="top"
                    :propData="sign"
                    @change="onChange"
                    @setError="setError"
                    @clearError="clearError"
                    :config="signConfig"
                >
                </textareaComp>
                <cp-input
                    style="margin-top: 22px;"
                    labelPosition="top"
                    :value="link"
                    @change="onChange"
                    @clearError="clearError"
                    :config="linkConfig"
                >
                </cp-input>
                <div style="display: flex; margin-top: 22px; ">
                    <cp-input
                        style="width: 340px;"
                        labelPosition="top"
                        :value="title"
                        @change="onChange"
                        @clearError="clearError"
                        :config="titleConfig"
                    >
                    </cp-input>
                    <cp-input
                        style="width: 340px;"
                        labelPosition="top"
                        :value="alt"
                        @change="onChange"
                        @clearError="clearError"
                        :config="altConfig"
                    >
                    </cp-input>
                </div>
                <singleCheckbox
                    style="margin-top: 22px;"
                    :propData="backgroundFlag"
                    labelPosition="top"
                    @change="onChange"
                    @clearError="clearError"
                    :config="backgroundFlagConfig"
                >
                </singleCheckbox>
                <div class="popup-post-editor-forms-indents-wrapper" style="margin-top: 50px;">
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
                    <button class="button borderless-button forms-cancel-button" @click="closePopup" style="border-right: none !important;">Отмена</button>
                    <button class="button forms-save-button" @click="validate">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import CpInput from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/CpInput.vue'
    import textareaComp from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/Textarea.vue'
    import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue'
    import radioButtonGroup from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/RadioButtons.vue'
    import singleCheckbox from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SingleCheckbox.vue'
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
    ];

    export default {
        components: {
            CpSelect,
            formatter,
            imageLoader,
            radioButtonGroup,
            CpInput,
            singleCheckbox,
            textareaComp
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
                imageConfig: {
                    label: 'Фото',
                    codename: 'image',
                    required: true,
                    invalid: false,
                    message: '',
                    width: 8,
                },

                alignConfig: {
                    codename: 'align',
                    width: 6,
                    options: [
                        {
                            label: 'Слева',
                            codename: 'left'
                        },
                        {
                            label: 'По центру',
                            codename: 'center'
                        },
                        {
                            label: 'Справа',
                            codename: 'right'
                        }
                    ],
                    default: 'left',
                    direction: 'row',
                },

                signConfig: {
                    label: 'Подпись',
                    codename: 'sign',
                    width: 8,
                    height: 80
                },
                linkConfig: {
                    label: 'Ссылка',
                    placeholder: 'http(s)://',
                    codename: 'link',
                    width: 8
                },
                titleConfig: {
                    label: 'Значение атрибута title',
                    width: 4,
                    codename: 'title',
                },
                altConfig: {
                    label: 'Значение атрибута alt',
                    width: 4,
                    codename: 'alt',
                },
                backgroundFlagConfig: {
                    label: 'Не затемнять изображение по наведению, если оно является ссылкой',
                    codename: 'backgroundFlag',
                    widget: 'singleCheckbox',
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
                image: {},
                sign: '',
                link: '',
                align: 'left',
                backgroundFlag: false,
                title: '',
                alt: '',

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
        computed: {},
        methods: {
            setData() {
                this.text = this.passedData.text || '';
                this.image = this.passedData.image || {};
                this.sign = this.passedData.sign || '';
                this.link = this.passedData.link || '';
                this.align = this.passedData.align || 'left';
                this.backgroundFlag = this.passedData.backgroundFlag || false;
                this.title = this.passedData.title || '';
                this.alt = this.passedData.alt || '';
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
                if (!hasError) this.saveForm()
            },

            saveForm(){
                const { 
                    text,
                    image,
                    sign,
                    link,
                    align,
                    backgroundFlag,
                    title,
                    alt,
                    marginTop, 
                    marginBottom, 
                    paddingTop, 
                    paddingBottom,
                } = this;
                const payload = { 
                    text,
                    image,
                    sign,
                    link,
                    align,
                    backgroundFlag,
                    title,
                    alt,
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