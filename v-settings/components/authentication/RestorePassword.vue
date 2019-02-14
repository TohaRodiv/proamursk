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
                        <div class="auth_title restore-password-title">
                            Восстановление пароля
                        </div>
                        <p class="restore-password--text">
                            Инструкции по восстановлению <br>
                            пароля будут отправлены на<br>
                            указанный email
                        </p>
                        <div style="position: relative;" @mouseenter="focus = true" @mouseleave="focus = false">
                            <input type="email" v-model="email" :class="{'input-on-error': hasError}" class="input auth-email-input auth_input_size" @click="hasError = false" placeholder="Email">
                            <div class="input-error-message" v-if="hasError && focus">
                                {{hasError}}
                            </div>
                        </div>                           <button class="button button-common auth-main-button auth-main-button-size" @click="check">Отправить</button>
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

<script src="../../../cp_vue/frontend/vue/components/authentication/RestorePassword.vue"></script>