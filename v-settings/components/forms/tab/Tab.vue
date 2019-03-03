<template>
    <div class="tab-wrapper" v-if="isNaN(+(this.$route.params.id)) || ((formsCurrentMode === 'moving') ? (showMovingsTab && ((openedIndex === 0) ? (openedIndex ===  tabIndex) : true)) : true)" :style="(formsCurrentMode !== 'moving') ? {marginTop: 0}: ''">
        <div class="forms-moving-borders" v-if="formsCurrentMode === 'moving' && options.codename !== getMovingData.status && options.show && !isNaN(+(this.$route.params.id)) && showMovingsTab"></div>

        <div class="tab-movings" :class="{'marginBottom30': options.show}" v-if="formsCurrentMode === 'moving' && ( (getMovingData.status_log && getMovingData.status_log[openedIndex]) ? getMovingData.status_log[openedIndex].status !== 'complete': true) && !isNaN(+(this.$route.params.id)) && showMovingsTab && (getMovingData && ((getMovingData.status !== 'complete') ? openedIndex !== getMovingData.status_log.length - 1 : true))" @click="toggleTabOnMovingsForm()">
            <div class="tab-movings-arrow icon-arrow-2" :class="{'tab-movings-arrow-closed': !options.show}"></div>
            <span class="tab-movings-text"> {{ (getMovingData.status_log[openedIndex + 1]) ? getMovingData.status_log[openedIndex + 1].status_name : ''}}</span>
        </div>

        <div class="current-moving" v-if="getMovingData.status_log && openedIndex === getMovingData.status_log.length - 1 && getMovingData.status !== 'complete' && getMovingData.status !== 'canceled'">{{getCurrentStatus()}}</div>

        <div
                class="tab-row"
                v-if="!(block.cancelRenderIFSuperuser && getFormsImmutableData.is_superuser) && ((block.blockedOn) ? ( (block.blockedOn === 'new' && isNaN(+($route.params.id)) ? false : ( (block.blockedOn === 'exist' && !isNaN(+($route.params.id)) ) ? false : true ) )) : true)"
                v-show="((block.renderFlag || block.forbiddenFlag) && ((formsCurrentMode === 'moving') ? options.show : true ) ) ? checkTriggersFlag(block) : true && (formsCurrentMode === 'moving' && !isNaN(+($route.params.id))) ? options.show === true && showMovingsTab : true"
                v-for="(block, blockDex) in options.blocks" :key="blockDex" :style="calculateFlexDirection(block)">
            <div class="tab-left-label col4" v-if="block.labelPosition !== 'left' && !block.hasWideLabel && !block.uniqWidget"></div>
            <div
                    class="tab-item"
                    v-if="element.show !== false"
                    v-show="(element.renderFlag || element.forbiddenFlag) ? checkTriggersFlag(element) : true"
                    :class="[(block.modClass && ( (block.nullRender) ? (data[block.nullRender] && data[block.nullRender].length !== 0) : true ) ) ? block.modClass : element.modClass , findMyWidth(element, block)]"
                    :style="(block.uniqWidget) ? {width: '100%'} : ((element.nullRightMargin) ? {marginRight: 0, width: '460px'} : '')"
                    v-for="(element) in block.elements"
                    :key="(typeof element.codename !== 'object') ? element.codename : Math.random()">

                <headerWidget
                        v-if="element.type === 'header'"
                        :options="element">
                </headerWidget>

                <recursiveNode
                        v-if="element.type === 'recursion'"
                        @recursiveCallback="recursiveCallbackStore"
                        :data="data"
                        :node="element">
                </recursiveNode>
                <!--Длинное условие v-if ниже нужно для того чтобы рендерить по имени виджета, и наличие (если необходимо) определённого флага во vuex-->
                <simpleInput
                        v-if="element.widget === 'simpleInput'"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :isBlocked="isBlocked(element)"
                        :options="element">
                </simpleInput>

                <wideHint
                        v-if="element.widget === 'wideHint'"
                        :passedData="(element.codename) ? data[element.codename] : ''"
                        :options="element">
                </wideHint>

                <textareaComp
                        v-if="element.widget === 'textarea'"
                        :labelPosition="block.labelPosition"
                        :isBlocked="isBlocked(element)"
                        :passedData="data[element.codename]"
                        :options="element">
                </textareaComp>

                <singleSelector
                        v-if="element.widget === 'singleSelector'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :options="element">
                </singleSelector>

                <multipleSelector
                        v-if="element.widget === 'multipleSelector' && !(element.cancelRenderIFSuperuser && getFormsImmutableData.is_superuser)"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :options="element">
                </multipleSelector>

                <singleCheckbox
                        v-if="element.widget === 'singleCheckbox'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :options="element">
                </singleCheckbox>

                <radiobuttonGroup
                        v-if="element.widget === 'radioButtons'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :direction="block.direction"
                        :options="element">
                </radiobuttonGroup>

                <radioTabs
                        v-if="element.widget === 'radioTabs'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :direction="block.direction"
                        :options="element">
                </radioTabs>

                <simpleChildEntity
                        v-show="((element.renderFlag || element.forbiddenFlag) ? checkTriggersFlag(element) : true) && ( (block.nullRender) ? (data[block.nullRender] && data[block.nullRender].length !== 0) : true )"
                        v-if="element.widget === 'simpleChildEntity'"
                        :isBlocked="isBlocked(element)"
                        :passedData="data[element.codename]"
                        :options="element">
                </simpleChildEntity>

                <childEntity
                        v-show="((element.renderFlag || element.forbiddenFlag) ? checkTriggersFlag(element) : true ) && ( (block.nullRender) ? (data[block.nullRender] && data[block.nullRender].length !== 0) : true )"
                        v-if="element.widget === 'childEntity'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :options="element">
                </childEntity>

                <singleImageLoader
                        v-if="element.widget === 'singleImageLoader'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :options="element">
                </singleImageLoader>

                <singleFileLoader
                        v-if="element.widget === 'singleFileLoader'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :options="element">
                </singleFileLoader>

                <multipleImageLoader
                        v-if="element.widget === 'multipleImageLoader'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :dndOrder="data[element.dndFlag]"
                        :options="element">
                </multipleImageLoader>

                <multipleFileLoader
                        v-if="element.widget === 'multipleFileLoader'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :passedData="data[element.codename]"
                        :dndOrder="data[element.dndFlag]"
                        :options="element">
                </multipleFileLoader>

                <passwordChanger
                        v-if="element.widget === 'passwordChanger'"
                        :isBlocked="isBlocked(element)"
                        :labelPosition="block.labelPosition"
                        :options="element">
                </passwordChanger>

                <blockedInput
                        v-if="element.widget === 'blockedInput'"
                        :passedData="data[element.passedCodename]"
                        :labelPosition="block.labelPosition"
                        :options="element">
                </blockedInput>

                <summWidget
                        v-if="element.widget === 'summWidget'"
                        :options="element">
                </summWidget>

                <geoinput
                        v-if="element.widget === 'geoinput'"
                        :isBlocked="isBlocked(element)"
                        :passedCoord="data[element.codename]"
                        :labelPosition="block.labelPosition"
                        :options="element">
                </geoinput>

                <formatter
                        v-if="element.widget === 'formatter'"
                        :isBlocked="isBlocked(element)"
                        :text="data[element.codename]"
                        :labelPosition="block.labelPosition"
                        :options="element">
                </formatter>

                <rightsWidget
                        v-if="element.widget === 'rightsWidget'"
                        :isBlocked="isBlocked(element)"
                        :passedData="data[element.codename]"
                        :options="element">
                </rightsWidget>

                <postEditor
                        v-if="element.widget === 'postEditor'"
                        :isBlocked="isBlocked(element)"
                        :passedData="data[element.codename]"
                        :options="element">
                </postEditor>
            </div>
        </div>
    </div>
</template>

<script>
    import source from '../../../../cp_vue/frontend/vue/components/workzone/forms/Tab.vue'
    import formatter from './widgets/Formatter.vue'
    import postEditor from './widgets/postEditor/PostEditor.vue'

    source.components.formatter = formatter
    source.components.postEditor = postEditor

    export default source
</script>