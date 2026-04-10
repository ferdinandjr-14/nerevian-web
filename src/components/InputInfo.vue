<template>
    <span class="flex items-center">
        <p class="mr-2">{{ label }}:</p>
        <em :class="valueClass">{{ value }}</em>
    </span>
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

const valueClass = "bg-primary py-1 px-2 rounded-lg"
</script>

<style scoped></style>
