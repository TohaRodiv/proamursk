<template>
    <div class="auth-page">
        <div class="auth-wrapper">
            <div class="auth-image"></div>
            <div class="auth-forms">
                <div class="auth-forms-inner">
                    <div class="auth-container">
                        <div class="auth_logo">
                            <img src="../../src/images/logo_crown.svg">
                        </div>
                        <div class="auth-component">
                            <changePassword
                                v-if="route === 'change-password'"
                            ></changePassword>
                            <restorePassword
                                v-if="route === 'restore-password'"
                            ></restorePassword>
                            <signin
                                v-if="route === 'auth'"
                            ></signin>
                        </div>
                    </div>
                    <div class="auth-footer">
                        <span>©&nbsp;</span>
                        <a href="http://perfectura.ru/" target="_blank" class="link">Перфектура</a>
                        <span>, 2019</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import changePassword from './ChangePassword.vue'
    import restorePassword from './RestorePassword.vue'
    import signin from './Signin.vue'

    export default {
        name: 'auth-base',
        components: {
            changePassword,
            restorePassword,
            signin
        },
        computed: {
            route: function () {
                return this.$route.name
            }
        }
    }

</script>