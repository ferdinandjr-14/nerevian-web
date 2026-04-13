<template>
    <i
        class="pi pi-bars z-100 cursor-pointer text-primary absolute top-8 left-8"
        @click="toggleSidebar"
    ></i>

    <div
        class="absolute top-0 left-0 right-0 h-20 bg-secondary flex items-center justify-center z-80"
    >
        <img src="../assets/nerevian-sidebar-logo.png" alt="logo" class="h-15" />
    </div>

    <transition name="fade">
        <div v-if="isOpen" class="absolute inset-0 bg-black/70 z-90" @click="toggleSidebar"></div>
    </transition>

    <transition name="slide">
        <div
            v-if="isOpen"
            class="w-64 bg-secondary text-white p-8 absolute top-0 bottom-0 left-0 z-98"
        >
            <nav class="flex flex-col items-end gap-3 h-full">
                <RouterLink
                    @click="toggleSidebar"
                    to="/dashboard"
                    :class="route.name === 'dashboard' ? 'active-link' : ''"
                    >Dashboard</RouterLink
                >
                <RouterLink
                    @click="toggleSidebar"
                    to="/offers"
                    :class="route.name === 'offers' ? 'active-link' : ''"
                    >Offers</RouterLink
                >
                <RouterLink
                    @click="toggleSidebar"
                    to="/tracking"
                    :class="route.name === 'tracking' ? 'active-link' : ''"
                    >Tracking</RouterLink
                >
                <RouterLink
                    to="/user-panel"
                    :class="route.name === 'user-panel' ? 'active-link' : ''"
                    >User Panel</RouterLink
                >

                <button
                    class="cursor-pointer text-red-500 flex items-center gap-2 mt-auto group"
                    type="button"
                    @click="handleLogout"
                >
                    Sign out
                    <i
                        class="pi pi-sign-out group-hover:translate-x-1.5 transition-all duration-300 ease-in-out"
                    ></i>
                </button>
            </nav>
        </div>
    </transition>
</template>

<script setup>
import { ref } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import { logout } from "@/services/auth"

const route = useRoute()
const router = useRouter()

const isOpen = ref(false)

const toggleSidebar = () => {
    isOpen.value = !isOpen.value
}

const handleLogout = async () => {
    await logout()
    isOpen.value = false
    router.push({ name: "login" })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.active-link {
    background: linear-gradient(to right, rgba(0, 0, 0, 0) 1%, #118c8c 100%);
}

a {
    min-width: 150px;
    text-align: right;
    text-decoration: none;
    color: white;
    padding: 10px 12px;
    border-radius: 0 8px 8px 0;
    display: inline-block;

    background: linear-gradient(to right, rgba(0, 0, 0, 0) 50%, #118c8c 100%);
    background-size: 200% 100%;
    background-position: left bottom;

    transition: all 0.3s ease-in-out;
}

a:hover {
    background-position: right bottom;
    color: #ffffff;
}
</style>
