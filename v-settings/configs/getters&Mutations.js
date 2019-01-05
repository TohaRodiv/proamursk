//Вспомагательные методы для нашей системы конфигов

import merge from 'lodash/merge'

import filter from '../../cp_vue/frontend/vue/store/modules/constantOptions/filterOptions'
import columns from '../../cp_vue/frontend/vue/store/modules/constantOptions/columnsOptions'
import forms from '../../cp_vue/frontend/vue/store/modules/constantOptions/formsOptions'
import infoPopups from '../../cp_vue/frontend/vue/store/modules/constantOptions/infoPopups'

const state = {};
const getters = {};
const mutations = {};

merge(getters, filter.getters);
merge(getters, columns.getters);
merge(getters, infoPopups.getters);

merge(state, forms.state);
merge(getters, forms.getters);
merge(mutations, forms.mutations);

export default {
    state,
    getters,
    mutations
}

