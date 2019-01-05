<template>
    <div :class="{'filters-container': true, 'filters-container-absolute': isContainerShouldBeAbsolute}">
        <div class="filter-inner-container">
            <div class="filters-top-ghost"></div>
            <div class="filter-element-container" v-for="item in filterConfig" :key="item.filterTitle">
                <SelectorWithTags @selectorCallback="handleChildrenCallback" v-if="item.input_type === 'tagSelector'" :options="item"></SelectorWithTags>
                <toFromDateInput @applyFilters="handleAllCallbacks" @callbackToFromDate="handleChildrenCallback" v-if="item.input_type === 'toFromDate'" :options="item"></toFromDateInput>
                <toFromIntegerInput :filterStatus="filterStatus" @applyFilters="handleAllCallbacks" @callbackToFromInt="handleChildrenCallback" v-if="item.input_type === 'toFromInteger'" :options="item"></toFromIntegerInput>
                <checkboxList @checkboxListCallback="handleChildrenCallback" v-if="item.input_type === 'CheckboxList'" :options="item"></checkboxList>
                <tags @checkboxListCallback="handleChildrenCallback" v-if="item.input_type === 'tags'" :options="item"></tags>
                <radiobuttonsList @radiobuttonListCallback="handleChildrenCallback" v-if="item.input_type === 'radiobuttonsList'" :options="item"></radiobuttonsList>
                <inputWidget @inputCallback="handleChildrenCallback" v-if="item.input_type === 'input'" :options="item"></inputWidget>
            </div>
            <div class="filters-bottom-ghost">
                <div class="filter-button-container">
                    <button class="button filter-submit-button" @click="handleAllCallbacks">Применить</button>
                    <button class="button filter-cancel-button" @click="dropFilters">Сбросить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import src from '../../../cp_vue/frontend/vue/components/workzone/tables/filter/Filters.vue'
    import axios from 'axios'


    src.methods.dropFilters = function dropFilters() {
        this.$store.commit('triggerClearFiltersTrigger');
        this.$store.commit('setQueryParam', {flag: 'p', value: 1});
        this.$store.commit('deleteAllParamsExcept', ['order_by', 'p']);
        let params = {};
        let axiosParams ={
            limit: this.getLimit,
            offset: 0,                                                                                      /*При смене фильтра нужно скидывать сдвиг*/
        };
        Object.assign(params, axiosParams, this.getQueryParams);
        let conf = {
            headers: {'Content-Type': 'application/json'},
            params: params,
        };

        const view = (this.$route.params.view === 'goods') ? 'sap-goods' : this.currentView;

        axios.get(`/${view}/`,conf)
            .then(response => {
                this.$store.commit('setList', response.data.items);
                this.$store.commit('setTotalCount', response.data.total_count);
                this.$store.commit('setCountWithFilters', response.data.current_count);
                this.$store.commit('setRight', response.data.next);
                this.$store.commit('setLeft', response.data.previous);
                this.$router.push({name: 'list', params: {view: this.currentView}, query: this.getQueryParams})
            });
        this.$store.commit('triggerListGlobalChecker');
    };


    src.methods.sendApiRequest = function sendApiRequest() {
        this.$store.commit('setQueryParam', {flag: 'p', value: 1});
        let params = {};
        let axiosParams = {
            limit: this.getLimit,
            offset: 0,                                                                                                      /*При смене фильтра нужно скидывать сдвиг*/
        };
        Object.assign(params, axiosParams, this.getQueryParams);
        let conf = {
            headers: {'Content-Type': 'application/json'},
            params: params,
        };
        const view = (this.$route.params.view === 'goods') ? 'sap-goods' : this.view;
        axios.get(`/${view}/`,conf)
            .then(response => {
                this.$store.commit('setList', response.data.items);
                this.$store.commit('setTotalCount', response.data.total_count);
                this.$store.commit('setCountWithFilters', response.data.current_count);
                this.$store.commit('setRight', response.data.next);
                this.$store.commit('setLeft', response.data.previous);
                this.$router.push({name: 'list', params: {view: this.currentView}, query: this.getQueryParams})
            })
    };


    export default src
</script>