<template>
    <cp-popup-wrap
        @close="close"
        disable-preloader
    >
        <cp-popup-layout title="Изображение">
            <template v-slot:body>
                <cp-form-row>
                    <imageLoader
                        @change="onChange"
                        @setError="setError"
                        @clearError="clearError"
                        :image="image"
                        :config="imageConfig"
                        style="width: 340px; margin-bottom: 20px;"
                        label-position="top"
                    />
                </cp-form-row>
                <cp-form-row>
                    <radioButtonGroup
                        :config="alignConfig"
                        :value="align"
                        @change="onChange"
                        @clearError="clearError"
                        style="margin-top: 20px; margin-left: 15px;"
                    />
                </cp-form-row>
                <cp-form-row>
                    <textareaComp
                        :value="sign"
                        @change="onChange"
                        @setError="setError"
                        @clearError="clearError"
                        :config="signConfig"
                        style="margin-top: 20px"
                        label-position="top"
                    />
                </cp-form-row>
                <cp-form-row>
                    <cp-input
                        :value="link"
                        @change="onChange"
                        @clearError="clearError"
                        :config="linkConfig"
                        style="margin-top: 20px;"
                        label-position="top"
                    />
                </cp-form-row>
                <cp-form-row>
                    <cp-input
                        :value="title"
                        @change="onChange"
                        @clearError="clearError"
                        :config="titleConfig"
                        style="width: 340px; margin-right: 20px; margin-top: 20px;"
                        label-position="top"
                    />
                    <cp-input
                        :value="alt"
                        @change="onChange"
                        @clearError="clearError"
                        :config="altConfig"
                        style="width: 340px; margin-top: 20px;"
                        label-position="top"
                    />
                </cp-form-row>
                <cp-form-row>
                    <singleCheckbox
                        :propData="backgroundFlag"
                        @change="onChange"
                        @clearError="clearError"
                        :config="backgroundFlagConfig"
                        style="margin-top: 20px;"
                        label-position="top"
                    />
                </cp-form-row>
                <cp-legend>Отступы</cp-legend>
                <cp-form-row>
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
                </cp-form-row>
            </template>
            <template v-slot:footer>
                <cp-button
                    @click="close"
                    class="cp-button cp-button_transparent cp-button_font-red"
                >
                    Отмена
                </cp-button>
                <cp-button
                    @click="validate"
                    class="cp-button cp-button_green cp-button_br-pill"
                >
                    Сохранить
                </cp-button>
            </template>
        </cp-popup-layout>
    </cp-popup-wrap>
</template>

<script>
import CpInput from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/CpInput.vue';
import textareaComp from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/Textarea.vue';
import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue';
import radioButtonGroup from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/RadioButtons.vue';
import singleCheckbox from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SingleCheckbox.vue';
import imageLoader from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/loaders/SingleImageLoader.vue';
import CpPopupWrap from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupWrap.vue';
import CpPopupLayout from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupLayout.vue';
import CpButton from '../../../../../../../cp_vue/frontend/vue/components/buttons/CpButton.vue';
import CpLegend from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/CpLegend.vue';
import CpFormRow from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/CpFormRow.vue';
import popupMixin from '../../../../../../../cp_vue/frontend/vue/components/popups/popupMixin';
import imagesOnload from '../../../../../../../cp_vue/frontend/vue/helpers/imagesOnload';

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
    name: 'PostEditorImagePopup',

    components: {
        CpSelect,
        imageLoader,
        radioButtonGroup,
        CpInput,
        singleCheckbox,
        textareaComp,
        CpPopupWrap,
        CpPopupLayout,
        CpButton,
        CpLegend,
        CpFormRow,
    },

    mixins: [popupMixin,],

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
            loading: false,
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

            marginTop: '',
            marginBottom: '',
            paddingTop: '',
            paddingBottom: '',
        };
    },
    mounted() {
        this.setData();
    },
    methods: {
        setData() {
            // if (Object.keys(this.passedData).length) {
            //     this.loading = true;
            // }

            this.text = this.passedData.text || '';
            this.image = this.passedData.image || {};
            this.sign = this.passedData.sign || '';
            this.link = this.passedData.link || '';
            this.align = this.passedData.align || 'left';
            this.backgroundFlag = this.passedData.backgroundFlag || false;
            this.title = this.passedData.title || '';
            this.alt = this.passedData.alt || '';
            this.marginTop = this.passedData.marginTop || '';
            this.marginBottom = this.passedData.marginBottom || '';
            this.paddingTop = this.passedData.paddingTop || '';
            this.paddingBottom = this.passedData.paddingBottom || '';

            // this.$nextTick(async () => {
            //     await imagesOnload('.cp-popup-wrap__content');
            //     this.loading = false;
            // });
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
            const payload = {};
            payload.text = text || '';
            payload.image = image || {};
            payload.sign = sign || '';
            payload.link = link || '';
            payload.align = align;
            payload.backgroundFlag = backgroundFlag;
            payload.title = title || '';
            payload.alt = alt || '';
            payload.marginTop = marginTop || null;
            payload.marginBottom = marginBottom || null;
            payload.paddingTop = paddingTop || null;
            payload.paddingBottom = paddingBottom || null;
            this.callback(payload);
            this.close();
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