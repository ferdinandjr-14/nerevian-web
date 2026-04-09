<template>
    <Card class="alerts-panel">
        <template #content>
            <div class="alerts-title-wrap">
                <h3>{{ title }}</h3>
            </div>

            <div class="alerts-list">
                <AlertCard
                    v-for="alert in alerts"
                    :key="alert.id ?? alert.title"
                    :title="alert.title"
                    :message="alert.message"
                />
            </div>
        </template>
    </Card>
</template>

<script setup>
import AlertCard from "./AlertCard.vue"

defineProps({
    alerts: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        default: "Alerts",
    },
})
</script>

<style scoped>
.alerts-panel {
    display: flex;
    flex-direction: column;
}

.alerts-title-wrap {
    display: flex;
    justify-content: center;
    padding: 0.75rem 0.75rem 0.2rem;
}

.alerts-title-wrap h3 {
    margin: 0;
    background: #ff4b4b;
    color: #fff;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 0.35rem 1rem;
}

.alerts-list {
    padding: 0.7rem;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

:deep(.alerts-panel.p-card) {
    background: #073d45;
    border: 1px solid #0f5660;
    border-radius: 8px;
    overflow: hidden;
}

:deep(.alerts-panel .p-card-body) {
    padding: 0.6rem;
}

@media (max-width: 1100px) {
    .alerts-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(180px, 1fr));
        gap: 0.5rem;
    }
}

@media (max-width: 760px) {
    .alerts-list {
        grid-template-columns: 1fr;
    }
}
</style>
