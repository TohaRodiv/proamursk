<template>
    <cp-popup-wrap
        @close="close"
        @clickaway="close"
        disable-preloader
    >
        <div class="popup-post-editor-section-label">
            Добавление секции
        </div>
        <div class="popup-post-editor-section-container">
            <div
                v-for="option in options"
                class="popup-post-editor-section-block"
            >
                <span v-if="option.maxColumns !== '_isPercentage'">{{ option.name }} / {{ option.maxColumns }} {{ multiEnds(option.maxColumns) }}</span>
                <span v-else>{{ option.name }}</span>
                <div class="popup-post-editor-section-item-flex-wrapper">
                    <div
                        v-for="column in option.columns"
                        @click="pickSection(column, option.maxColumns)"
                        class="popup-post-editor-section-item-container"
                    >
                        <div
                            :style="{flex: column}"
                            v-if="!Array.isArray(column)"
                            class="popup-post-editor-section-item"
                        >
                            {{ column }} {{ (option.maxColumns === '_isPercentage') ? '%' : '' }}
                        </div>
                        <div
                            v-else
                            class="popup-post-editor-section-item-nested"
                        >
                            <div
                                :style="{flex: innerColumn}"
                                v-for="innerColumn in column"
                                class="popup-post-editor-section-item"
                            >
                                {{ innerColumn }} {{ (option.maxColumns === '_isPercentage') ? '%' : '' }}
                            </div>
                        </div>
                    </div>
                </div>
                <!--Ниже псевдо элемент для кроссбраузерности. Так как падинги и маргины по разносу ведут себя в разных браузерах-->
                <div style="height: 4px;" />
            </div>
        </div>
    </cp-popup-wrap>
</template>

<script>
import CpPopupWrap from '../../../../../../../cp_vue/frontend/vue/components/popups/CpPopupWrap.vue';
import popupMixin from '../../../../../../../cp_vue/frontend/vue/components/popups/popupMixin';
import wordFormHelper from '../../../../../../../cp_vue/frontend/vue/helpers/wordForms';

export default {
    name: 'AddSectionPopup',

    components: {
        CpPopupWrap,
    },

    mixins: [popupMixin,],

    props: {
        config: Object,
        placeIn: [Boolean, Number,],
    },

    data() {
        return {
            // showTransition: false,
            options: [],
        };
    },

    mounted(){
        // setTimeout(() => {
        //     this.showTransition = true;
        // }, 200);

        this.findOptions();
    },

    methods: {
        findOptions(){
            let object = this.config.sections;

            for (let i = 0; i < object.length; i++) {
                let option = {};
                option.name = object[i].name;
                option.maxColumns = this.findMaxColumns(object[i].columns);
                option.columns = this.findColumns(object[i].columns);
                this.options.push(option);
            }
        },

        findColumns(columns){
            let formattedColumns = [];
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].indexOf(':') === -1 && columns[i].indexOf('%') === -1) {
                    formattedColumns.push(+columns[i]);
                }

                else if (columns[i].indexOf('%') === -1 && columns[i].indexOf(':') !== -1) {
                    let values = columns[i].split(':');
                    let collector = [];
                    for (let k = 0; k < values.length; k++) {
                        collector.push(+values[k]);
                    }
                    formattedColumns.push(collector);
                }

                else if (columns[i].indexOf('%') !== -1 && columns[i].indexOf(':') === -1) {
                    formattedColumns.push(+columns[i].slice(0, columns[i].length - 1));
                }

                else if (columns[i].indexOf('%') !== -1 && columns[i].indexOf(':') !== -1) {
                    let values = columns[i].split(':');
                    let collector = [];
                    for (let k = 0; k < values.length; k++) {
                        collector.push(+values[k].slice(0, values[k].length - 1));
                    }
                    formattedColumns.push(collector);
                }
            }
            return formattedColumns;
        },

        findMaxColumns(columns) {
            let wholeNumbers = [];
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].indexOf(':') === -1 && columns[i].indexOf('%') === -1)
                    wholeNumbers.push(+columns[i]);
                else if (columns[i].indexOf('%') !== -1) {
                    return '_isPercentage';
                }
            }
            return Math.max.apply(Math, wholeNumbers);
        },

        multiEnds(number){
            let ends = {
                '1': 'колонка',
                '2_4': 'колонки',
                '5_20': 'колонок',
            };
            return wordFormHelper.numberDependantEnd(number, ends);
        },

        pickSection(column, maxColumns){
            let columns = [];

            if (typeof column === 'number') {
                columns.push({width: column,});
            }

            else if (Array.isArray(column)) {
                for (let i = 0; i < column.length; i++) {
                    columns.push({width: column[i],});
                }
            }

            this.EmitData(columns, maxColumns);
        },

        EmitData(columns, maxColumns){
            let widthArray = columns.map(function (element) {
                return element.width;
            });

            if (typeof this.placeIn === 'number') {
                // this.$emit('createSection', {
                //     'classSuffix': widthArray.join('-'),
                //     isPercentage: maxColumns === '_isPercentage',
                //     columns,
                //     index: this.placeIn,
                // });
                this.callback({
                    classSuffix: widthArray.join('-'),
                    isPercentage: maxColumns === '_isPercentage',
                    columns,
                    index: this.placeIn,
                });

                this.close();
            } else {
                // this.$emit('createSection', {
                //     'classSuffix': widthArray.join('-'),
                //     isPercentage: maxColumns === '_isPercentage',
                //     columns,
                // });
                this.callback({
                    classSuffix: widthArray.join('-'),
                    isPercentage: maxColumns === '_isPercentage',
                    columns,
                });
                this.close();
            }
        },
    },
};
</script>