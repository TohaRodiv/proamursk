<template>
    <div :class="{'col12': labelPosition === 'top', 'col16': labelPosition === 'left'}" :style="(labelPosition === 'left') ? {display: 'flex'} : false">
        <div style="display: flex; margin-right: 20px" v-if="labelPosition === 'left'">
            <div class="tab-left-label col4" v-if="labelPosition === 'left' && options.required">
                <div class="hint-wrapper" v-if="labelPosition === 'left' && options.hint.length > 0">
                    <div class="hint-inner-wrapper">
                        <div
                                class="hint-container icon-question"
                                @mouseenter="showHint = true"
                                @mouseleave="showHint = false">
                        </div>
                        <div v-if="showHint" class="arrow-wrapper">
                            <div class="hint-arrow"></div>
                        </div>
                        <div class="hint-message" v-if="showHint">{{options.hint}}</div>
                    </div>
                </div>
                <span class="label-text tab-required-star-left" v-html="options.label"></span>
            </div>
            <div class="tab-left-label col4" v-if="labelPosition === 'left' && !options.required">
                <div class="hint-wrapper" v-if="labelPosition === 'left' && options.hint.length > 0">
                    <div class="hint-inner-wrapper">
                        <div
                                class="hint-container icon-question"
                                @mouseenter="showHint = true"
                                @mouseleave="showHint = false">
                        </div>
                        <div v-if="showHint" class="arrow-wrapper">
                            <div class="hint-arrow"></div>
                        </div>
                        <div class="hint-message" v-if="showHint">{{options.hint}}</div>
                    </div>
                </div>
                <span class="label-text" v-html="options.label"></span>
            </div>
        </div>
        <div style="display: flex; max-width: 100%; padding-right: 15px" v-if="labelPosition === 'top'">
            <div class="tab-top-label" style="width: auto" v-if="labelPosition === 'top' && options.required">
                <span class="label-text ellipsis" v-html="options.label"></span>
            </div>
            <span class="tab-required-star" v-if="labelPosition === 'top' && options.required">
            </span>
            <div class="tab-top-label ellipsis" v-if="labelPosition === 'top' && !options.required">
                <span class="label-text" v-html="options.label"></span>
            </div>
            <div class="hint-wrapper" v-if="labelPosition === 'top' && options.hint.length > 0">
                <div class="hint-inner-wrapper">
                    <div
                            class="hint-container icon-question"
                            @mouseenter="showHint = true"
                            @mouseleave="showHint = false">
                    </div>
                    <div v-if="showHint" class="arrow-wrapper">
                        <div class="hint-arrow"></div>
                    </div>
                    <div class="hint-message" v-if="showHint">{{options.hint}}</div>
                </div>
            </div>
        </div>
        <div style="position: relative;" @mouseenter="focus = true" @mouseleave="focus = false" @click="validateOnchange">
            <div :class="{'blocked-input': isBlocked}" style="width: 702px; background-color: rgba(250, 250, 250, .4)"></div>
            <textarea @change="changeValue($event)" id="formatter">{{(text) ? text : ''}}</textarea>
            <div class="input-error-message" v-if="options.invalid && focus">
                {{options.message}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            labelPosition: {
                type: String,
                default: 'left',
            },
            options: {
                type: Object,
                default: ()=>{
                    return {
                        view_structure: [
                            {
                                codename: 'name'
                            },
                        ],
                        label: 'Дефолтный лейбл',
                        required: false,
                        hint: '',
                    }
                }
            },
            onlyEmit: Boolean,
            text: String,
            isBlocked: Boolean,
        },

        data() {
            return {
                oldValue: '',
                value: '',
                focus: false,
            }
        },

        computed: {
            loadStatus(){
                return this.$store.state.forms.loadStatus
            },
        },

        watch: {
            'text': function () {
                if (typeof this.text !== 'undefined')
                    this.value = this.text;
            },

            'value': function () {
                if (!this.onlyEmit)
                    this.$store.commit('setFormsObject', {[this.options.codename]: this.value});
                else
                    this.$emit('callback', {[this.options.codename]: this.value});

                this.validateOnchange();
            },
            'options.invalid': function () {
                if (this.options.invalid) this.setInvalid(true);
            }
        },

        mounted() {
            const callMe = () => {
                if (this.loadStatus.mainData) {
                    const el = document.getElementById('formatter');
                    new Formatter(el, {toolbar: [
                            ['bold', 'italic', 'strikeThrough', 'underline', '|', 'insertUnorderedList','insertOrderedList', '|', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '|', 'link', 'specialChar', 'footnote'],
                            ['setStyle', 'fontColor', 'backgroundColor']
                        ],
                        formatterFrameCssPath: (process.env.NODE_ENV === 'development') ? '/v-settings/src/css/formatter_content.css' : '/static/cp_vue/css/formatter/formatter_content.css',
                        width: 700,
                    });
                } else {
                    setTimeout(() => {
                        callMe()
                    }, 300);
                }
            };
            callMe();
        },

        methods: {
            setInvalid(status) {
                let wrapper = document.getElementsByClassName('formatter-wrapper')[0];
                if (typeof wrapper !== 'undefined') {
                    if (status) {
                        wrapper.style.border = '1px solid #ffb9c4';
                        wrapper.style.borderRadius = '5px';
                    } else {
                        wrapper.style.border = '1px solid transparent';
                    }
                }
            },

            changeValue(e){
                if (e.target.value === "<p>​</p>")
                    this.value = '';
                else if (e.target.value !== this.oldValue)
                    this.value = e.target.value;
            },

            validateOnchange(){
                this.setInvalid(false);

                this.$emit('clearErrors', {index: this.child_entity_id});
                if (this.options.invalid) {
                    this.$emit('clearErrors', this.options.codename);                                                   /*Эмит для сложных доч. сущностей*/
                    let tabHasErrors = {
                        tabId: 0,
                        status: false
                    };

                    const payload = {view: this.$route.params.view};
                    const config = this.$store.getters.getFormsConfig(payload);

                    for (let a = 0; a < config.length; a++) {
                        const tab = config[a];
                        for (let b = 0; b < tab.blocks.length; b++) {

                            const block = tab.blocks[b];
                            for (let c = 0; c < block.elements.length; c++) {


                                const element = block.elements[c];

                                if (element.codename === this.options.codename) {
                                    tabHasErrors.tabId = tab.id;
                                    this.$store.commit('setInvalidStatus', {view: this.$route.params.view, tabIndex: a, blockIndex: b, elementIndex: c, status: false, message: ''});
                                }
                                tabHasErrors.status = element.invalid;
                            }
                        }
                    }
                    if (tabHasErrors.status === false) this.$store.commit('setInvalidStatusOnTab', {view: this.$route.params.view, tabId: tabHasErrors.tabId, status: false});
                }
            },
        },
    }
</script>