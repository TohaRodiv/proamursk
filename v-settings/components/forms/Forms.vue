<template>
    <div
        id="form"
        class="forms"
    >
        <div class="forms-container">
            <div class="forms-container-inner">
                <div
                    :style="computedFormsWrapperWidth"
                    class="forms-wrapper"
                >
                    <div class="form_box">
                        <div class="tabs-wrapper">
                            <div
                                v-if=" config ? config.length > 1 : false"
                                class="forms-tabs-container"
                            >
                                <div
                                    :class="{'forms-tabs-item-error': tab.invalid, 'forms-tabs-item-selected': tab.id === currentTabId, 'forms-tabs-item-blocked': tab.blocked}"
                                    v-show="(tab.renderFlag || tab.forbiddenFlag || tab.hidden) ? checkTriggersFlag(tab) : true"
                                    v-for="(tab, tabDex) in config"
                                    :key="tabDex"
                                    @click="tab.blocked ? '' : setCurrentTab(tab.id)"
                                    class="forms-tabs-item"
                                >
                                    <span>
                                        {{ tab.title }}
                                    </span>
                                    <div
                                        v-if="tab.id === currentTabId"
                                        class="forms-tabs-item-selected-border"
                                    />
                                </div>
                            </div>
                            <div
                                class="forms-wrapper-inner width100percents"
                            >
                                <div
                                    :class="{'forms-workzone-no-tabs': config.length === 1}"
                                    class="forms-workzone"
                                >
                                    <tab
                                        :data="data"
                                        v-for="(tab, index) in config"
                                        :key="tab.id"
                                        :options="tab"
                                        :tabIndex="Number(index)"
                                        :reopenTrigger="reopenTrigger"
                                        :form-data="data"
                                        v-show="tab.id === currentTabId"
                                        @clearError="clearError"
                                        @change="setNewValues"
                                        @setError="setError"
                                        @simpleChildEntityEvent="simpleChildEntityEventsHandler"
                                    />
                                </div>
                            </div>
                        </div>
                        <formFooter
                            v-if="compShowFormFooter"
                            :propConfig="compFooterConfig"
                            :propItem="getFormsData"
                        />
                    </div>
                    <form-sidebar
                        v-if="computedShowFormSidebar"
                        :item="data"
                        :actions="actions"
                        :activate-action="activateAction"
                        @initAction="actionHandler"
                    />
                </div>
            </div>

            <deletePopup
                @closeDeletePopup="showDeletePopup = false"
                v-if="showDeletePopup"
                @onDelete="typeOfMove === 'onDelete'"
            />
            <cancelPopup
                @closePopup="showCancelPopup = false"
                v-if="showCancelPopup"
                @cancelMoving="cancelMoving"
            />
            <infoPopup
                @closeInfoPopup="showInfoPopup = false"
                @infoPopupResume="saveEntity('moveForward')"
                v-if="showInfoPopup"
            />
            <unsavedPopup
                @closePopup="showUnsavedPopup = false"
                @continueConfirmed="continueConfirmed = true"
                :pathForRouter="unsavedPopupDaWae"
                v-if="showUnsavedPopup"
            />
            <historyPopup
                @closePopup="showHistoryPopup = false"
                v-if="showHistoryPopup"
            />

            <div
                v-if="!isNaN(+(id))"
                class="forms-buttons-container"
            >
                <div class="forms-buttons-container-inner">
                    <div class="form-footer__minor-buttons-wrap">
                        <button
                            v-for="(action, indexAction) in footerActions"
                            :key="'footer-custom-action-' + indexAction"
                            :class="action.classes"
                        >
                            {{ action.label }}
                        </button>
                        <button
                            v-if="hasDelete"
                            @click="showDeletePopup = true"
                            class="button borderless-button forms-cancel-button"
                        >
                            Удалить
                        </button>
                        <button
                            v-if="duplicateAction"
                            @click="actionHandler(duplicateAction.method)"
                            class="button borderless-button forms-save-and-add-button"
                        >
                            {{ duplicateAction.label }}
                        </button>
                        <button
                            v-if="compHasEditPermission"
                            @click="saveEntity('save&push')"
                            class="button borderless-button forms-save-and-add-button"
                        >
                            Сохранить и добавить
                        </button>
                    </div>
                    <div class="form-footer__major-buttons-wrap">
                        <button
                            v-if="compHasEditPermission"
                            @click="save"
                            class="button forms-save-button"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>

            <div
                v-if="isNaN(+(id))"
                class="forms-buttons-container"
            >
                <div class="forms-buttons-container-inner">
                    <div class="form-footer__minor-buttons-wrap">
                        <button
                            v-if="hasSaveAndAdd"
                            @click="saveEntity('add&push')"
                            class="button borderless-button forms-save-and-add-button"
                        >
                            Сохранить и добавить
                        </button>
                    </div>
                    <div class="form-footer__major-buttons-wrap">
                        <button
                            v-if="hasSave"
                            @click="save"
                            class="button forms-save-button"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import source from '../../../cp_vue/frontend/vue/components/workzone/Forms.js';
import tab from './tab/Tab.vue';

source.components.tab = tab;

export default source;
</script>