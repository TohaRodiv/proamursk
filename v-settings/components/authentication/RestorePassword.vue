<template>
    <div>
        <div class="auth-title-container">
            <div class="auth_title restore-password-title">
                Восстановление пароля
            </div>
            <p class="restore-password--text">
                Инструкции по восстановлению <br>
                пароля будут отправлены на<br>
                указанный email
            </p>
        </div>
        <div @mouseenter="focus = true" @mouseleave="focus = false">
            <input type="email" v-model="email" :class="{'input-on-error': hasError}" class="input auth-email-input auth_input_size" @click="hasError = false" placeholder="Email">
            <div class="input-error-message" v-if="hasError && focus">
                {{hasError}}
            </div>
        </div>
        <button class="button button-common auth-main-button auth-main-button-size" @click="check">Отправить</button>
        <router-link :to="{name: 'auth'}" tag="button" class="button auth-secondary-button auth-secondary-button-size">
            Назад
        </router-link>
    </div>
</template>

<script src="../../../cp_vue/frontend/vue/components/authentication/RestorePassword.vue"></script>