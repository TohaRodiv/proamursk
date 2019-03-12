<template>
    <div class="popup-wrapper" :class="{'popup-wrapper-transition': showTransition}" @click.self="closePopup">
        <div class="popup-container" style="max-width: 540px;" v-show="showTransition">
            <div class="popup-close-icon icon-close" @click="closePopup"></div>
            <div class="popup-post-editor-forms-label">Слайдер</div>
            <div class="popup-post-editor-forms-wrapper">
                <div class="popup-post-editor-forms-indents-wrapper">
                    <selector
                            style="width: 460px; margin-bottom: 50px;"
                            :type="'childEntity'"
                            :labelPosition="'top'"
                            :passedData="(passedData.slides) ? passedData.slides : ''"
                            :options="slidesConfig"
                            @FullDataCallback="checker($event)"
                    ></selector>
                    <div class="popup-post-editor-forms-indents-container">
                        <selector
                                style="margin-right: 20px; margin-bottom: 22px; width: 220px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :passedData="(passedData.marginTop) ? passedData.marginTop : ''"
                                :options="initialiseConfig('Внешний отступ сверху, em')"
                                @callback="indentsCallbacks('marginTop', $event)"
                        ></selector>
                        <selector
                                style="margin-right: 0; margin-bottom: 22px; width: 220px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :passedData="(passedData.marginBottom) ? passedData.marginBottom : ''"
                                :options="initialiseConfig('Внешний отступ снизу, em')"
                                @callback="indentsCallbacks('marginBottom', $event)"
                        ></selector>
                        <selector
                                style="margin-right: 20px; margin-bottom: 20px; width: 220px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :passedData="(passedData.paddingTop) ? passedData.paddingTop : ''"
                                :options="initialiseConfig('Внутренний отступ сверху, em')"
                                @callback="indentsCallbacks('paddingTop', $event)"
                        ></selector>
                        <selector
                                style="margin-right: 0; margin-bottom: 20px; width: 220px;"
                                :isBlocked="false"
                                :type="'childEntity'"
                                :labelPosition="'top'"
                                :passedData="(passedData.paddingBottom) ? passedData.paddingBottom : ''"
                                :options="initialiseConfig('Внутренний отступ снизу, em')"
                                @callback="indentsCallbacks('paddingBottom', $event)"
                        ></selector>
                    </div>
                </div>
            </div>
            <div class="popup-buttons-wrapper">
                <div class="popup-buttons-post-editor-container">
                    <button class="button borderless-button forms-cancel-button" style="border-right: none !important;" @click="closePopup">Отмена</button>
                    <button class="button forms-save-button" @click="validate">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import cloneDeep from 'lodash/cloneDeep'
    import selector from '../../../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'

    export default {
        props: {
            passedData: [Object, Boolean],
        },

        data() {
            return {
                showTransition: false,

                slidesConfig: {
                    type: 'field',
                    label: '',
                    codename: 'callback',
                    required: false,
                    invalid: false,
                    width: 8,
                    api_route: 'sliders',
                    sortFlag: {
                        value: 'title'
                    },
                    view_structure: [
                        {
                            value: 'title',
                            flex: 1.5
                        },
                    ],
                },

                indentsConfig: {
                    type: 'field',
                    label: '',
                    codename: 'callback',
                    required: false,
                    invalid: false,
                    width: 4,
                    available_values: [
                        {
                            name: '1',
                            id: 1,
                        },
                        {
                            name: '2',
                            id: 2,
                        },
                        {
                            name: '3',
                            id: 3,
                        },
                        {
                            name: '4',
                            id: 4,
                        },
                        {
                            name: '5',
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
                    returnFromAvailableValues: 'id'
                },

                slides: {},

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
                if (!this.slides) {
                    this.slidesConfig.invalid = true;
                    this.slidesConfig.message = 'Выберите значение';
                    hasError = true;
                }
                if (!hasError) this.saveForm()
            },

            saveForm(){
                let payload = {};
                payload.slides = this.slides;
                Object.assign(payload, this.indents);
                this.$emit('changed', payload);
            },

            initialiseConfig(label){
                let copy = cloneDeep(this.indentsConfig);
                copy.label = label;
                return copy
            },

            indentsCallbacks(from, value){
                if (from === 'marginTop') this.indents.marginTop = value.callback;
                else if (from === 'marginBottom') this.indents.marginBottom = value.callback;
                else if (from === 'paddingTop') this.indents.paddingTop = value.callback;
                else if (from === 'paddingBottom') this.indents.paddingBottom = value.callback;
            },

            checker(e){
              console.log(e);
              return e.callback ? this.slides = e.callback : ''
            },

            closePopup(){
                this.$emit('closePopup')
            },
        },

        components: {
            selector,
        }
    }
</script>