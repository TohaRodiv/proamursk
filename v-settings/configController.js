import merge from 'lodash/merge'
import gettersMutations from './configs/getters&Mutations'
import sidebar from './configs/sidebar'
import filesApiMode from './configs/files/filesConfig'

//Подключаем разделы списков
import newsList from './configs/publications/lists/news'

//Подключаем разделы инфо-попапов

//Подключаем разделы форм
import newsForm from './configs/publications/forms/news'

//Просто пустые значения которые наполнятся ниже
let state = {};
let getters = {};
let mutations = {};

//Перечисляем разделы которые надо подключить
let lists = [
    newsList,
];

let infoPopups = [
];

let forms = [
    newsForm
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

