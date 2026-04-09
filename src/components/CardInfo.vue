<template>
    <Card class="card-info">
        <template #content>
            <p class="stat-label">{{ label }}</p>
            <p class="stat-value">{{ value }}</p>
        </template>
    </Card>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    value: {
        type: [String, Number],
        required: true,
    },
})
</script>

<style scoped>
.stat-label {
    text-transform: uppercase;
    margin: 0;
    color: #d4e6e8;
    letter-spacing: 0.4px;
    background: #084953;
    border-radius: 6px;
    padding: 0.6rem 0.4rem;
    font-weight: 600;
}

.stat-value {
    margin: 0.85rem 0 0.55rem;
    text-align: center;
    color: #eef7f7;
}

:deep(.card-info.p-card) {
    background: #073d45;
    border: 1px solid #0f5660;
    border-radius: 8px;
}

:deep(.card-info .p-card-body) {
    padding: 0.6rem;
}
</style>
