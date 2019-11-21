<template>
    <cp-popup-wrap
        @clickaway="close"
        @close="close"
        disable-preloader
    >
        <cp-popup-layout title="Редактирование секции">
            <template v-slot:body>
                <div
                    v-if="config && config.hasMargins"
                    class="popup-post-editor-forms-indents-container"
                >
                    <cp-select
                        :value="marginTop"
                        :config="marginTopConfig"
                        @change="onChange"
                        @clearError="clearError"
                        style="margin-bottom: 20px;"
                        label-position="left"
                    />
                    <cp-select
                        :value="marginBottom"
                        :config="marginBottomConfig"
                        @change="onChange"
                        @clearError="clearError"
                        label-position="left"
                    />
                </div>
                <div
                    v-if="config && config.hasPaddings"
                    class="popup-post-editor-forms-indents-container"
                    style="margin-bottom: 20px;"
                >
                    <cp-select
                        :value="paddingTop"
                        :config="paddingTopConfig"
                        @change="onChange"
                        @clearError="clearError"
                        style="margin-bottom: 20px;"
                        label-position="left"
                    />
                    <cp-select
                        :value="paddingBottom"
                        :config="paddingBottomConfig"
                        @change="onChange"
                        @clearError="clearError"
                        label-position="left"
                    />
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
                    @click="saveForm"
                    class="cp-button cp-button_green cp-button_br-pill"
                >
                    Сохранить
                </cp-button>
            </template>
        </cp-popup-layout>
<!--        <div class="popup-post-editor-section-label">-->
<!--            Редактирование секции-->
<!--        </div>-->
<!--        <div class="popup-post-editor-edit-wrapper">-->
<!--            <div-->
<!--                v-if="config && config.hasMargins"-->
<!--                class="popup-post-editor-forms-indents-container"-->
<!--            >-->
<!--                <cp-select-->
<!--                    :value="marginTop"-->
<!--                    :config="marginTopConfig"-->
<!--                    @change="onChange"-->
<!--                    @clearError="clearError"-->
<!--                    style="margin-right: 20px; margin-bottom: 20px;"-->
<!--                    label-position="left"-->
<!--                />-->
<!--                <cp-select-->
<!--                    :value="marginBottom"-->
<!--                    :config="marginBottomConfig"-->
<!--                    @change="onChange"-->
<!--                    @clearError="clearError"-->
<!--                    label-position="left"-->
<!--                />-->
<!--            </div>-->
<!--            <div-->
<!--                v-if="config && config.hasPaddings"-->
<!--                class="popup-post-editor-forms-indents-container"-->
<!--                style="margin-bottom: 20px;"-->
<!--            >-->
<!--                <cp-select-->
<!--                    :value="paddingTop"-->
<!--                    :config="paddingTopConfig"-->
<!--                    @change="onChange"-->
<!--                    @clearError="clearError"-->
<!--                    style="margin-right: 20px; margin-bottom: 20px;"-->
<!--                    label-position="left"-->
<!--                />-->
<!--                <cp-select-->
<!--                    :value="paddingBottom"-->
<!--                    :config="paddingBottomConfig"-->
<!--                    @change="onChange"-->
<!--                    @clearError="clearError"-->
<!--                    label-position="left"-->
<!--                />-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="popup-buttons-wrapper">-->
<!--            <div class="popup-buttons-post-editor-container">-->
<!--                <button-->
<!--                    @click="close"-->
<!--                    class="button borderless-button forms-cancel-button"-->
<!--                    style="border-right: none !important;"-->
<!--                >-->
<!--                    Отмена-->
<!--                </button>-->
<!--                <button-->
<!--                    @click="saveForm"-->
<!--                    class="button forms-save-button"-->
<!--                >-->
<!--                    Сохранить-->
<!--                </button>-->
<!--            </div>-->
<!--        </div>-->
    </cp-popup-wrap>
</template>

<script>
import CpSelect from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/CpSelectSwitcher.vue';
import CpPopupWrap from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupWrap.vue';
import CpPopupLayout from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupLayout.vue';
import CpButton from '../../../../../../../cp_vue/frontend/vue/components/buttons/CpButton.vue';
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
    name: 'ChangeSectionPopup',

    components: {
        CpSelect,
        CpPopupWrap,
        CpPopupLayout,
        CpButton,
    },

    mixins: [popupMixin,],

    props: {
        config: Object,
        currentState: Object,
    },

    data() {
        return {
            collector: {},
            // showTransition: false,
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
            marginTop: null,
            marginBottom: null,
            paddingTop: null,
            paddingBottom: null,
        };
    },

    mounted() {
        // setTimeout(() => this.showTransition = true, 200);
        this.setData();
    },

    methods: {
        setData() {
            this.marginTop = this.currentState.marginTop || null;
            this.marginBottom = this.currentState.marginBottom || null;
            this.paddingTop = this.currentState.paddingTop || null;
            this.paddingBottom = this.currentState.paddingBottom || null;
        },

        saveForm() {
            const { marginTop, marginBottom, paddingTop, paddingBottom, } = this;
            const payload = { marginTop, marginBottom, paddingTop, paddingBottom, };
            // this.$emit('changes', payload);
            this.callback(payload);
            this.close();
        },

        // closePopup(){
        //     this.$emit('closePopup');
        // },

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