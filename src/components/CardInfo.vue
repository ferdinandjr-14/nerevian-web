<template>
    <Card class="bg-secondary rounded-lg px-2 pb-2">
        <template #content>
            <p class="text-primary uppercase text-center pt-3 pb-2">{{ label }}</p>
            <p class="text-primary text-center text-4xl bg-secondary-muted py-6 rounded-b-lg">
                {{ value }}
            </p>
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

<style scoped></style>
