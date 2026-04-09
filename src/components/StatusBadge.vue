<template>
    <span :class="badgeClasses">{{ resolvedStatus.label }}</span>
</template>

<script setup>
import { computed } from "vue"
import { getOfferStatus, getOfferStatusByLabel } from "../data/offers"

const props = defineProps({
    statusId: {
        type: [Number, String],
        default: null,
    },
    status: {
        type: String,
        default: "",
    },
})

const resolvedStatus = computed(() => {
    if (props.statusId !== null && props.statusId !== undefined && props.statusId !== "") {
        return getOfferStatus(props.statusId)
    }

    if (props.status) {
        return getOfferStatusByLabel(props.status)
    }

    return getOfferStatus(null)
})

const badgeClasses = computed(() => ["status-badge", `status-badge--${resolvedStatus.value.key}`])
</script>
