import merge from 'lodash/merge'
import gettersMutations from './configs/getters&Mutations'
import sidebar from './configs/sidebar'
import filesApiMode from './configs/files/filesConfig'

//Подключаем разделы списков
import newsList from './configs/publications/lists/news'
import eventAnnouncementsList from './configs/publications/lists/eventAnnouncements'
import reportsList from './configs/publications/lists/reports'
import filmsList from './configs/publications/lists/films'
import historyList from './configs/publications/lists/history'
import cityGuidesList from './configs/publications/lists/cityGuides'
import slidersList from './configs/companionContent/lists/sliders'
import wideBannersList from './configs/ad/lists/wideBanners'
import sidebarBannersList from './configs/ad/lists/sidebarBanners'
import userList from './configs/administration/lists/users'
import rolesList from './configs/administration/lists/roles'
import notificationTemplateList from './configs/informing/lists/notificationTemplates'
import recipientsList from './configs/informing/lists/recipients'
import eventList from './configs/informing/lists/events'

//Подключаем разделы инфо-попапов

//Подключаем разделы форм
import newsForm from './configs/publications/forms/news'
import eventAnnouncementsForm from './configs/publications/forms/eventAnnouncements'
import reportsForm from './configs/publications/forms/reports'
import filmsForm from './configs/publications/forms/films'
import historyForm from './configs/publications/forms/history'
import cityGuidesForm from './configs/publications/forms/cityGuides'
import slidersForm from './configs/companionContent/forms/sliders'
import wideBannersForm from './configs/ad/forms/wideBanners'
import sidebarBannersForm from './configs/ad/forms/sidebarBanners'
import usersForm from './configs/administration/forms/users'
import rolesForm from './configs/administration/forms/roles'
import notificationTemplateForm from './configs/informing/forms/notificationTemplates'
import recipientsForm from './configs/informing/forms/recipients'
import eventsForm from './configs/informing/forms/events'
import settingsForm from './configs/settings/forms/settings'

//Просто пустые значения которые наполнятся ниже
let state = {};
let getters = {};
let mutations = {};

//Перечисляем разделы которые надо подключить
let lists = [
    newsList,
    eventAnnouncementsList,
    reportsList,
    filmsList,
    historyList,
    cityGuidesList,
    slidersList,
    wideBannersList,
    sidebarBannersList,
    userList,
    rolesList,
    notificationTemplateList,
    recipientsList,
    eventList,
];

let infoPopups = [
];

let forms = [
    newsForm,
    eventAnnouncementsForm,
    reportsForm,
    filmsForm,
    historyForm,
    cityGuidesForm,
    slidersForm,
    wideBannersForm,
    sidebarBannersForm,
    usersForm,
    rolesForm,
    notificationTemplateForm,
    recipientsForm,
    eventsForm,
    settingsForm
];


//Циклом собираем разделы из конфигов массивов выше
if (lists) for (let i = 0; i < lists.length; i++) merge(state, lists[i].state);
if (forms) for (let i = 0; i < forms.length; i++) merge(state, forms[i].state);
if (infoPopups) for (let i = 0; i < infoPopups.length; i++) merge(state, infoPopups[i].state);

//Здесь собираются все вторичные конфиги и вспомогательные методы.
merge(state, sidebar.state);
merge(state, gettersMutations.state);
merge(state, filesApiMode.state);
merge(getters, gettersMutations.getters);
merge(getters, sidebar.getters);
merge(mutations, gettersMutations.mutations);

export default {
    state,
    getters,
    mutations
}

