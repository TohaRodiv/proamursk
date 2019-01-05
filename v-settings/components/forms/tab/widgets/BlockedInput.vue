<template>
    <div :class="{'tab-element': true, 'tab-element-top-label': calculateFlexDirection === 'column'}">
        <div class="loader-tab-left-label" v-if="labelPosition === 'left'">
            <div class="tab-left-label col-4" v-if="labelPosition === 'left' && options.required">
                <div
                        class="hint-container icon-question"
                        v-if="labelPosition === 'left' && options.hint.length > 0"
                        @mouseenter="showHint = true"
                        @mouseleave="showHint = false">
                    <div class="hint-message" v-if="showHint">{{options.hint}}</div>
                </div>
                <span class="label-text tab-required-star-left">{{options.label}}</span>
            </div>
            <div class="tab-left-label col-4" v-if="labelPosition === 'left' && !options.required">
                <div @mouseenter="showHint = true"
                     @mouseleave="showHint = false"
                     class="hint-container icon-question"
                     v-if="labelPosition === 'left' && options.hint.length > 0">
                    <div class="hint-message" v-if="showHint">{{options.hint}}</div>
                </div>
                <span class="label-text">{{options.label}}</span>
            </div>
        </div>
        <div style="display: flex; max-width: 100%; padding-right: 20px" v-if="labelPosition === 'top'">
            <div class="tab-top-label ellipsis" v-if="labelPosition === 'top' && options.required">
                <span class="label-text">{{options.label}}</span>
            </div>
            <span class="tab-required-star" v-if="labelPosition === 'top' && options.required"></span>
            <div class="tab-top-label ellipsis" v-if="labelPosition === 'top' && !options.required">
                <span class="label-text">{{options.label}}</span>
            </div>
            <div    style="margin-left: auto"
                    class="hint-container icon-question"
                    @mouseenter="showHint = true"
                    @mouseleave="showHint = false"
                    v-if="labelPosition === 'top' && options.hint.length> 0">
                <div class="hint-message" v-if="showHint">{{options.hint}}</div>
            </div>
        </div>
        <div class="simple-input-wrapper">
            <input
                    class="input blocked-field-bg"
                    v-model=value
                    ref="field"
                    style="width: 100%"
                    :disabled="true"
                    type="text">
        </div>
        <confMutator :config="this.options.renderController" :data="(arrayOfValues.length > 0) ? arrayOfValues : askedValue" >
        </confMutator>
    </div>
</template>

<script>
    import confMutator from './ConfMutator.vue'

    export default {
        props: ['options', 'labelPosition', 'passedData'],

        data() {
            return {
                value: '',

                askedValue: {},

                arrayOfValues: []
            }
        },

        mounted(){
            if (this.passedData) this.apiCall()
        },

        watch: {
            passedData: function () {
                this.askedValue = this.passedData;
                this.arrayOfValues = [];
                for (let i = 0; i < this.askedValue[this.options.expected_value].length; i++) {
                    this.arrayOfValues.push(this.getData(this.askedValue[this.options.expected_value][i], this.options.nested_data));
                    this.$store.commit('changeWidgetStatus', {flag: this.options.codename, value: true});
                    this.$store.commit('setFormsWidgetTrigger');
                }
            }
        },


        computed: {
            getCommonVariable(){
                return this.$store.getters.getCommonVariable
            },
            getCommonVarsTrigger(){
                return this.$store.getters.getCommonVarsTrigger
            },
            getFormsData(){
                return this.$store.getters.getFormsData
            },

            calculateFlexDirection(){
                if (this.labelPosition === 'left') return 'row';
                else return 'column'
            },
        },

        methods: {
            getData(item, path){
                if(item && path) {
                    let path_items = path.split('.');
                    return path_items.reduce(function (value, current) {
                        if(value) return value[current]
                    }, item)
                }
            },
        },
        components: {
            confMutator,
        }
    }
</script>