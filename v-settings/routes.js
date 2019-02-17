import controller from '../cp_vue/frontend/vue/components/Controller.vue'
import main from '../cp_vue/frontend/vue/components/Main.vue'
import test from './components/test.vue'
import sidebar from '../cp_vue/frontend/vue/components/sidebar/Sidebar.vue'
import formReloader from '../cp_vue/frontend/vue/components/ForceFormReload.vue'
import tables from '../cp_vue/frontend/vue/components/workzone/Tables.vue'
import forms from './components/forms/Forms.vue'
import authBase from './components/authentication/AuthBase.vue'


//Сюда можно добавить любые новые роуты
const routes = [
    { path: '/test', component: test, name: 'test'},
    { path: '/admin/', component: controller, name: 'URLcontroller'},
    { path: '/admin/signin', component: authBase, name: 'auth'},
    { path: '/admin/password-restore/', name: 'restore-password', component: authBase},
    { path: '/admin/password-change/:token1/:token2', component: authBase, name: 'change-password'},
    { path: '/admin/:view', component: main, children: [
            {path: '/', component: tables, name: 'list'},
            {path: '/formReload', component: formReloader, name: 'formReload'},
            {path: ':id', component: forms, name: 'forms'},
        ]},
    { path: '/', component: sidebar, name: 'getFirstView'},
    { path: '*', component: main, name: '404'},
];

export default {
    routes
}