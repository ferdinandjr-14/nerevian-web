<template>
    <section class="flex h-full flex-row gap-3">
        <div class="flex flex-col min-w-[75%]">
            <header class="flex flex-col gap-1 p-4 bg-secondary-muted mb-3 rounded-2xl">
                <p class="text-xs font-semibold uppercase tracking-[0.35em] text-accent-muted">
                    Embedded Analytics
                </p>
                <h1 class="text-2xl font-semibold text-primary">{{ title }}</h1>
                <p class="text-sm text-accent-muted">{{ subtitle }}</p>
            </header>

            <div
                v-if="errorMessage"
                class="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-700"
            >
                {{ errorMessage }}
            </div>

            <div
                v-else-if="isLoading"
                class="flex items-center gap-2 rounded-2xl bg-secondary p-4 text-primary"
            >
                <LoadingSpinner />
                <span>Loading Superset dashboard...</span>
            </div>
            <div
                ref="containerRef"
                class="superset-container min-h-[78vh] w-full overflow-hidden rounded-3xl border border-secondary-muted bg-secondary shadow-sm"
            />
        </div>

        <ChatBot />
    </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { mountSupersetDashboard } from "@/services/SupersetDashboard"
import ChatBot from "./ChatBot.vue"

const props = defineProps({
    dashboardId: { type: String, default: "" },
    title: { type: String, default: "Operational Dashboard" },
    subtitle: { type: String, default: "Live metrics served from Apache Superset." },
})

const containerRef = ref(null)
const isLoading = ref(true)
const errorMessage = ref("")

let embeddedDashboard = null

const resetDashboard = () => {
    embeddedDashboard?.unmount?.()
    embeddedDashboard = null
    if (containerRef.value) containerRef.value.innerHTML = ""
}

const loadDashboard = async () => {
    if (!containerRef.value) return

    resetDashboard()
    isLoading.value = true
    errorMessage.value = ""

    try {
        embeddedDashboard = await mountSupersetDashboard({
            dashboardId: props.dashboardId,
            mountPoint: containerRef.value,
            iframeTitle: props.title,
            dashboardUiConfig: {
                hideTitle: true,
                hideChartControls: true,
                filters: { visible: true, expanded: true },
            },
        })
    } catch (error) {
        errorMessage.value =
            error?.response?.data?.message ||
            error?.message ||
            "The Superset dashboard could not be loaded."
    } finally {
        isLoading.value = false
    }
}

watch(
    () => props.dashboardId,
    async (next, prev) => {
        if (!containerRef.value || next === prev) return
        await loadDashboard()
    },
)

onMounted(loadDashboard)
onBeforeUnmount(resetDashboard)
</script>

<style scoped>
.superset-container :deep(iframe) {
    width: 100% !important;
    height: 100% !important;
    min-height: 78vh;
    border: none;
    display: block;
}
</style>
