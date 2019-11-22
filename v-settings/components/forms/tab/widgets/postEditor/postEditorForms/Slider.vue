<template>
    <cp-popup-wrap
        @close="close"
        disable-preloader
    >
        <cp-popup-layout title="Слайдер">
            <template v-slot:body>
                <cp-form-row>
                    <cp-select
                        :value="slides"
                        :config="slidesConfig"
                        @change="onChange"
                        @clearError="clearError"
                        style="margin-bottom: 50px;"
                        label-position="top"
                    />
                </cp-form-row>
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
                </cp-form-row>
                <cp-form-row>
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
import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue';
import CpPopupWrap from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupWrap.vue';
import CpPopupLayout from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupLayout.vue';
import CpButton from '../../../../../../../cp_vue/frontend/vue/components/buttons/CpButton.vue';
import CpFormRow from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/CpFormRow.vue';
import popupMixin from '../../../../../../../cp_vue/frontend/vue/components/popups/popupMixin';

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
    name: 'PostEditorSliderPopup',

    components: {
        CpSelect,
        CpPopupWrap,
        CpPopupLayout,
        CpButton,
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
            slidesConfig: {
                codename: 'slides',
                width: 8,
                api: 'sliders',
                label: '',
                template: 'title',
            },

            marginTopConfig: {
                codename: 'marginTop',
                width: 4,
                options: marginOptions,
                label: 'Внешний отступ сверху, em',
            },
            marginBottomConfig: {
                codename: 'marginBottom',
                width: 4,
                options: marginOptions,
                label: 'Внешний отступ снизу, em',
            },
            paddingTopConfig: {
                codename: 'paddingTop',
                width: 4,
                options: marginOptions,
                label: 'Внутренний отступ сверху, em',
            },
            paddingBottomConfig: {
                codename: 'paddingBottom',
                width: 4,
                options: marginOptions,
                label: 'Внутренний отступ снизу, em',
            },

            slides: {},
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
            this.slides = this.passedData.slides || {};
            this.marginTop = this.passedData.marginTop || '';
            this.marginBottom = this.passedData.marginBottom || '';
            this.paddingTop = this.passedData.paddingTop || '';
            this.paddingBottom = this.passedData.paddingBottom || '';
        },

        validate(){
            let hasError = false;
            if (!this.slides || !Object.keys(this.slides).length) {
                this.slidesConfig.invalid = true;
                this.slidesConfig.message = 'Выберите значение';
                hasError = true;
            }
            if (!hasError) this.saveForm();
        },

        saveForm(){
            const { 
                slides,
                marginTop, 
                marginBottom, 
                paddingTop, 
                paddingBottom,
            } = this;
            const payload = {};
            payload.job = slides || {};
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