<template>
    <!-- version 3-->
    <div
        style="margin-top: 0"
        class="tab-wrapper"
    >
        <div
            v-for="(block, blockDex) in options.blocks"
            :key="blockDex"
            :style="calculateFlexDirection(block)"
            :class="block.modClass"
            class="tab-row"
        >
            <div
                v-if="block.labelPosition && block.labelPosition !== 'left' && !block.hasWideLabel && !block.uniqWidget"
                class="tab-left-label col4"
            />
            <div
                v-for="(element, elementIndex) in block.elements"
                :key="'tab-' + options.id + '-block-' + blockDex + '-element-' + elementIndex"
                :class="[element.modClass , findMyWidth(element, block)]"
                class="tab-item"
            >
                <headerWidget
                    v-if="element.type === 'header'"
                    :options="element"
                />

                <simpleInput
                    v-if="element.widget === 'simpleInput'"
                    :labelPosition="block.labelPosition"
                    :passedData="formData[element.codename]"
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
                    :value="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <textarea-json
                    v-if="element.widget === 'textareaJson'"
                    :label-position="block.labelPosition"
                    :value="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <CpSelect
                    v-if="element.widget === 'select'"
                    :labelPosition="block.labelPosition"
                    :value="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <singleCheckbox
                    v-if="element.widget === 'singleCheckbox'"
                    :label-position="block.labelPosition"
                    :value="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <radiobuttonGroup
                    v-if="element.widget === 'radioButtons'"
                    :label-position="block.labelPosition"
                    :value="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <CpRadioTabs
                    v-if="element.widget === 'radioTabs'"
                    :label-position="row.labelPosition"
                    :value="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <simpleChildEntity
                    v-if="element.widget === 'simpleChildEntity'"
                    :items="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <childEntity
                    v-if="element.widget === 'childEntity'"
                    :label-position="block.labelPosition"
                    :items="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <singleImageLoader
                    v-if="element.widget === 'singleImageLoader'"
                    :label-position="block.labelPosition"
                    :image="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                    @setError="setError"
                />

                <singleFileLoader
                    v-if="element.widget === 'singleFileLoader'"
                    :labelPosition="block.labelPosition"
                    :file="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @setError="setError"
                    @change="onChange"
                />

                <multipleImageLoader
                    v-if="element.widget === 'multipleImageLoader'"
                    :labelPosition="block.labelPosition"
                    :images="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                    @setError="setError"
                />

                <multipleFileLoader
                    v-if="element.widget === 'multipleFileLoader'"
                    :labelPosition="block.labelPosition"
                    :files="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
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
                    :text="formData[element.codename]"
                    :labelPosition="block.labelPosition"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <rightsWidget
                    v-if="element.widget === 'rightsWidget'"
                    :passed-data="formData[element.codename]"
                    :options="element"
                    @change="onChange"
                />

                <postEditor
                    v-if="element.widget === 'postEditor'"
                    :passedData="formData[element.codename]"
                    :options="element"
                    @clearError="clearError"
                    @change="onChange"
                />

                <textareaPreviewLetter
                    v-if="element.widget === 'textareaPreviewLetter'"
                    :labelPosition="block.labelPosition"
                    :propData="formData[element.codename]"
                    :config="element"
                    @clearError="clearError"
                    @change="onChange"
                    @setError="setError"
                />

                <input-datetime
                    v-if="element.widget === 'inputDatetime'"
                    :prop-data="formData[element.codename]"
                    :config="element"
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

                <CpInput
                    v-if="element.widget === 'input'"
                    :value="formData[element.codename]"
                    :config="element"
                    :label-position="block.labelPosition"
                    @clearError="clearError"
                    @change="onChange"
                />

                <CpInputMask
                    v-if="element.widget === 'inputMask'"
                    :value="formData[element.codename]"
                    :config="element"
                    :label-position="block.labelPosition"
                    @clearError="clearError"
                    @change="onChange"
                />

                <CpInputNumber
                    v-if="element.widget === 'inputNumber'"
                    :value="formData[element.codename]"
                    :config="element"
                    :label-position="block.labelPosition"
                    @clearError="clearError"
                    @change="onChange"
                />

                <CpInputAutocomplete
                    v-if="element.widget === 'inputAutocomplete'"
                    :value="formData[element.codename]"
                    :config="element"
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

                <CpRights
                    v-if="element.widget === 'rights'"
                    :config="element"
                    :value="formData[element.codename]"
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