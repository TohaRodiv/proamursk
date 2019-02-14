<template>
    <div style="width: 100%; height: 100%;">
        <div class="auth_wrapper">
            <div class="auth-image">
            </div>
                <div class="auth-forms">
                    <div class="auth-forms-inner">
                        <div class="auth_container">
                            <div class="auth_logo">
                                <img src="../../src/images/logo_crown.svg">
                            </div>
                            <div class="auth_title signin-title">
                                Вход
                            </div>
                            <div style="position: relative;" @mouseenter="focus = 'username'" @mouseleave="focus = ''">
                                <input
                                        v-model="username"
                                        type="text"
                                        @click="errors.username = ''"
                                        :class="{'input-on-error': errors.username}"
                                        class="input auth-input auth_input_size"
                                        placeholder="Логин">
                                <div class="input-error-message" v-if="errors.username && focus === 'username'">
                                    {{errors.username}}
                                </div>
                            </div>
                            <div style="position: relative;" @mouseenter="focus = 'password'" @mouseleave="focus = ''">
                                <input
                                        v-model="password"
                                        type="password"
                                        @click="errors.password = ''"
                                        :class="{'input-on-error': errors.password}"
                                        class="input auth-input auth_input_size password-input"
                                        placeholder="Пароль">
                                <div class="input-error-message" v-if="errors.password && focus === 'password'">
                                    {{errors.username}}
                                </div>
                            </div>
                            <button class="button button-common auth-main-button auth-main-button-size" @click="checkBeforeLogin">
                                Войти
                            </button>
                            <router-link :to="{name: 'restore-password'}" tag="button" class="button auth-secondary-button auth-secondary-button-size">
                                Забыли пароль?
                            </router-link>
                        </div>
                        <div class="auth-footer">
                            <span>©{{'&nbsp;'}}</span>
                            <a href="http://perfectura.ru/" target="_blank" class="link">Перфектура</a>
                            <span>, 2019</span>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import src from '../../../cp_vue/frontend/vue/components/authentication/Signin.vue'
    export default src
</script>