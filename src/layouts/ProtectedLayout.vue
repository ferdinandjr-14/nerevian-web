<template>
    <div v-if="isCheckingAuth" class="flex min-h-screen items-center justify-center bg-primary text-secondary">
        Checking session...
    </div>
    <div v-else class="flex h-screen">
        <Sidebar />

        <main
            class="flex-1 overflow-y-auto p-4 pt-20 bg-primary mt-5"
            style="scrollbar-width: thin; scrollbar-gutter: stable"
        >
            <RouterView />
        </main>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import { RouterView, useRoute, useRouter } from "vue-router"
import { isAuthenticated, restoreSession } from "@/services/auth"
import Sidebar from "@/components/Sidebar.vue"

const router = useRouter()
const route = useRoute()
const isCheckingAuth = ref(true)

const redirectToLogin = async () => {
    if (route.name === "login") return

    await router.replace({
        name: "login",
        query: { redirect: route.fullPath },
    })
}

onMounted(async () => {
    try {
        if (!isAuthenticated()) {
            await restoreSession()
        }
    } catch {
        await redirectToLogin()
    } finally {
        isCheckingAuth.value = false
    }

    if (!isAuthenticated()) {
        await redirectToLogin()
    }
})

watch(
    () => isAuthenticated(),
    async (authenticated) => {
        if (!authenticated && !isCheckingAuth.value) {
            await redirectToLogin()
        }
    },
)
</script>
