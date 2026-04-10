<template>
    <Accordion
        v-if="offers.length"
        v-model:value="expandedOfferId"
        :multiple="false"
        collapsible
        class="flex flex-col gap-5"
    >
        <OfferItem
            v-for="offer in offers"
            :key="offer.id"
            :offer="offer"
            :value="offer.id"
            @view="$emit('view', $event)"
        />
    </Accordion>

    <p v-else class="empty-state">No offers found for this search.</p>
</template>

<script setup>
import { ref, watch } from "vue"
import Accordion from "primevue/accordion"
import AccordionPanel from "primevue/accordionpanel"
import AccordionHeader from "primevue/accordionheader"
import AccordionContent from "primevue/accordioncontent"
import OfferItem from "./OfferItem.vue"
import StatusBadge from "./StatusBadge.vue"

const props = defineProps({
    offers: {
        type: Array,
        required: true,
    },
})

defineEmits(["view"])

const expandedOfferId = ref(null)

watch(
    () => props.offers,
    (nextOffers) => {
        if (!nextOffers.length) {
            expandedOfferId.value = null
            return
        }

        const exists = nextOffers.some((offer) => offer.id === expandedOfferId.value)
    },
    { immediate: true },
)
</script>
