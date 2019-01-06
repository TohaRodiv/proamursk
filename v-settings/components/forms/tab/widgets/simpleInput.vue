<template>
    <div :class="{'tab-element': true, 'tab-element-top-label': calculateFlexDirection === 'column'}">
        <div style="display: flex;" v-if="labelPosition === 'left'">
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
            <div class="tab-top-label" v-if="labelPosition === 'top' && options.required">
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
        <div :class="{'simple-input-wrapper': labelPosition === 'top', 'simple-input-wrapper-left-label': labelPosition === 'left'}" style="width: 100%" v-on-clickaway="closePicker">
            <div class="blocked-input" v-if="(typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked) && !(options.availableOnSuperUser && getFormsImmutableData.is_superuser)"></div>
            <input
                    v-if="options.type === 'field'"
                    class="input"
                    @focus="validateOnchange()"
                    @blur="blurHandler"
                    :maxlength="(options.maxLength) ? options.maxLength : ''"
                    autocomplete="off"
                    v-model=value
                    ref="field"
                    style="width: 100%;"
                    :style="(options.rightAlign) ? {textAlign: 'right'} : ''"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': (typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked) && !(options.availableOnSuperUser && getFormsImmutableData.is_superuser)}"
                    :disabled="(isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false) && !(options.availableOnSuperUser && getFormsImmutableData.is_superuser)"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">
            <input
                    v-if="options.type === 'float'"
                    class="input"
                    v-model=value
                    @focus="validateOnchange()"
                    @blur="blurHandler"
                    autocomplete="off"
                    ref="field"
                    min="0"
                    :style="(options.rightAlign) ? {textAlign: 'right'} : ''"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (ErrorMessageProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="number">

            <input
                    v-if="options.type === 'price'"
                    class="input"
                    v-model=value
                    @focus="validateOnchange()"
                    @blur="blurHandler"
                    autocomplete="off"
                    ref="field"
                    min="0"
                    :style="(options.rightAlign) ? {textAlign: 'right'} : ''"
                    style="width: 100%; text-align: right"
                    :class="{'input-on-error': options.invalid || (ErrorMessageProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="number">

            <input
                    v-if="options.type === 'mask-phone'"
                    class="input"
                    v-model=value
                    @focus="focusHandler"
                    @blur="blurHandler"
                    autocomplete="off"
                    v-mask="'+7 (###) ### ## ##'"
                    placeholder="+7 (000) 000 00 00"
                    ref="field"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="(isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false) && !(options.availableOnSuperUser && getFormsImmutableData.is_superuser)"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">

            <input
                    v-if="options.type === 'mask-hex'"
                    class="input"
                    v-model=value
                    @focus="focusHandler"
                    @blur="blurHandler"
                    autocomplete="off"
                    placeholder="#c07545"
                    ref="field"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">

            <input
                    v-if="options.type === 'mask-inn'"
                    class="input"
                    v-model=value
                    @focus="validateOnchange()"
                    @blur="blurHandler"
                    autocomplete="off"
                    ref="field"
                    v-mask="'############'"
                    placeholder="12345689876"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">
            <input
                    v-if="options.type === 'mask-passport-series'"
                    class="input"
                    v-model=value
                    @focus="validateOnchange()"
                    @blur="blurHandler"
                    autocomplete="off"
                    v-mask="'####'"
                    placeholder="0508"
                    ref="field"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">
            <input
                    v-if="options.type === 'mask-passport-number'"
                    class="input"
                    v-model=value
                    @focus="validateOnchange()"
                    @blur="blurHandler"
                    autocomplete="off"
                    v-mask="'######'"
                    placeholder="010203"
                    ref="field"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">
            <input
                    v-if="options.type === 'mask-date'"
                    class="input"
                    v-model=value
                    v-mask="'##.##.####'"
                    autocomplete="off"
                    placeholder="24.12.2018"
                    @focus="showCalendarOnFocus"
                    @blur="blurHandler"
                    ref="field"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">
            <div v-if="options.type === 'mask-date'" :class="{'date-picker-icon-active': datePickerActive && calendarId === options.codename}" @click="datePickerActive = !datePickerActive" class="date-picker-icon icon-date"></div>

            <input
                    v-if="options.type === 'mask-datetime'"
                    class="input"
                    v-model=value
                    @focus="showCalendarOnFocus"
                    @blur="blurHandler"
                    autocomplete="off"
                    v-mask="'##.##.#### - ##:##'"
                    placeholder="24.12.2018 - 14:28"
                    ref="field"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || typeof options.isActive !== 'undefined' && options.isActive === false"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">
            <div v-if="options.type === 'mask-datetime'" :class="{'date-picker-icon-active': datePickerActive && calendarId === options.codename}" @click="datePickerActive = !datePickerActive" class="date-picker-icon icon-date"></div>
            <input
                    v-if="options.type === 'mask-time'"
                    class="input"
                    v-model=value
                    @focus="validateOnchange"
                    @blur="blurHandler"
                    autocomplete="off"
                    v-mask="'##:##'"
                    placeholder="00:00"
                    ref="field"
                    style="width: 100%;"
                    :class="{'input-on-error': options.invalid || (hasErrorProp && drawError), 'blocked-field-bg': typeof options.isActive !== 'undefined' && options.isActive === false || isBlocked}"
                    :disabled="isBlocked || (typeof options.isActive !== 'undefined' && options.isActive === false)"
                    @mouseenter="focus = true"
                    @mouseleave="focus = false"
                    type="text">

            <div style="position: absolute; width: 100%; display: flex; justify-content: center">
                <dateWidget v-if="options.type === 'mask-date' && datePickerActive" :dateProp='value' @closeDatePicker="datePickerActive = false" @dateBack="getDataFromPicker"></dateWidget>
                <dateWidget v-if="options.type === 'mask-datetime' && datePickerActive" :dateTimeProp='dateTime' @closeDatePicker="datePickerActive = false" @dateBack="getDataFromPicker"></dateWidget>
            </div>

            <div class="input-error-message" v-if="ErrorMessageProp && drawError && focus || options.invalid && focus">
                {{(options.message) ? options.message : ErrorMessageProp}}
            </div>
        </div>
    </div>
</template>

<script>

    import source from '../../../../../cp_vue/frontend/vue/components/workzone/forms/widgets/inputs/SimpleInput.vue'

    source.data = function data () {
        return {
            value: this.passedData,
            focus: false,
            showHint: false,

            datePickerActive: false,
            dateTime: '',
            calendarId: '',
        }
    };

    source.computed.getFormsData = function () {
        return this.$store.getters.getFormsData;
    };

    source.computed.getFormsImmutableData = function getFormsImmutableData () {
        return this.$store.getters.getFormsImmutableData;
    };


    source.watch.getFormsData = function getFormsData(){
            if (this.options.parentValue)
                this.value = this.getFormsData[this.options.parentValue]
    };

    source.methods.vuexCallback = function vuexCallback() {
        if (this.options.type === 'mask-datetime' || this.options.type === 'mask-date' || this.options.type === 'mask-time')
            this.$store.commit('setFormsObject', {[this.options.codename]: this.formatDatetime()});
        else {
            this.$store.commit('setFormsObject', {[this.options.codename]: (this.value === null) ? 0 : this.value});
            //ниже логика для логина
            if (this.options.oneWaySync && !this.getFormsImmutableData.is_superuser)
                this.$store.commit('setFormsObject', {[this.options.oneWaySync]: (this.value === null) ? 0 : this.filterValue()});
        }

        this.$store.commit('changeWidgetStatus', {flag: this.options.codename, value: true});
        this.$store.commit('setFormsWidgetTrigger');
    };

    export default source;
</script>