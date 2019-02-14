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
                            Новый пароль
                        </div>
                        <div style="position: relative;" @mouseenter="focus = 'new_password1'" @mouseleave="focus = ''">
                            <input
                                    type="password"
                                    v-model="new_password1"
                                    class="input auth-input auth_input_size password-input"
                                    :class="{'input-on-error': errors.new_password1}"
                                    @click="errors.new_password1 = false"
                                    placeholder="Новый пароль">
                            <div class="input-error-message" v-if="errors.new_password1 && focus === 'new_password1'">
                                {{errors.new_password1}}
                            </div>
                        </div>
                        <div style="position: relative;" @mouseenter="focus = 'new_password2'" @mouseleave="focus = ''">
                            <input
                                    type="password"
                                    v-model="new_password2"
                                    class="input auth-input auth_input_size password-input"
                                    :class="{'input-on-error': errors.new_password2}"
                                    @click="errors.new_password2 = false"
                                    placeholder="Новый пароль ещё раз">
                            <div class="input-error-message" v-if="errors.new_password2 && focus === 'new_password2'">
                                {{errors.new_password2}}
                            </div>
                        </div>
                        <button class="button button-common auth-main-button auth-main-button-size" @click="check">Сохранить</button>
                        <router-link :to="{name: 'auth'}" tag="button" class="button auth-secondary-button auth-secondary-button-size">
                            Назад
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

<script src="../../../cp_vue/frontend/vue/components/authentication/ChangePassword.vue"></script>