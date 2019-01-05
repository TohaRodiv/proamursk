<template>
    <div class="forms">
        <div class="forms-tabs-container" v-if=" (config) ? config.length > 1 && formsCurrentMode !== 'moving' : false">
            <div class="forms-tabs-item"
                 :class="{'forms-tabs-item-error': tab.invalid, 'forms-tabs-item-selected': tab.id === currentTabId}"
                 v-show="(tab.renderFlag || tab.forbiddenFlag) ? checkTriggersFlag(tab) : true"
                 v-if="!(tab.cancelRenderIFSuperuser && getIsSuperUser && itsMineUserForm())"
                 v-for="(tab, tabDex) in config"
                 :key="tabDex"
                 @click="setCurrentTab(tab.id)">
                <span>{{ tab.title }}</span>
                <div v-if="tab.id === currentTabId" class="forms-tabs-item-selected-border"></div>
            </div>
        </div>
        <div class="forms-sidebar-container" v-if="formsCurrentMode === 'moving'">
            <div class="forms-sidebar-header">
                <div class="forms-sidebar-header-small-text">Движение по статусам</div>
                <div class="forms-sidebar-header-bold-text" v-if="isNaN(+(this.$route.params.id))">0. Новый</div>
                <div class="forms-sidebar-header-bold-text" v-if="!isNaN(+(this.$route.params.id))">{{ (getMovingData.status_log) ? (getMovingData.status_log.length - 1) : false}}. {{getMovingData.status_name}}</div>
            </div>

            <div class="forms-sidebar-body"  v-if="formsCurrentMode === 'moving' && isNaN(+($route.params.id))">
                <div class="forms-sidebar-node-main">
                    <div class="forms-sidebar-round-passed">
                        <span class="forms-sidebar-number">0</span>
                    </div>
                    <div class="forms-sidebar-body-bold-text">Новый</div>
                </div>
                <div class="forms-sidebar-node-middle paddingTopBottom13">
                    <div class="forms-sidebar-node-middle-active">
                        <div class="forms-sidebar-header-bold-text-active">
                            {{getFormMovingStatus}}
                        </div>
                    </div>
                </div>
                <div class="forms-sidebar-node-main">
                    <div class="forms-sidebar-round-passed forms-sidebar-round-innactive">
                        <span class="forms-sidebar-number forms-sidebar-number-transparent">1</span>
                    </div>
                    <div class="forms-sidebar-body-bold-text forms-sidebar-bold-text-transparent">Оформлено</div>
                </div>
            </div>

            <div class="forms-sidebar-body" v-if="formsCurrentMode === 'moving' && !isNaN(+($route.params.id))">
                <div v-for="(status, index) in getMovingData.status_log" :key="index">
                    <div class="forms-sidebar-node-main">
                        <div class="forms-sidebar-round-passed" id="11" :class="{'forms-sidebar-round-success': status.status === 'complete', 'forms-sidebar-round-canceled': status.status === 'canceled'}">
                            <span class="forms-sidebar-number" :class="{'forms-sidebar-number-success': status.status === 'complete' || status.status === 'canceled'}">{{index}}</span>
                        </div>
                        <div class="forms-sidebar-body-bold-text" :class="{'forms-sidebar-body-bold-text-success': status.status === 'complete', 'forms-sidebar-body-bold-text-canceled': status.status === 'canceled'}">{{status.status_name}}</div>
                        <div class="forms-sidebar-body-info" :class="{'forms-sidebar-body-info-success': status.status === 'complete', 'forms-sidebar-body-info-canceled': status.status === 'canceled'}"> {{createData(status.create_date)}} / {{status.account.last_name}} {{(status.account.first_name) ? status.account.first_name[0] + '.' : ''}} {{(status.account.patronymic) ? status.account.patronymic[0] + '.': ''}}</div>
                    </div>
                    <div class="forms-sidebar-node-middle" :class="{'paddingTopBottom13': getMovingData.status === status.status && index === getMovingData.status_log.length - 1}" v-if="status.status !== 'complete' && status.status !== 'canceled'">
                        <div class="forms-sidebar-node-middle-active" v-if="getMovingData.status === status.status && index === getMovingData.status_log.length - 1 && getMovingData.status !== 'complete'">
                            <div class="forms-sidebar-header-bold-text-active">
                                <span>{{getMovingData.state_name}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="forms-sidebar-node-main" v-if="getMovingData.status !== 'complete' && getMovingData.status !== 'canceled'">
                    <div class="forms-sidebar-round-passed forms-sidebar-round-innactive">
                        <span class="forms-sidebar-number forms-sidebar-number-transparent">{{(getMovingData.status_log) ? getMovingData.status_log.length : 0}}</span>
                    </div>
                    <div class="forms-sidebar-body-bold-text forms-sidebar-bold-text-transparent">{{getMovingData.next_status_name}}</div>
                </div>
            </div>

            <div class="forms-sidebar-footer-wrapper" v-if="formsCurrentMode === 'moving' && !isNaN(+($route.params.id))">
                <div class="forms-sidebar-footer-container">
                    <div class="forms-sidebar-footer icon-time" @click="showHistoryPopup = true">
                        <span>Подробная история</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="forms-wrapper">
            <!--Левый бордер ниже необходим, так как контейнер форм на всю длину страницы (чтобы подсказки заходили на сайдбар), и не могут отрисовать правый бордер-->
            <div class="forms-left-border"></div>
            <div class="forms-wrapper-inner" :class="{'width100percents': !getMovingData || !getMovingData.status_log}">
                <div class="forms-workzone" :class="{'forms-workzone-no-tabs': config.length === 1 || formsCurrentMode === 'moving'}">
                    <tab
                            :data="($route.params.id !== 'add') ? data : []"
                            v-for="(tab, index) in config"
                            :key="tab.id"
                            :options="tab"
                            :tabIndex="index"
                            :reopenTrigger="reopenTrigger"
                            v-show="(formsCurrentMode !== 'moving') ? tab.id === currentTabId : ((newMode) ? tab.id === 1 : true)">
                    </tab>
                </div>
            </div>
        </div>

        <deletePopup @closeDeletePopup="showDeletePopup = false" v-if="showDeletePopup" @onDelete="typeOfMove === 'onDelete'"> </deletePopup>
        <cancelPopup @closePopup="showCancelPopup = false" v-if="showCancelPopup" @cancelMoving="cancelMoving"> </cancelPopup>
        <infoPopup @closeInfoPopup="showInfoPopup = false" @infoPopupResume="saveEntity('moveForward')" v-if="showInfoPopup"> </infoPopup>
        <unsavedPopup @closePopup="showUnsavedPopup = false" @continueConfirmed="continueConfirmed = true" :pathForRouter="unsavedPopupDaWae" v-if="showUnsavedPopup"> </unsavedPopup>
        <historyPopup @closePopup="showHistoryPopup = false" v-if="showHistoryPopup"> </historyPopup>

        <div v-if="showAdditionalPreloaderData">
            <div class="forms-buttons-container" v-if="!isNaN(+($route.params.id)) && formsCurrentMode !== 'moving'">
                <div class="forms-buttons-container-inner">
                    <button
                            v-if="isDeleteButtonAvailable && (getIsSuperUser || (data.object_permissions && data.object_permissions.delete))"
                            class="button borderless-button forms-cancel-button"
                            @click="showDeletePopup = true"
                            :style="(getIsSuperUser || ( data.object_permissions && data.object_permissions.edit)) ? {borderRight: '1px solid #D1D6DA'} : ''">
                        Удалить
                    </button>
                    <button v-if="(getIsSuperUser || (data.object_permissions && data.object_permissions.edit)) && hasAddRight()" class="button borderless-button forms-save-and-add-button" @click="saveEntity('save&push')">Сохранить и добавить</button>
                    <button v-if="getIsSuperUser || (data.object_permissions && data.object_permissions.edit)" class="button forms-save-button" @click="saveEntity('save')">Сохранить</button>
                </div>
            </div>

            <div class="forms-buttons-container" v-if="isNaN(+($route.params.id)) && formsCurrentMode !== 'moving'">
                <div class="forms-buttons-container-inner">
                    <button class="button borderless-button forms-save-and-add-button" v-if="$route.params.id !== 'form' && hasAddRight() && hasAddButton && (getIsSuperUser || (data.object_permissions && data.object_permissions.edit))" @click="saveEntity('add&push')">Сохранить и добавить</button>
                    <button v-if="getIsSuperUser || (data.object_permissions && data.object_permissions.edit)" class="button forms-save-button" @click="($route.params.id === 'form') ? saveEntity('save') : saveEntity('add')">Сохранить</button>
                </div>
            </div>

            <div class="forms-buttons-container" v-if="isNaN(+($route.params.id)) && (formsCurrentMode === 'moving')">
                <div class="forms-buttons-container-inner">
                    <button v-if="getIsSuperUser || (data.object_permissions && data.object_permissions.edit)" class="button borderless-button forms-save-and-add-button" @click="saveEntity('add')">Сохранить</button>
                    <button v-if="getIsSuperUser || (data.object_permissions && data.object_permissions.edit)" class="button forms-save-button-forward icon-arrow-2" @click="saveEntity('moveForward')">Далее</button>
                </div>
            </div>

            <div class="forms-buttons-container" v-if="!isNaN(+($route.params.id)) && formsCurrentMode === 'moving' && getMovingData.status !== 'complete' && getMovingData.status !== 'canceled' && (($route.params.view === 'moving' || $route.params.view === 'orders') ? (getMovingData.status !== 'added_to_trip' && getMovingData.status !== 'trip_in_process') : true)">
                <div>
                    <button v-if="isDeleteButtonAvailable && (getIsSuperUser || (data.object_permissions && data.object_permissions.delete))" class="button borderless-button forms-cancel-button" style="margin-right: auto; border-right: none !important;" @click="showDeletePopup = true">Удалить</button>
                    <button class="button borderless-button forms-cancel-button" style="margin-right: auto; border-right: none !important; border-left: 1px solid rgba(209, 214, 218, 0.5) !important;" v-if="getMovingData.status !== 'new' && (getIsSuperUser || (data.object_permissions && data.object_permissions.edit))" @click="showCancelPopup = true">Отменить</button>
                </div>
                <div style="margin-left: auto; ">
                    <button v-if="getIsSuperUser || (data.object_permissions && data.object_permissions.edit)" class="button borderless-button forms-save-and-add-button" @click="saveEntity('save')">Сохранить</button>
                </div>
                <div style="margin-left: 0" class="forms-buttons-container-inner forms-back-button-container" :class="{'forms-back-button-container-hovered': hoverBackButton}" @click.self="saveEntity('moveBack')" @mouseenter.self="hoverBackButton = true" @mouseleave.self="hoverBackButton = false">
                    <button v-if="getIsSuperUser || (data.object_permissions && data.object_permissions.edit)" class="button forms-back-button icon-arrow-2" @mouseenter="hoverBackButton = true" @click="saveEntity('moveBack')">Назад</button>
                    <button class="button forms-save-button" @mouseenter="hoverBackButton = false" @click="saveEntity('moveForward')" v-if="getMovingData.next_status === 'complete' && (getIsSuperUser || (data.object_permissions && data.object_permissions.edit))">Завершить</button>
                    <button class="button forms-save-button-forward icon-arrow-2" @mouseenter="hoverBackButton = false" @click="saveEntity('moveForward')" v-if="getMovingData.next_status !== 'complete' && (getIsSuperUser || (data.object_permissions && data.object_permissions.edit))">Далее</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import source from '../../../cp_vue/frontend/vue/components/workzone/Forms.js'
    import tab from './tab/Tab.vue'

    source.components.tab = tab;

    export default source;
</script>