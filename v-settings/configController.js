import merge from 'lodash/merge';
import gettersMutations from './configs/getters&Mutations';
import sidebar from './configs/sidebar';
import filesApiMode from './configs/files/filesConfig';
import postEditorConfig from './post-editor/postEditorTemplates';

//Подключаем разделы списков
import newsList from './configs/publications/lists/news';
import eventAnnouncementsList from './configs/publications/lists/eventAnnouncements';
import reportsList from './configs/publications/lists/reports';
import filmsList from './configs/publications/lists/films';
import historyList from './configs/publications/lists/history';
import historyRubricList from './configs/publications/lists/historyRubrics';
import placesList from './configs/publications/lists/places';
import personsList from './configs/publications/lists/persons';
import cityGuidesList from './configs/publications/lists/cityGuides';
import specialsList from './configs/publications/lists/specials';
import slidersList from './configs/companionContent/lists/sliders';
import staticPagesList from './configs/companionContent/lists/staticPages';
import wideBannersList from './configs/ad/lists/wideBanners';
import sidebarBannersList from './configs/ad/lists/sidebarBanners';
import userList from './configs/administration/lists/users';
import rolesList from './configs/administration/lists/roles';
import notificationTemplateList from './configs/informing/lists/notificationTemplates';
import recipientsList from './configs/informing/lists/recipients';
import actionsList from './configs/informing/lists/actions';
import feedbacksList from './configs/feedback/lists/feedbacks';
import textErrorsList from './configs/feedback/lists/textErrors';
import reviewsList from './configs/feedback/lists/reviews';
import subscribersList from './configs/emailing/lists/subscribers';
import campaignsList from './configs/emailing/lists/campaigns';
import operationsList from './configs/operations/lists/operationLog';
import staticPagesSettsList from './configs/settings/lists/staticPage';
import imagesList from './configs/files/lists/images';
import filesList from './configs/files/lists/files';


//Подключаем разделы инфо-попапов
import feedbacksPopup from './configs/feedback/info-popups/feedbacks';
import textErrorsPopup from './configs/feedback/info-popups/textErrors';
import operationsPopup from './configs/operations/info-popups/operationLog';
import subscribersPopup from './configs/emailing/info-popups/subscribers';

//Подключаем разделы форм
import newsForm from './configs/publications/forms/news';
import eventAnnouncementsForm from './configs/publications/forms/eventAnnouncements';
import reportsForm from './configs/publications/forms/reports';
import filmsForm from './configs/publications/forms/films';
import historyForm from './configs/publications/forms/history';
import historyRubricForm from './configs/publications/forms/historyRubrics';
import placesForm from './configs/publications/forms/places';
import personsForm from './configs/publications/forms/persons';
import cityGuidesForm from './configs/publications/forms/cityGuides';
import specialsForm from './configs/publications/forms/specials';
import slidersForm from './configs/companionContent/forms/sliders';
import staticPagesForm from './configs/companionContent/forms/staticPages';
import wideBannersForm from './configs/ad/forms/wideBanners';
import sidebarBannersForm from './configs/ad/forms/sidebarBanners';
import usersForm from './configs/administration/forms/users';
import rolesForm from './configs/administration/forms/roles';
import notificationTemplateForm from './configs/informing/forms/notificationTemplates';
import recipientsForm from './configs/informing/forms/recipients';
import actionsForm from './configs/informing/forms/actions';
import settingsForm from './configs/settings/forms/settings';
import reviewsForm from './configs/feedback/forms/reviews';
import subscribersForm from './configs/emailing/forms/subscribers';
import campaignsForm from './configs/emailing/forms/campaigns';
import staticPagesSettsForm from './configs/settings/forms/staticPage';

//Просто пустые значения которые наполнятся ниже
let state = {};
let getters = {};
let mutations = {};
let actions = {};

//Перечисляем разделы которые надо подключить
let lists = [
    newsList,
    eventAnnouncementsList,
    reportsList,
    filmsList,
    historyList,
    historyRubricList,
    placesList,
    personsList,
    cityGuidesList,
    specialsList,
    slidersList,
    staticPagesList,
    wideBannersList,
    sidebarBannersList,
    userList,
    rolesList,
    notificationTemplateList,
    recipientsList,
    actionstList,
    feedbacksList,
    textErrorsList,
    reviewsList,
    subscribersList,
    campaignsList,
    operationsList,
    staticPagesSettsList,
    imagesList,
    filesList,
];

let infoPopups = [
    feedbacksPopup,
    textErrorsPopup,
    operationsPopup,
    subscribersPopup,
];

let forms = [
    newsForm,
    eventAnnouncementsForm,
    reportsForm,
    filmsForm,
    historyForm,
    historyRubricForm,
    placesForm,
    personsForm,
    cityGuidesForm,
    specialsForm,
    slidersForm,
    staticPagesForm,
    wideBannersForm,
    sidebarBannersForm,
    usersForm,
    rolesForm,
    notificationTemplateForm,
    recipientsForm,
    actionsForm,
    settingsForm,
    reviewsForm,
    subscribersForm,
    campaignsForm,
    staticPagesSettsForm,
];


//Циклом собираем разделы из конфигов массивов выше
if (lists) for (let i = 0; i < lists.length; i++) merge(state, lists[i].state);
if (forms) for (let i = 0; i < forms.length; i++) merge(state, forms[i].state);
if (infoPopups) for (let i = 0; i < infoPopups.length; i++) merge(state, infoPopups[i].state);

//Здесь собираются все вторичные конфиги и вспомогательные методы.
merge(state, sidebar.state);
merge(state, gettersMutations.state);
merge(state, filesApiMode.state);
merge(state, postEditorConfig.state);
merge(getters, gettersMutations.getters);
merge(getters, sidebar.getters);
merge(mutations, gettersMutations.mutations);


export default {
    state,
    getters,
    mutations,
    actions,
};

