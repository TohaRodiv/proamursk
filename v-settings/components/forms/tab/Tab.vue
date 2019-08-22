<template>
    <div
        v-if="isNaN(+(this.$route.params.id)) || ((formsCurrentMode === 'moving') ? (showMovingsTab && ((openedIndex === 0) ? (openedIndex === tabIndex) : true)) : true)"
        :style="(formsCurrentMode !== 'moving') ? {marginTop: 0}: ''"
        class="tab-wrapper"
    >
        <div
            v-if="formsCurrentMode === 'moving' && options.codename !== getMovingData.status && options.show && !isNaN(+(this.$route.params.id)) && showMovingsTab"
            class="forms-moving-borders"
        />

        <div
            :class="{'marginBottom30': options.show}"
            v-if="formsCurrentMode === 'moving' && ( (getMovingData.status_log && getMovingData.status_log[openedIndex]) ? getMovingData.status_log[openedIndex].status !== 'complete': true) && !isNaN(+(this.$route.params.id)) && showMovingsTab && (getMovingData && ((getMovingData.status !== 'complete') ? openedIndex !== getMovingData.status_log.length - 1 : true))"
            @click="toggleTabOnMovingsForm()"
            class="tab-movings"
        >
            <div
                :class="{'tab-movings-arrow-closed': !options.show}"
                class="tab-movings-arrow icon-arrow-2"
            />
            <span
                class="tab-movings-text"
            >
                {{ (getMovingData.status_log[openedIndex + 1]) ? getMovingData.status_log[openedIndex + 1].status_name : '' }}
            </span>
        </div>

        <div
            v-if="getMovingData.status_log && openedIndex === getMovingData.status_log.length - 1 && getMovingData.status !== 'complete' && getMovingData.status !== 'canceled'"
            class="current-moving"
        >
            {{ getCurrentStatus() }}
        </div>

        <div
            v-if="!(block.cancelRenderIFSuperuser && getFormsImmutableData.is_superuser) && ((block.blockedOn) ? ( (block.blockedOn === 'new' && isNaN(+($route.params.id)) ? false : ( (block.blockedOn === 'exist' && !isNaN(+($route.params.id)) ) ? false : true ) )) : true)"
            v-show="((block.renderFlag || block.forbiddenFlag) && ((formsCurrentMode === 'moving') ? options.show : true ) ) ? checkTriggersFlag(block) : true && (formsCurrentMode === 'moving' && !isNaN(+($route.params.id))) ? options.show === true && showMovingsTab : true"
            v-for="(block, blockDex) in options.blocks"
            :key="blockDex"
            :style="calculateFlexDirection(block)"
            class="tab-row"
        >
            <div
                v-if="block.labelPosition !== 'left' && !block.hasWideLabel && !block.uniqWidget"
                class="tab-left-label col4"
            />
            <div
                v-if="element.show !== false"
                v-show="(element.renderFlag || element.forbiddenFlag) ? checkTriggersFlag(element) : true"
                :class="[(block.modClass && ( (block.nullRender) ? (formData[block.nullRender] && formData[block.nullRender].length !== 0) : true ) ) ? block.modClass : element.modClass , findMyWidth(element, block)]"
                :style="(block.uniqWidget) ? {width: '100%'} : ((element.nullRightMargin) ? {marginRight: 0, width: '460px'} : '')"
                v-for="(element) in block.elements"
                :key="(typeof element.codename !== 'object') ? element.codename : Math.random()"
                class="tab-item"
            >
                <headerWidget
                    v-if="element.type === 'header'"
                    :options="element"
                />

                <recursiveNode
                    v-if="element.type === 'recursion'"
                    @recursiveCallback="recursiveCallbackStore"
                    :data="formData"
                    :node="element"
                />
                <!--Длинное условие v-if ниже нужно для того чтобы рендерить по имени виджета, и наличие (если необходимо) определённого флага во vuex-->
                <simpleInput
                    v-if="element.widget === 'simpleInput'"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :isBlocked="isBlocked(element)"
                    :options="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <wideHint
                    v-if="element.widget === 'wideHint'"
                    :passedData="(element.codename) ? formData[element.codename] : ''"
                    :options="element"
                />

                <textareaComp
                    v-if="element.widget === 'textarea'"
                    :label-position="block.labelPosition"
                    :prop-data="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <singleSelector
                    v-if="element.widget === 'singleSelector'"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                />

                <multipleSelector
                    v-if="element.widget === 'multipleSelector' && !(element.cancelRenderIFSuperuser && getFormsImmutableData.is_superuser)"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                />

                <singleCheckbox
                    v-if="element.widget === 'singleCheckbox'"
                    :label-position="block.labelPosition"
                    :prop-data="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <radiobuttonGroup
                    v-if="element.widget === 'radioButtons'"
                    :label-position="block.labelPosition"
                    :form-data="formData"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <radioTabs
                    v-if="element.widget === 'radioTabs'"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :direction="block.direction"
                    :options="element"
                />

                <simpleChildEntity
                    v-show="((element.renderFlag || element.forbiddenFlag) ? checkTriggersFlag(element) : true) && ( (block.nullRender) ? (formData[block.nullRender] && formData[block.nullRender].length !== 0) : true )"
                    v-if="element.widget === 'simpleChildEntity'"
                    :isBlocked="isBlocked(element)"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                />

                <childEntity
                    v-show="((element.renderFlag || element.forbiddenFlag) ? checkTriggersFlag(element) : true ) && ( (block.nullRender) ? (formData[block.nullRender] && formData[block.nullRender].length !== 0) : true )"
                    v-if="element.widget === 'childEntity'"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                />

                <singleImageLoader
                    v-if="element.widget === 'singleImageLoader'"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                />

                <singleFileLoader
                    v-if="element.widget === 'singleFileLoader'"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                />

                <multipleImageLoader
                    v-if="element.widget === 'multipleImageLoader'"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :dndOrder="data[element.dndFlag]"
                    :options="element"
                    @clearError="clearError"
                />

                <multipleFileLoader
                    v-if="element.widget === 'multipleFileLoader'"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
                    :dndOrder="data[element.dndFlag]"
                    :options="element"
                    @clearError="clearError"
                />

                <passwordChanger
                    v-if="element.widget === 'passwordChanger'"
                    :isBlocked="isBlocked(element)"
                    :labelPosition="block.labelPosition"
                    :options="element"
                    @clearError="clearError"
                />

                <blockedInput
                    v-if="element.widget === 'blockedInput'"
                    :passedData="formData[element.passedCodename]"
                    :labelPosition="block.labelPosition"
                    :options="element"
                />

                <summWidget
                    v-if="element.widget === 'summWidget'"
                    :options="element" 
                />

                <geoinput
                    v-if="element.widget === 'geoinput'"
                    :passedCoord="formData[element.codename]"
                    :labelPosition="block.labelPosition"
                    :options="element"
                    @clearError="clearError"
                    @change="onChange"
                    @setError="setError"
                />

                <formatter
                    v-if="element.widget === 'formatter'"
                    :isBlocked="isBlocked(element)"
                    :text="formData[element.codename]"
                    :labelPosition="block.labelPosition"
                    :options="element"
                    @clearError="clearError"
                />

                <rightsWidget
                    v-if="element.widget === 'rightsWidget'"
                    :isBlocked="isBlocked(element)"
                    :passedData="formData[element.codename]"
                    :options="element"
                />

                <postEditor
                    v-if="element.widget === 'postEditor'"
                    :isBlocked="isBlocked(element)"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                />

                <textareaPreviewLetter
                    v-if="element.widget === 'textareaPreviewLetter'"
                    :labelPosition="block.labelPosition"
                    :isBlocked="isBlocked(element)"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                />

                <input-datetime
                    v-if="element.widget === 'inputDatetime'"
                    :prop-data="formData[element.codename]"
                    :prop-config="element"
                    :label-position="block.labelPosition"
                    @clearError="clearError"
                    @change="onChange"
                />

                <checkboxesGroup
                    v-if="element.widget === 'checkboxes'"
                    :prop-config="element"
                    :prop-data="formData[element.codename]"
                    @clearError="clearError"
                    @change="onChange"
                />

                <input-component
                    v-if="element.widget === 'inputComponent'"
                    :prop-data="formData[element.codename]"
                    v-bind="element"
                    :label-position="block.labelPosition"
                    @clearError="clearError"
                    @change="onChange"
                />

                <password-widget
                    v-if="element.widget === 'passwordWidget'"
                    :prop-generator-data="formData.password1"
                    :prop-auxiliary-data="formData.password2"
                    :config-generator="element"
                    :config-auxiliary="block.elements[1]"
                    :label-position="block.labelPosition"
                    @clearError="clearError"
                    @change="onChange"
                />
            </div>
        </div>
    </div>
</template>

<script>
import source from "../../../../cp_vue/frontend/vue/components/workzone/forms/Tab.vue";
import formatter from "./widgets/Formatter.vue";
import postEditor from "./widgets/postEditor/PostEditor.vue";

source.components.formatter = formatter;
source.components.postEditor = postEditor;

export default source;
</script>