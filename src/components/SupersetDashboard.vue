<template>
    <section class="flex h-full flex-col gap-4">
        <header class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
                Embedded Analytics
            </p>
            <h1 class="text-2xl font-semibold text-dark">{{ title }}</h1>
            <p class="text-sm text-secondary">{{ subtitle }}</p>
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
            class="min-h-[78vh] overflow-hidden rounded-3xl border border-secondary-muted bg-secondary shadow-sm"
        />
    </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { mountSupersetDashboard } from "@/services/SupersetDashboard"

const props = defineProps({
    dashboardId: {
        type: String,
        default: "",
    },
    title: {
        type: String,
        default: "Operational Dashboard",
    },
    subtitle: {
        type: String,
        default: "Live metrics served from Apache Superset.",
    },
})

const containerRef = ref(null)
const isLoading = ref(true)
const errorMessage = ref("")

let embeddedDashboard = null

const resetDashboard = () => {
    embeddedDashboard?.unmount?.()
    embeddedDashboard = null

    if (containerRef.value) {
        containerRef.value.innerHTML = ""
    }
}

const loadDashboard = async () => {
    if (!containerRef.value) {
        return
    }

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
                filters: {
                    visible: true,
                    expanded: true,
                },
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
    async (nextDashboardId, previousDashboardId) => {
        if (!containerRef.value || nextDashboardId === previousDashboardId) {
            return
        }

        await loadDashboard()
    },
)

onMounted(loadDashboard)
onBeforeUnmount(resetDashboard)
</script>
