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
            this.marginTop = this.currentState.marginTop || '';
            this.marginBottom = this.currentState.marginBottom || '';
            this.paddingTop = this.currentState.paddingTop || '';
            this.paddingBottom = this.currentState.paddingBottom || '';
        },

        saveForm() {
            const { marginTop, marginBottom, paddingTop, paddingBottom, } = this;
            const payload = {};
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