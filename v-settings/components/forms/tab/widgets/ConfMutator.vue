<template>
    <div style="display: none"></div>
</template>

<script>
    export default {
        props: ['config', 'data'],

        data() {
            return {
                passedData: this.data,
                compiledConfig: [],

                attributeValues: []
            }
        },
        mounted() {
            if (this.data !== []) this.createFields();
        },
        computed: {},

        watch: {
            'data': function () {
                this.passedData = this.data.slice(0, this.data.length);
                this.createFields()
            }
        },

        methods: {
            createFields() {
                this.compiledConfig = [];
                console.log(this.passedData);
                this.$store.commit('purgeTheMutants', {                                                                 /*Перед каждым вызовом, очищаем прошлые экземляры*/
                    view: this.$route.params.view,
                    rendererName: this.config.name,
                });
                if (Array.isArray(this.passedData) && this.$route.params.view === 'goods') {
                    if (this.config.header) {
                        this.compiledConfig.push(
                            {
                                type: 'header',
                                label: this.config.header,
                                width: 12,
                                size: 'first',
                                modClass: ['marginBottom30', 'marginTop21']
                            }
                        )
                    }

                    this.attributeValues = [];

                    for (let i = 0; i < this.passedData.length; i++) {
                        if (this.passedData[i].data_type === 'string') {
                            this.compiledConfig.push(
                                {
                                    id: this.passedData[i].id,
                                    show: true,

                                    isBlocked: true,
                                    type: 'field',
                                    label: (this.passedData[i].unit) ? this.passedData[i].name + ', ' + this.passedData[i].unit.short_name : this.passedData[i].name,
                                    required: false,
                                    width: 8,
                                    codename: this.passedData[i].codename,
                                    widget: 'simpleInput',
                                    api_route: 'goods',
                                    maxWidth: true,
                                    modClass: 'marginBottom22',
                                    hint: ''
                                }
                            )
                        }

                        else if (this.passedData[i].data_type === 'float') {
                            this.compiledConfig.push(
                                {
                                    id: this.passedData[i].id,
                                    show: true,

                                    isBlocked: true,
                                    type: 'float',
                                    label: (this.passedData[i].unit) ? this.passedData[i].name + ', ' + this.passedData[i].unit.short_name : this.passedData[i].name,
                                    required: false,
                                    width: 8,
                                    codename: this.passedData[i].codename,
                                    widget: 'simpleInput',
                                    api_route: 'goods',
                                    modClass: 'marginBottom22',
                                    hint: ''
                                }
                            )
                        }
                        else if (this.passedData[i].data_type === 'text') {
                            this.compiledConfig.push(
                                {
                                    id: this.passedData[i].id,
                                    show: true,

                                    isBlocked: true,
                                    type: 'field',
                                    label: this.passedData[i].name,
                                    required: false,
                                    width: 8,
                                    codename: this.passedData[i].codename,
                                    widget: 'textarea',
                                    api_route: 'goods',
                                    modClass: 'marginBottom22',
                                    hint: '',
                                }
                            )
                        }
                        else if (this.passedData[i].data_type === 'bool') {
                            this.compiledConfig.push(
                                {
                                    id: this.passedData[i].id,
                                    show: true,

                                    isBlocked: true,
                                    type: 'withLeftSpace',
                                    label: this.passedData[i].name,
                                    required: false,
                                    width: 8,
                                    codename: this.passedData[i].codename,
                                    expected_value: this.passedData[i].codename,
                                    widget: 'singleCheckbox',
                                    api_route: 'goods',
                                    modClass: 'marginBottom22',
                                    hint: '',
                                }
                            )
                        }

                        else if (this.passedData[i].data_type === 'one') {
                            this.compiledConfig.push(
                                {
                                    id: this.passedData[i].id,
                                    show: true,

                                    type: 'field',
                                    label: this.passedData[i].name,
                                    isBlocked: true,
                                    required: false,
                                    width: 8,
                                    codename: this.passedData[i].codename,
                                    widget: 'singleSelector',
                                    api_route: 'choices',
                                    params: {
                                        flag: 'attribute',
                                        value: this.passedData[i].id
                                    },
                                    sortFlag: {
                                        value: 'name',
                                        direction: 'asc'
                                    },
                                    key_attr: this.passedData[i].codename,
                                    expected_value: 'id',
                                    default_value: this.passedData[i].codename,
                                    modClass: 'marginBottom22',
                                    validator_name: 'oneof',
                                    validators: ['required_selector'],
                                    view_structure: [     /*Структура picked_item*/
                                        {
                                            value: 'name',
                                            flex: 1.5,      /*Так как контейнер будет флексовым, стоит ввести отдельное значение flex*/
                                            // modClass: 'none'
                                        },
                                    ],
                                    hint: '',
                                }
                            );
                            this.attributeValues.push(this.passedData[i]);
                        }

                        else if (this.passedData[i].data_type === 'many') {
                            this.compiledConfig.push(
                                {
                                    id: this.passedData[i].id,
                                    show: true,
                                    isBlocked: true,
                                    type: 'shortTag',
                                    label: this.passedData[i].name,
                                    expected_value: 'id',
                                    required: false,
                                    width: 8,
                                    codename: this.passedData[i].codename,
                                    widget: 'multipleSelector',
                                    api_route: 'choices',
                                    params: {
                                        flag: 'attribute',
                                        value: this.passedData[i].id
                                    },
                                    modClass: 'marginBottom22',
                                    validator_name: 'oneofmany',
                                    validators: ['required_selector'],
                                    sortFlag: {
                                        value: 'name',
                                        direction: 'asc'
                                    },
                                    view_structure: [     /*Структура picked_item*/
                                        {
                                            value: 'name',
                                            flex: 1.5,      /*Так как контейнер будет флексовым, стоит ввести отдельное значение flex*/
                                            // modClass: 'none'
                                        },
                                    ],
                                    hint: '',
                                }
                            );
                        }
                    }

                    this.$store.commit('mutateConfig', {
                        view: this.$route.params.view,
                        rendererName: this.config.name,
                        compiledObject: this.compiledConfig
                    });
                    this.$store.commit('setAttributeValues', this.attributeValues);                                     /*Это общее хранилище для передачи данных в селекторе. Используется для подгрузки данных при создании формы*/

                    setTimeout(() => {
                        this.$store.commit('setFormsWidgetTrigger');
                    }, 600);
                }
            }
        },

        beforeDestroy(){
            this.$store.commit('purgeTheMutants', {
                view: this.$route.params.view,
                rendererName: this.config.name,
            })
        },
    }
</script>


