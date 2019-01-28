<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" style="display: block;" @click.self="closePopup">
        <div class="popup-container" style="max-width: 780px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Прямая речь</div>
            <div class="popup-post-editor-forms-wrapper">
                <div style="display: flex; margin-bottom: 22px;">
                    <imageLoader
                            style="width: 340px;"
                            :labelPosition="'top'"
                            @callback="imageCallback($event.__directSpeechImage)"
                            :options="loaderConfig">
                    </imageLoader>
                    <div style="margin-left: 20px;">
                        <simpleInput
                                style="width: 340px; margin-bottom: 22px;"
                                :labelPosition="'top'"
                                :type="'childEntity'"
                                @callback="fio = $event.name"
                                :options="initialiseConfigInput('ФИО')">
                        </simpleInput>
                        <simpleInput
                                style="width: 340px;"
                                :labelPosition="'top'"
                                :type="'childEntity'"
                                @callback="job = $event.name"
                                :options="initialiseConfigInput('Род деятельности')">
                        </simpleInput>
                    </div>
                </div>
                <formatter
                        style="margin-bottom: 43px;"
                        :text="text"
                        :onlyEmit="true"
                        @callback="text = $event.text"
                        :labelPosition="'top'"
                        :options="formatterOptions">
                </formatter>
                <div class="popup-post-editor-forms-indents-wrapper">
                    <span>Отступы</span>
                    <div class="popup-post-editor-forms-indents-container" style="margin-top: 30px;">
                        <selector
                                style="margin-bottom: 20px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfigSelector('Внешний сверху, em')"
                                @callback="indentsCallbacks('marginTop', $event)"
                        ></selector>
                        <selector
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfigSelector('Внешний снизу, em')"
                                @callback="indentsCallbacks('marginBottom', $event)"
                        ></selector>
                        <selector
                                style="margin-bottom: 20px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfigSelector('Внутр. сверху, em')"
                                @callback="indentsCallbacks('paddingTop', $event)"
                        ></selector>
                        <selector
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :options="initialiseConfigSelector('Внутр. снизу, em')"
                                @callback="indentsCallbacks('paddingBottom', $event)"
                        ></selector>
                    </div>
                </div>
            </div>
            <div class="popup-buttons-wrapper">
                <div class="popup-buttons-post-editor-container">
                    <button class="button borderless-button forms-cancel-button" @click="closePopup" style="border-right: none !important;">Отмена</button>
                    <button class="button forms-save-button" @click="saveForm">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    import simpleInput from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SimpleInput.vue'
    import selector from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'
    import imageLoader from '../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/loaders/SingleImageLoader.vue'
    import formatter from '../Formatter.vue'

    export default {
        data() {
            return {
                showTransition: false,
                inputConfig: {
                    type: 'field',
                    label: '',
                    required: true,
                    invalid: false,
                    placeholder: 'Введите значение',
                    width: 4,
                    codename: 'name',
                    widget: 'simpleInput',
                    hint: '',
                },
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
                formatterOptions: {
                    label: 'Текст',
                    required: true,
                    invalid: false,
                    widget: 'formatter',
                    codename: 'text',
                    width: 12,
                    hint: ''
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
                        height: 700,
                    },
                    codename: '__directSpeechImage',
                    widget: 'singleImageLoader',
                    requireSendId: true,
                    key_attr: 'id',
                    hint: ''
                },

                fio: '',
                job: '',
                image: {},
                text: '',
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
            saveForm(){
                let payload = {};
                payload.text = this.text;
                payload.image = this.image;
                payload.fio = this.fio;
                payload.job = this.job;
                Object.assign(payload, this.indents);
                this.$emit('changed', payload);
            },

            initialiseConfigSelector(label){
                let copy = cloneDeep(this.selectorConfig);
                copy.label = label;
                return copy
            },

            initialiseConfigInput(label){
                let copy = cloneDeep(this.inputConfig);
                copy.label = label;
                return copy
            },

            imageCallback(image){
                if (image) this.image = image;
                else this.image = {};
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
            simpleInput,
        }
    }
</script>