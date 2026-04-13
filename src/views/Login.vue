<template>
    <section class="login-page w-screen h-screen bg-cover bg-center relative">
        <div class="absolute inset-0 bg-secondary/50"></div>

        <div class="relative z-10 flex items-center justify-center w-full h-full">
            <form
                class="bg-primary/95 backdrop-blur-md flex flex-col w-full max-w-xl p-8 rounded-2xl shadow-xl gap-2"
                @submit.prevent="handleLogin"
            >
                <img class="brand-logo mx-auto mb-4 w-70" src="/images/logo.png" alt="Nerevian" />

                <label for="correu">Email address</label>
                <IconField class="flex items-center gap-2 border rounded-lg p-2">
                    <InputIcon class="pi pi-envelope" />
                    <InputText
                        id="correu"
                        v-model="credentials.correu"
                        type="email"
                        placeholder="example@nerevian.com"
                        class="w-full border-0 outline-0"
                        autocomplete="username"
                    />
                </IconField>

                <label for="contrasenya" class="mt-5">Password</label>
                <div class="flex items-center gap-2 border rounded-lg p-2">
                    <i class="pi pi-lock"></i>
                    <Password
                        id="contrasenya"
                        v-model="credentials.contrasenya"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full border-0 outline-0 ring-0"
                        class="w-full flex items-center"
                    />
                </div>

                <p v-if="errorMessage" class="mt-3 text-sm text-red-600">{{ errorMessage }}</p>

                <Button
                    label="LOGIN"
                    type="submit"
                    class="mt-4 w-full bg-danger rounded-lg py-2 text-primary cursor-pointer flex items-center gap-3 justify-center"
                    :loading="isSubmitting"
                />
            </form>
        </div>
    </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue"
import { AxiosError } from "axios"
import { useRoute, useRouter } from "vue-router"
import { isAuthenticated, login } from "@/services/auth"

const router = useRouter()
const route = useRoute()
const isSubmitting = ref(false)
const errorMessage = ref("")

const credentials = reactive({
    correu: "",
    contrasenya: "",
})

const resolveRedirectTarget = () => {
    const redirect = typeof route.query.redirect === "string" ? route.query.redirect : ""
    return redirect || { name: "dashboard" }
}

const handleLogin = async () => {
    errorMessage.value = ""
    isSubmitting.value = true

    try {
        await login(credentials)
        await router.replace(resolveRedirectTarget())
    } catch (error) {
        if (error instanceof AxiosError) {
            errorMessage.value =
                error.response?.data?.errors?.correu?.[0] ||
                error.response?.data?.message ||
                "Login failed."
        } else {
            errorMessage.value = "Login failed."
        }
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    if (isAuthenticated()) {
        router.replace(resolveRedirectTarget())
    }
})
</script>
<style>
.login-page {
    background-image: url("/images/loginFoto.png");
}
</style>
