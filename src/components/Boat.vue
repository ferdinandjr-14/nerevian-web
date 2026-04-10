<template>
    <img :src="boatIcon" :alt="alt" :width="size" :height="size" class="boat-icon" />
</template>

<script setup>
import boatIcon from "../assets/boat.svg"

defineProps({
    size: {
        type: [Number, String],
        default: 32,
    },
    alt: {
        type: String,
        default: "Boat",
    },
})
</script>

<style scoped>
.boat-icon {
    display: inline-block;
    vertical-align: middle;
}
</style>
