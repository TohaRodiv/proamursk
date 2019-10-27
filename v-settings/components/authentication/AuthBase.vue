<template>
    <div class="auth-page">
        <div class="auth-wrapper">
            <div class="auth-image">
                <div class="auth-image-inner" />
            </div>
            <div class="auth-forms">
                <div class="auth-forms-inner">
                    <div class="auth-container">
                        <a
                            :href="hostname"
                            target="_blank"
                            class="auth_logo"
                        >
                            <img src="../../src/images/logo_crown.svg">
                        </a>

                        <div class="auth-component">
                            <transition
                                name="fade-auth"
                                mode="out-in"
                            >
                                <component v-bind:is="authComponent" />
                            </transition>
                        </div>
                    </div>
                    <div class="auth-footer">
                        <span>
                            ©&nbsp;
                        </span>
                        <a
                            href="http://perfectura.ru/"
                            target="_blank"
                            class="link"
                        >
                            Перфектура
                        </a>
                        <span>
                            , 2019
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import changePassword from "./ChangePassword.vue";
import restorePassword from "./RestorePassword.vue";
import signin from "./Signin.vue";

export default {
    name: "AuthBase",
    components: {
        changePassword,
        restorePassword,
        signin,
    },

    computed: {
        route: function() {
            return this.$route.name;
        },

        hostname(){
            return  window.location.protocol + '//' + window.location.hostname;
        },

        authComponent: function() {
            switch (this.route) {
            case "change-password":
                return "changePassword";
            case "change-password-authorised":
                return "changePassword";
            case "restore-password":
                return "restorePassword";
            case "auth":
                return "signin";
            }
        },
    },
};
</script>