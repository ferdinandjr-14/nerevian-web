<template>
    <span :class="badgeClass">{{ label }}</span>
</template>

<script setup>
import { computed } from "vue"

const props = defineProps({
    statusId: {
        type: [Number, String],
        required: true,
    },
})

const STATUS_LABELS = Object.freeze({
    1: "Pending",
    2: "Accepted",
    3: "Rejected",
    4: "Shipped",
    5: "Delayed",
    6: "Finalized",
    7: "In Transit",
    8: "Out for Delivery",
})

const normalizedStatusId = computed(() => Number(props.statusId))

const label = computed(() => {
    return STATUS_LABELS[normalizedStatusId.value] ?? "Unknown"
})

const badgeClass = computed(() => {
    switch (normalizedStatusId.value) {
        case 1:
            return "status-badge status-badge--pending"
        case 2:
            return "status-badge status-badge--accepted"
        case 3:
            return "status-badge status-badge--rejected"
        case 4:
            return "status-badge status-badge--shipped"
        case 5:
            return "status-badge status-badge--delayed"
        case 6:
            return "status-badge status-badge--finalized"
        case 7:
            return "status-badge status-badge--in-transit"
        case 8:
            return "status-badge status-badge--out-for-delivery"
        default:
            return "status-badge status-badge--unknown"
    }
})
</script>
