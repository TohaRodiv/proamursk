<template>
    <div
        :class="{'popup-wrapper-transition': showTransition}"
        class="popup-wrapper"
    >
        <div
            v-show="showTransition"
            class="popup-container"
            style="max-width: 540px;"
        >
            <div
                @click="closePopup"
                class="popup-close-icon icon-close"
            />
            <div class="popup-post-editor-forms-label">
                Цитата
            </div>
            <div class="popup-post-editor-forms-wrapper">
                <div class="popup-post-editor-forms-indents-wrapper">
                    <cp-input
                        :value="title"
                        @change="onChange"
                        @clearError="clearError"
                        :config="titleConfig"
                        style="width: 460px; margin-bottom: 22px;"
                        label-position="top"
                    />
                    <textareaComp
                        :propData="text"
                        @change="onChange"
                        @clearError="clearError"
                        :config="textConfig"
                        style="width: 460px; margin-bottom: 50px;"
                        label-position="top"
                    />
                    <div
                        class="popup-post-editor-forms-indents-container"
                        style="margin-bottom: 20px;"
                    >
                        <cp-select
                            :value="marginTop"
                            :config="marginTopConfig"
                            @change="onChange"
                            @clearError="clearError"
                            style="margin-right: 20px"
                            label-position="top"
                        />
                        <cp-select
                            :value="marginBottom"
                            :config="marginBottomConfig"
                            @change="onChange"
                            @clearError="clearError"
                            label-position="top"
                        />
                    </div>
                    <div class="popup-post-editor-forms-indents-container">
                        <cp-select
                            :value="paddingTop"
                            :config="paddingTopConfig"
                            @change="onChange"
                            @clearError="clearError"
                            style="margin-right: 20px"
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
import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue';
import textarea from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/Textarea.vue';

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
        CpInput,
        textareaComp: textarea,
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

            text: '',
            title: '',

            marginTop: null,
            marginBottom: null,
            paddingTop: null,
            paddingBottom: null,
        };
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
            if (!hasError) this.saveForm();
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