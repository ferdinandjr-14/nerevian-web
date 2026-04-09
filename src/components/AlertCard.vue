<template>
    <Card class="alert-card">
        <template #content>
            <p class="alert-title">{{ title }}</p>
            <p class="alert-text">{{ message }}</p>
        </template>
    </Card>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
})
</script>

<style scoped>
.alert-title {
    margin: 0 0 0.2rem;
    color: #ffd1d1;
    font-weight: 700;
}

.alert-text {
    margin: 0;
    color: #8fb1b6;
    line-height: 1.35;
}

:deep(.alert-card.p-card) {
    border-left: 2px solid #ff3d49;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0 6px 6px 0;
    border-top: none;
    border-right: none;
    border-bottom: none;
}

:deep(.alert-card .p-card-body) {
    padding: 0.6rem;
}
</style>
