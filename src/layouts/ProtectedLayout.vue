<template>
    <div class="flex h-screen">
        <Sidebar />

        <main class="flex-1 overflow-y-auto p-4 pt-20 bg-primary">
            <RouterView />
        </main>
    </div>
</template>

<script setup>
import { RouterView } from "vue-router"
import Sidebar from "@/components/Sidebar.vue"
</script>
