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
            <nav class="flex flex-col items-end gap-8 h-full">
                <RouterLink to="/dashboard">Dashboard</RouterLink>
                <RouterLink to="/offers">Offers</RouterLink>
                <RouterLink to="/tracking">Tracking</RouterLink>
                <RouterLink to="/create-offer">Create Offer</RouterLink>
                <RouterLink to="/user-panel">User Panel</RouterLink>

                <button class="cursor-pointer text-red-500 flex items-center gap-2 mt-auto">
                    Sign out <i class="pi pi-sign-out"></i>
                </button>
            </nav>
        </div>
    </transition>
</template>

<script setup>
import { ref } from "vue"
import { RouterLink } from "vue-router"

const isOpen = ref(false)

const toggleSidebar = () => {
    isOpen.value = !isOpen.value
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
</style>
