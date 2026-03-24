<template>
    <section class="login-page">
        <div class="login-card">
            <div class="brand">
                <img class="brand-logo" src="/images/logo.png" alt="Nerevian" />
            </div>

            <form class="login-form" @submit.prevent>
                <label class="field-label" for="email">Email address</label>
                <div class="input-wrap">
                    <span class="input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                            <path d="M3 5h18v14H3z" fill="none" stroke="currentColor" stroke-width="1.8" />
                            <path d="M3 7l9 7 9-7" fill="none" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </span>
                    <input id="email" v-model="credentials.email" type="email" placeholder="example@nerevian.com" />
                </div>

                <label class="field-label" for="password">Password</label>
                <div class="input-wrap">
                    <span class="input-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                            <rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
                            <path d="M8 11V8a4 4 0 118 0v3" fill="none" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </span>
                    <input
                        id="password"
                        v-model="credentials.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="................"
                    />
                    <button
                        type="button"
                        class="password-toggle"
                        :aria-label="showPassword ? 'Hide password' : 'Show password'"
                        :aria-pressed="showPassword"
                        @click="showPassword = !showPassword"
                    >
                        <svg v-if="showPassword" viewBox="0 0 24 24" focusable="false">
                            <path
                                d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                            />
                            <circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" focusable="false">
                            <path
                                d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.8"
                            />
                            <circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" stroke-width="1.8" />
                            <path d="M4 20L20 4" fill="none" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </button>
                </div>

                <button class="login-btn" type="submit">LOGIN</button>
            </form>
        </div>
    </section>
</template>

<script setup>
import { reactive, ref } from 'vue'

const showPassword = ref(false)

const credentials = reactive({
    email: 'example@nerevian.com',
    password: '...............'
})
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background-image: linear-gradient(rgba(10, 58, 64, 0.53), rgba(10, 58, 64, 0.53)), url('/images/loginFoto.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: grid;
    place-items: center;
    padding: 2rem;
}

.login-card {
    width: min(560px, 100%);
    background: #f6f3e7;
    border-radius: 6px;
    padding: 2.45rem 3.25rem 3.05rem;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
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
    font-size: 1.03rem;
    margin: 0 0 0.45rem;
}

.field-label + .input-wrap {
    margin-bottom: 0.95rem;
}

.input-wrap {
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

.input-icon svg,
.password-toggle svg {
    width: 19px;
    height: 19px;
}

.input-wrap input {
    border: none;
    outline: none;
    flex: 1;
    min-width: 0;
    background: transparent;
    color: #222;
    font-size: 1.03rem;
}

.input-wrap input::placeholder {
    color: #373737;
    opacity: 1;
}

.password-toggle {
    border: none;
    background: transparent;
    color: #2b2b2b;
    width: 38px;
    display: grid;
    place-items: center;
    cursor: pointer;
    padding: 0;
}

.login-btn {
    margin-top: 1rem;
    width: 100%;
    height: 50px;
    border: none;
    border-radius: 8px;
    background: #ff666d;
    color: #fff;
    font-size: 1.65rem;
    letter-spacing: 1px;
    cursor: pointer;
}

.login-btn:hover {
    background: #ff5b64;
}

@media (max-width: 640px) {
    .login-page {
        padding: 1rem;
    }

    .login-card {
        padding: 1.6rem 1.2rem 1.8rem;
    }

    .brand {
        margin-bottom: 1.3rem;
    }

    .brand-logo {
        width: min(220px, 86%);
    }

    .field-label {
        font-size: 0.95rem;
    }

    .input-wrap input {
        font-size: 0.95rem;
    }

    .login-btn {
        font-size: 1.2rem;
        height: 46px;
    }
}
</style>