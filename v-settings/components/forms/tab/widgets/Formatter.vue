<template>
    <div
        :class="{'col12': labelPosition === 'top', 'col16': labelPosition === 'left'}"
        :style="(labelPosition === 'left') ? {display: 'flex'} : false"
    >
        <div
            v-if="labelPosition === 'left'"
            style="display: flex; margin-right: 20px"
        >
            <div
                v-if="labelPosition === 'left' && config.required"
                class="tab-left-label col4"
            >
                <div
                    v-if="labelPosition === 'left' && config.hint"
                    class="hint-wrapper"
                >
                    <div class="hint-inner-wrapper">
                        <div
                            @mouseenter="showHint = true"
                            @mouseleave="showHint = false"
                            class="hint-container icon-question"
                        />
                        <div
                            v-if="showHint"
                            class="arrow-wrapper"
                        >
                            <div class="hint-arrow" />
                        </div>
                        <div
                            v-if="showHint"
                            class="hint-message"
                        >
                            {{ config.hint }}
                        </div>
                    </div>
                </div>
                <span
                    v-html="config.label"
                    class="label-text tab-required-star-left"
                />
            </div>
            <div
                v-if="labelPosition === 'left' && !config.required"
                class="tab-left-label col4"
            >
                <div
                    v-if="labelPosition === 'left' && config.hint"
                    class="hint-wrapper"
                >
                    <div class="hint-inner-wrapper">
                        <div
                            @mouseenter="showHint = true"
                            @mouseleave="showHint = false"
                            class="hint-container icon-question"
                        />
                        <div
                            v-if="showHint"
                            class="arrow-wrapper"
                        >
                            <div class="hint-arrow" />
                        </div>
                        <div
                            v-if="showHint"
                            class="hint-message"
                        >
                            {{ config.hint }}
                        </div>
                    </div>
                </div>
                <span
                    v-html="config.label"
                    class="label-text"
                />
            </div>
        </div>
        <div
            v-if="labelPosition === 'top'"
            style="display: flex; max-width: 100%; padding-right: 15px"
        >
            <div
                v-if="labelPosition === 'top' && config.required"
                class="tab-top-label"
                style="width: auto"
            >
                <span
                    v-html="config.label"
                    class="label-text ellipsis"
                />
            </div>
            <span
                v-if="labelPosition === 'top' && config.required"
                class="tab-required-star"
            />
            <div
                v-if="labelPosition === 'top' && !config.required"
                class="tab-top-label ellipsis"
            >
                <span
                    v-html="config.label"
                    class="label-text"
                />
            </div>
            <div
                v-if="labelPosition === 'top' && config.hint"
                class="hint-wrapper"
            >
                <div class="hint-inner-wrapper">
                    <div
                        @mouseenter="showHint = true"
                        @mouseleave="showHint = false"
                        class="hint-container icon-question"
                    />
                    <div
                        v-if="showHint"
                        class="arrow-wrapper"
                    >
                        <div class="hint-arrow" />
                    </div>
                    <div
                        v-if="showHint"
                        class="hint-message"
                    >
                        {{ config.hint }}
                    </div>
                </div>
            </div>
        </div>
        <div
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            @click="clearError"
            style="position: relative;"
        >
            <div
                :class="{'blocked-input': config.blocked}"
                style="width: 702px; background-color: rgba(250, 250, 250, .4)"
            />
            <textarea
                @change="changeValue($event)"
                @click="clearError"
                :ref="'formatter-' + config.codename"
            >{{ value ? value : '' }}</textarea>
            <div
                v-if="config.invalid && hover"
                class="input-error-message"
            >
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        labelPosition: {
            type: String,
            default: "left",
        },
        config: {
            type: Object,
            default() {
                return {}
            }
        },
        text: String,
    },

    data() {
        return {
            oldValue: "",
            hover: false,
            focus: false,
            static_version: "",
        };
    },

    computed: {
        value: {
            get() {
                return this.text || '';
            },
            set(value) {
                this.clearError();
                this.$emit('change', { [this.config.codename]: value, });
            },
        },

        errorMessage() {
            return Array.isArray(this.config.message)
                ? this.config.message.join(', ')
                : this.config.message;
        }
    },

    watch: {
        'config.invalid': {
            handler(value) {
                this.setInvalid(value)
            }
        },

        '$route.params': {
            handler(value) {
                if (value.id === 'add') {
                    this.onClearFormatter();
                }
            }
        },
    },

    mounted() {
        this.getStaticVersion();
        this.initFormatter();
    },

    methods: {
        initFormatter() {
            const el = this.$refs['formatter-' + this.config.codename];
            this.$nextTick(() => {
                new Formatter(el, {
                    toolbar: [
                        [
                            "bold",
                            "italic",
                            "strikeThrough",
                            "underline",
                            "|",
                            "insertUnorderedList",
                            "insertOrderedList",
                            "|",
                            "justifyLeft",
                            "justifyCenter",
                            "justifyRight",
                            "justifyFull",
                            "|",
                            "link",
                            "specialChar",
                            "footnote",
                        ],
                        ["setStyle", "fontColor", "backgroundColor",],
                    ],
                    formatterFrameCssPath:
                            process.env.NODE_ENV === "development"
                                ? "/v-settings/src/css/formatter_content.css" + this.static_version
                                : "/static/cp_vue/css/formatter/formatter_content.css" + this.static_version,
                    width: 700,
                });
            })
        },

        onClearFormatter() {
            const el = this.$refs['formatter-' + this.config.codename];

            if (el) {
                this.value = '';
                const event = new Event('clear');
                el.dispatchEvent(event);
            }
        },

        setInvalid(status) {
            const wrapper = document.getElementsByClassName("formatter-wrapper")[0];

            if (typeof wrapper !== "undefined") {
                if (status) {
                    wrapper.style.border = "1px solid #ffb9c4";
                    wrapper.style.borderRadius = "5px";
                } else {
                    wrapper.style.border = "1px solid transparent";
                }
            }
        },

        changeValue(e) {
            if (e.target.value === "<p>​</p>") this.value = "";
            else if (e.target.value !== this.oldValue)
                this.value = e.target.value;
        },

        clearError() {
            if (this.config.invalid) {
                this.$emit('clearError', this.config.codename)
            }
        },

        getStaticVersion() {
            let staticVersion = document.getElementsByTagName('html')[0].getAttribute('data-static-version');
            if (staticVersion) {
                this.static_version = staticVersion;
            }
        },
    },
};
</script>