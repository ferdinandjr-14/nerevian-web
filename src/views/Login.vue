<template>
    <section class="login-page">
        <Card class="login-card">
            <template #content>
                <div class="brand">
                    <img class="brand-logo" src="/images/logo.png" alt="Nerevian" />
                </div>

                <form class="login-form" @submit.prevent>
                    <label class="field-label" for="email">Email address</label>
                    <IconField class="input-wrap">
                        <InputIcon class="pi pi-envelope input-icon" />
                        <InputText
                            id="email"
                            v-model="credentials.email"
                            type="email"
                            placeholder="example@nerevian.com"
                            class="text-field"
                        />
                    </IconField>

                    <label class="field-label" for="password">Password</label>
                    <div class="password-wrap">
                        <i class="pi pi-lock input-icon" aria-hidden="true"></i>
                        <Password
                            id="password"
                            v-model="credentials.password"
                            :feedback="false"
                            toggleMask
                            inputClass="text-field password-field"
                            class="password-field-wrap"
                        />
                    </div>

                    <Button label="LOGIN" type="submit" class="login-btn" />
                </form>
            </template>
        </Card>
    </section>
</template>

<script setup>
import { reactive } from "vue"

const credentials = reactive({
    email: "example@nerevian.com",
    password: "...............",
})
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background-image:
        linear-gradient(rgba(10, 58, 64, 0.53), rgba(10, 58, 64, 0.53)),
        url("/images/loginFoto.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: grid;
    place-items: center;
    padding: 2rem;
}

.login-card {
    width: min(560px, 100%);
}

.brand {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.1rem;
}

.brand-logo {
    width: min(260px, 80%);
    height: auto;
    display: block;
}

.login-form {
    max-width: 356px;
    margin: 0 auto;
}

.field-label {
    display: block;
    color: #181818;
    margin: 0 0 0.45rem;
}

.field-label + .input-wrap,
.field-label + .password-wrap {
    margin-bottom: 0.95rem;
}

.input-wrap,
.password-wrap {
    height: 48px;
    border: 1px solid #75726f;
    border-radius: 7px;
    background: transparent;
    display: flex;
    align-items: center;
}

.input-icon {
    width: 38px;
    color: #2b2b2b;
    display: grid;
    place-items: center;
}

.text-field {
    width: 100%;
    border: none;
    background: transparent;
    color: #222;
    padding-inline: 0;
}

.text-field::placeholder {
    color: #373737;
    opacity: 1;
}

.password-wrap {
    padding-right: 0.2rem;
}

.password-field-wrap {
    width: 100%;
}

.login-btn {
    margin-top: 1rem;
    width: 100%;
    height: 50px;
}

:deep(.login-card.p-card) {
    background: #f6f3e7;
    border-radius: 6px;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
}

:deep(.login-card .p-card-body) {
    padding: 2.45rem 3.25rem 3.05rem;
}

:deep(.input-wrap .p-inputicon) {
    position: static;
    width: 38px;
    min-width: 38px;
    margin-top: 0;
    margin-left: 0;
}

:deep(.input-wrap .p-inputtext) {
    flex: 1;
    min-width: 0;
    box-shadow: none;
}

:deep(.password-field-wrap .p-password-input) {
    box-shadow: none;
}

:deep(.password-field-wrap .p-iconfield) {
    padding-left: 0;
}

:deep(.password-field-wrap .p-password-toggle-mask-icon) {
    color: #2b2b2b;
}

:deep(.login-btn.p-button) {
    border: none;
    border-radius: 8px;
    background: #ff666d;
    color: #fff;
    letter-spacing: 1px;
}

:deep(.login-btn.p-button:hover) {
    background: #ff5b64;
}

@media (max-width: 640px) {
    .login-page {
        padding: 1rem;
    }

    .brand {
        margin-bottom: 1.3rem;
    }

    .brand-logo {
        width: min(220px, 86%);
    }

    :deep(.login-card .p-card-body) {
        padding: 1.6rem 1.2rem 1.8rem;
    }

    :deep(.login-btn.p-button) {
        height: 46px;
    }
}
</style>
