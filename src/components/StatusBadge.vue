<template>
    <span :class="badgeClass">{{ label }}</span>
</template>

<script setup>
import { computed } from "vue"
import { getOfferStatus } from "../data/offers"

const props = defineProps({
    statusId: {
        type: [Number, String],
        required: true,
    },
})

const label = computed(() => {
    const status = getOfferStatus(props.statusId)
    return status?.label ?? "Unknown"
})

const badgeClass = computed(() => {
    switch (props.statusId) {
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
