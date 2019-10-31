<template>
    <div
        :class="{'popup-wrapper-transition': showTransition}"
        class="popup-wrapper"
    >
        <div
            v-show="showTransition"
            class="popup-container"
            style="max-width: 780px; display: block;"
        >
            <div
                @click="closePopup"
                class="popup-close-icon icon-close"
            />
            <div class="popup-post-editor-forms-label">
                Изображение
            </div>
            <div class="popup-post-editor-forms-wrapper">
                <imageLoader
                    @change="onChange"
                    @setError="setError"
                    @clearError="clearError"
                    :image="image"
                    :config="imageConfig"
                    style="width: 340px;"
                    label-position="top"
                />
                <radioButtonGroup
                    :config="alignConfig"
                    :value="align"
                    @change="onChange"
                    @clearError="clearError"
                    style="margin-top: 20px; margin-left: 15px;"
                />
                <textareaComp
                    :value="sign"
                    @change="onChange"
                    @setError="setError"
                    @clearError="clearError"
                    :config="signConfig"
                    style="margin-top: 22px"
                    label-position="top"
                />
                <cp-input
                    :value="link"
                    @change="onChange"
                    @clearError="clearError"
                    :config="linkConfig"
                    style="margin-top: 22px;"
                    label-position="top"
                />
                <div style="display: flex; margin-top: 22px;">
                    <cp-input
                        :value="title"
                        @change="onChange"
                        @clearError="clearError"
                        :config="titleConfig"
                        style="width: 340px; margin-right: 20px;"
                        label-position="top"
                    />
                    <cp-input
                        :value="alt"
                        @change="onChange"
                        @clearError="clearError"
                        :config="altConfig"
                        style="width: 340px;"
                        label-position="top"
                    />
                </div>
                <singleCheckbox
                    :propData="backgroundFlag"
                    @change="onChange"
                    @clearError="clearError"
                    :config="backgroundFlagConfig"
                    style="margin-top: 22px;"
                    label-position="top"
                />
                <div
                    class="popup-post-editor-forms-indents-wrapper"
                    style="margin-top: 50px;"
                >
                    <div class="popup-post-editor-forms-indents-title">
                        Отступы
                    </div>
                    <div class="popup-post-editor-forms-indents-container">
                        <cp-select
                            :value="marginTop"
                            :config="marginTopConfig"
                            @change="onChange"
                            @clearError="clearError"
                            label-position="top"
                        />
                        <cp-select
                            :value="marginBottom"
                            :config="marginBottomConfig"
                            @change="onChange"
                            @clearError="clearError"
                            label-position="top"
                        />
                        <cp-select
                            :value="paddingTop"
                            :config="paddingTopConfig"
                            @change="onChange"
                            @clearError="clearError"
                            label-position="top"
                        />
                        <cp-select
                            :value="paddingBottom"
                            :config="paddingBottomConfig"
                            @change="onChange"
                            @clearError="clearError"
                            label-position="top"
                        />
                    </div>
                </div>
            </div>
            <div class="popup-buttons-wrapper">
                <div class="popup-buttons-post-editor-container">
                    <button
                        @click="closePopup"
                        class="button borderless-button forms-cancel-button"
                        style="border-right: none !important;"
                    >
                        Отмена
                    </button>
                    <button
                        @click="validate"
                        class="button forms-save-button"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CpInput from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/CpInput.vue';
import textareaComp from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/Textarea.vue';
import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue';
import radioButtonGroup from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/RadioButtons.vue';
import singleCheckbox from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SingleCheckbox.vue';
import imageLoader from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/loaders/SingleImageLoader.vue';

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
    },
];

export default {
    components: {
        CpSelect,
        imageLoader,
        radioButtonGroup,
        CpInput,
        singleCheckbox,
        textareaComp,
    },

    props: {
        passedData: {
            type: [Object, Boolean,],
            default() {
                return {};
            },
        },
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
                width: 12,
            },

            alignConfig: {
                codename: 'align',
                width: 6,
                options: [
                    {
                        label: 'Слева',
                        codename: 'left',
                    },
                    {
                        label: 'По центру',
                        codename: 'center',
                    },
                    {
                        label: 'Справа',
                        codename: 'right',
                    },
                ],
                default: 'left',
                direction: 'row',
            },

            signConfig: {
                label: 'Подпись',
                codename: 'sign',
                width: 12,
                height: 80,
            },
            linkConfig: {
                label: 'Ссылка',
                placeholder: 'http(s)://',
                codename: 'link',
                width: 12,
            },
            titleConfig: {
                label: 'Значение атрибута title',
                width: 6,
                codename: 'title',
            },
            altConfig: {
                label: 'Значение атрибута alt',
                width: 6,
                codename: 'alt',
            },
            backgroundFlagConfig: {
                name: 'Не затемнять изображение по наведению, если оно является ссылкой',
                codename: 'backgroundFlag',
                widget: 'singleCheckbox',
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
        };
    },
    computed: {},
    mounted() {
        setTimeout(() => this.showTransition = true, 200);
        this.setData();
    },
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
            if (!hasError) this.saveForm();
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
            this.$emit('closePopup');
        },

        onChange(item) {
            const [codename, value,] = Object.entries(item)[0];
            this[codename] = value;
        },

        setError({ codename, message, }) {
            this[codename + 'Config'].invalid = true;
            this[codename + 'Config'].message = message;
        },

        clearError(codename) {
            this[codename + 'Config'].invalid = false;
        },
    },

        
};
</script>