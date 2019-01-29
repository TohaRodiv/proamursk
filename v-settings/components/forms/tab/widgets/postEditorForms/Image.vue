<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" @click.self="closePopup">
        <div class="popup-container" style="max-width: 780px; display: block;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Изображение</div>
            <div class="popup-post-editor-forms-wrapper">
                <imageLoader
                        :labelPosition="'none'"
                        @callback="imageCallback($event.__image)"
                        :options="loaderConfig">
                </imageLoader>
                <radioButtonGroup
                        :direction="'row'"
                        :type="'postEditor'"
                        style="margin-top: 20px; margin-left: 15px;"
                        @callback="align = $event"
                        :options="alignConfig">
                </radioButtonGroup>
                <div style="display: flex; margin-top: 22px;">
                    <simpleInput
                            style="width: 340px; margin-right: 20px;"
                            :labelPosition="'top'"
                            :type="'childEntity'"
                            @callback="sign = $event.name"
                            :options="signConfig">
                    </simpleInput>
                    <simpleInput
                            style="width: 340px;"
                            :labelPosition="'top'"
                            :type="'childEntity'"
                            @callback="link = $event.name"
                            :options="linkConfig">
                    </simpleInput>
                </div>
                <singleCheckbox
                        style="margin-top: 22px;"
                        :type="'childEntity'"
                        @callback="backgroundFlag = $event.backgroundFlag"
                        :options="backgroundFlagConfig">
                </singleCheckbox>
                <div class="popup-post-editor-forms-indents-wrapper" style="margin-top: 50px;">
                    <span>Отступы</span>
                    <div class="popup-post-editor-forms-indents-container" style="margin-top: 30px;">
                        <selector
                                style="margin-bottom: 20px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseIndentsConfig('Внешний сверху, em')"
                                @callback="indentsCallbacks('marginTop', $event)"
                        ></selector>
                        <selector
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseIndentsConfig('Внешний снизу, em')"
                                @callback="indentsCallbacks('marginBottom', $event)"
                        ></selector>
                        <selector
                                style="margin-bottom: 20px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseIndentsConfig('Внутр. сверху, em')"
                                @callback="indentsCallbacks('paddingTop', $event)"
                        ></selector>
                        <selector
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseIndentsConfig('Внутр. снизу, em')"
                                @callback="indentsCallbacks('paddingBottom', $event)"
                        ></selector>
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
    import simpleInput from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SimpleInput.vue'
    import selector from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'
    import radioButtonGroup from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/RadioButtons.vue'
    import singleCheckbox from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SingleCheckbox.vue'
    import imageLoader from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/loaders/SingleImageLoader.vue'
    import formatter from '../Formatter.vue'

    export default {
        props: {
            passedData: Object,
        },

        data() {
            return {
                showTransition: false,
                selectorConfig: {
                    type: 'field',
                    label: '',
                    codename: 'callback',
                    required: false,
                    invalid: false,
                    width: 3,
                    available_values: [
                        {
                            name: '1',
                            codename: 1,
                            id: 1,
                        },
                        {
                            name: '2',
                            codename: 2,
                            id: 2,
                        },
                        {
                            name: '3',
                            codename: 3,
                            id: 3,
                        },
                        {
                            name: '4',
                            codename: 4,
                            id: 4,
                        },
                        {
                            name: '5',
                            codename: 5,
                            id: 5,
                        },
                    ],
                    sortFlag: {
                        value: 'name'
                    },
                    view_structure: [
                        {
                            value: 'name',
                            flex: 1.5
                        },
                    ],
                },
                loaderConfig: {
                    type: 'field',
                    inputID: 'yomamasofat',
                    dragID: 'yomamasofatdrags',
                    label: 'Фото',
                    expected_value: 'medium_url',
                    required: true,
                    invalid: false,
                    width: 4,
                    image: {
                        width: 700,
                        height: 200,
                    },
                    codename: '__image',
                    widget: 'singleImageLoader',
                    requireSendId: true,
                    key_attr: 'id',
                    hint: ''
                },
                alignConfig: {
                    type: 'field',
                    codename: 'align',
                    required: false,
                    invalid: false,
                    widget: 'radioButtons',
                    hint: '',
                    width: 6,
                    values: [
                        {
                            label: 'Слева',
                            flag: true,
                            codename: 'left'
                        },
                        {
                            label: 'По центру',
                            flag: false,
                            codename: 'center'
                        },
                        {
                            label: 'Справа',
                            flag: false,
                            codename: 'right'
                        }
                    ]
                },
                signConfig: {
                    type: 'field',
                    label: 'Подпись',
                    required: false,
                    invalid: false,
                    width: 4,
                    codename: 'name',
                    widget: 'simpleInput',
                    hint: '',
                },
                linkConfig: {
                    type: 'field',
                    label: 'Ссылка',
                    required: false,
                    invalid: false,
                    placeholder: 'http://',
                    width: 4,
                    codename: 'name',
                    widget: 'simpleInput',
                    hint: '',
                },
                backgroundFlagConfig: {
                    label: 'Не затемнять изображение по наведению, если оно является ссылкой',
                    required: false,
                    codename: 'backgroundFlag',
                    widget: 'singleCheckbox',
                    hint: ''
                },

                text: '',
                image: {},
                sign: '',
                link: '',
                align: '',
                backgroundFlag: false,

                indents: {
                    marginTop: '',
                    marginBottom: '',
                    paddingTop: '',
                    paddingBottom: '',
                }
            }
        },
        mounted() {
            setTimeout(() => this.showTransition = true, 200);
        },
        computed: {},
        methods: {
            validate(){
                let hasError = false;
                if (!Object.keys(this.image).length) {
                    this.loaderConfig.invalid = true;
                    this.loaderConfig.message = 'Загрузите изображение или вставьте из Галереи';
                    hasError = true;
                }
                if (!hasError) this.saveForm()
            },

            saveForm(){
                let payload = {};
                payload.text = this.text;
                payload.image = this.image;
                payload.sign = this.sign;
                payload.link = this.link;
                payload.align = this.align;
                payload.backgroundFlag = this.backgroundFlag;
                Object.assign(payload, this.indents);
                this.$emit('changed', payload);
            },

            imageCallback(image){
                if (image) this.image = image;
                else this.image = {};
            },

            initialiseIndentsConfig(label){
                let copy = cloneDeep(this.selectorConfig);
                copy.label = label;
                return copy
            },

            indentsCallbacks(from, value){
                if (from === 'marginTop') this.indents.marginTop = value.callback;
                else if (from === 'marginBottom') this.indents.marginBottom = value.callback;
                else if (from === 'paddingTop') this.indents.paddingTop = value.callback;
                else if (from === 'paddingBottom') this.indents.paddingBottom = value.callback;
            },

            closePopup(){
                this.$emit('closePopup')
            },
        },

        components: {
            selector,
            formatter,
            imageLoader,
            radioButtonGroup,
            simpleInput,
            singleCheckbox,
        }
    }
</script>