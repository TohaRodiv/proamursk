<template>
    <cp-popup-wrap
        @close="close"
        disable-preloader
    >
        <cp-popup-layout title="Текст">
            <template v-slot:body>
                <formatter
                    :text="text"
                    @change="onChange"
                    @clearError="clearError"
                    :config="textConfig"
                    style="margin-bottom: 50px; margin-right: 0"
                    label-position="top"
                />
                <div class="popup-post-editor-forms-indents-wrapper">
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
                </div>
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
import formatter from '../../Formatter.vue';
import CpPopupWrap from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupWrap.vue';
import CpPopupLayout from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupLayout.vue';
import CpButton from '../../../../../../../cp_vue/frontend/vue/components/buttons/CpButton.vue';
import CpLegend from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/CpLegend.vue';
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
    components: {
        CpSelect,
        formatter,
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
            textConfig: {
                label: 'Текст',
                codename: 'text',
                required: true,
                invalid: false,
                message: '',
            },

            text: '',
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
            this.text = this.passedData.text || '';
            this.marginTop = this.passedData.marginTop || '';
            this.marginBottom = this.passedData.marginBottom || '';
            this.paddingTop = this.passedData.paddingTop || '';
            this.paddingBottom = this.passedData.paddingBottom || '';
        },

        validate() {
            let hasError = false;
            if (!this.text) {
                this.textConfig.invalid = true;
                this.textConfig.message = 'Заполните поле';
                hasError = true;
            }
            if (!hasError) this.saveForm();
        },

        saveForm() {
            const { 
                text,
                marginTop, 
                marginBottom, 
                paddingTop, 
                paddingBottom,
            } = this;
            const payload = {};
            payload.text = text || '';
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