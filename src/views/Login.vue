<template>
    <section class="login-page w-screen h-screen bg-cover bg-center relative">
        <div class="absolute inset-0 bg-secondary/50"></div>

        <div class="relative z-10 flex items-center justify-center w-full h-full">
            <form
                class="bg-primary/95 backdrop-blur-md flex flex-col w-full max-w-md p-8 rounded-2xl shadow-xl gap-2"
                @submit.prevent
            >
                <img class="brand-logo mx-auto mb-4 w-70" src="/images/logo.png" alt="Nerevian" />

                <label for="email">Email address</label>
                <IconField class="flex items-center gap-2 border rounded-lg p-2">
                    <InputIcon class="pi pi-envelope" />
                    <InputText
                        id="email"
                        v-model="credentials.email"
                        type="email"
                        placeholder="example@nerevian.com"
                        class="w-full border-0 outline-0"
                    />
                </IconField>

                <label for="password" class="mt-5">Password</label>
                <div class="flex items-center gap-2 border rounded-lg p-2">
                    <i class="pi pi-lock"></i>
                    <Password
                        id="password"
                        v-model="credentials.password"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full border-0 outline-0 ring-0"
                        class="w-full flex items-center"
                    />
                </div>

                <Button
                    label="LOGIN"
                    type="submit"
                    class="mt-4 w-full bg-danger rounded-lg py-2 text-primary cursor-pointer"
                />
            </form>
        </div>
    </section>
</template>

<script setup>
import { reactive } from "vue"

const credentials = reactive({
    email: "example@nerevian.com",
    password: "",
})
</script>
<style>
.login-page {
    background-image: url("/images/loginFoto.png");
}
</style>
