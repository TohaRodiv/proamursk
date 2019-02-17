<template>
    <div style="width: 100%; height: 100%; background-color: #fff; margin-top: 200px; margin-left: 300px;">
        <selectorich :isBlocked="false" :labelPosition="'left'" :options="options"></selectorich>
    </div>
</template>

<script>
    import selectorich from '../../cp_vue/frontend/vue/components/workzone/forms/widgets/selectors/SingleSelector.vue'

    export default {
        data() {
            return {
                options: {
                    type: 'icon-selector',
                    expected_value: 'id',
                    label: 'Иконка',
                    required: true,
                    width: 6,
                    sortFlag: {
                        value: 'id',
                        direction: 'desc'
                    },
                    codename: 'icon',
                    widget: 'singleSelector',
                    searchFlag: 'name',
                    invalid: false,
                    view_structure: [
                        {
                            type: 'icons',
                            description: 'name'
                        }
                    ],
                    available_values: [
                        {
                            id: 1,
                            name: 'Карта',
                            iconClassname: 'iconLocal-card',
                            customFontSize: '16px',
                            codename: 'card',
                        },
                        {
                            id: 2,
                            name: 'Процент',
                            iconClassname: 'iconLocal-percent',
                            codename: 'percent',
                        },
                        {
                            id: 3,
                            name: 'Легковой автомобиль',
                            iconClassname: 'iconLocal-car',
                            codename: 'car',
                        },
                        {
                            id: 4,
                            name: 'Кошелёк',
                            iconClassname: 'iconLocal-wallet-fill',
                            codename: 'wallet-fill',
                        },
                        {
                            id: 5,
                            name: 'Джип',
                            iconClassname: 'iconLocal-jeep',
                            codename: 'jeep',
                        },
                        {
                            id: 6,
                            name: 'Масло',
                            iconClassname: 'iconLocal-oil',
                            codename: 'oil',
                        },
                        {
                            id: 7,
                            name: 'Ремонт',
                            iconClassname: 'iconLocal-repairs',
                            customFontSize: '13px',
                            codename: 'repairs',
                        },
                        {
                            id: 8,
                            name: 'Запчасти',
                            iconClassname: 'iconLocal-spare-parts',
                            codename: 'spare-parts',
                        },
                        {
                            id: 9,
                            name: 'Шина',
                            iconClassname: 'iconLocal-tire',
                            codename: 'tire',
                        },
                        {
                            id: 10,
                            name: 'Мойка',
                            iconClassname: 'iconLocal-washing',
                            codename: 'washing',
                        },
                        {
                            id: 11,
                            name: 'Деньги',
                            iconClassname: 'iconLocal-money',
                            customFontSize: '19px',
                            codename: 'money',
                        },

                    ],
                    hint: ''
                },
            }
        },
        mounted() {

        },
        computed: {},
        methods: {},
        components: {
            selectorich,
        }
    }
</script>

