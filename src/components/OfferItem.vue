<template>
    <AccordionPanel :value="value" class="flex flex-col bg-accent-muted rounded-xl">
        <AccordionHeader
            class="bg-accent text-primary rounded-xl cursor-pointer flex flex-wrap justify-between items-center px-4 py-3 hover:bg-secondary-muted transition-all duration-300 ease-in-out"
        >
            <span
                >Offer <strong>#{{ offer.id }}</strong></span
            >
            <StatusBadge :status-id="offer.estatOfertaId" />
        </AccordionHeader>

        <AccordionContent>
            <div class="bg-accent-muted text-secondary rounded-b-lg p-5">
                <div class="flex gap-5 justify-center">
                    <InputInfo label="Customer" :value="offer.clientName" />
                    <InputInfo label="Incoterm" :value="offer.incotermCode" />
                    <InputInfo label="Cargo type" :value="offer.cargoTypeLabel" />
                    <InputInfo label="Shipping Line" :value="offer.shippingLineName" />
                </div>

                <div class="flex items-center justify-center gap-5">
                    <p class="text-2xl">{{ offer.originLabel }}</p>
                    <Boat size="100" />
                    <i class="pi pi-arrow-right text-3xl" aria-hidden="true"></i>
                    <p class="text-2xl">{{ offer.destinationLabel }}</p>
                </div>

                <Button
                    icon="pi pi-arrow-right"
                    class="bg-danger w-10 h-10 rounded-lg flex items-center justify-center text-primary ml-auto cursor-pointer"
                    aria-label="View offer details"
                    @click="$emit('view', offer.id)"
                />
            </div>
        </AccordionContent>
    </AccordionPanel>
</template>

<script setup>
import AccordionPanel from "primevue/accordionpanel"
import AccordionHeader from "primevue/accordionheader"
import AccordionContent from "primevue/accordioncontent"
import StatusBadge from "./StatusBadge.vue"
import InputInfo from "./InputInfo.vue"
import Boat from "./Boat.vue"

defineProps({
    offer: {
        type: Object,
        required: true,
    },
    value: {
        type: [Number, String],
        required: true,
    },
})

defineEmits(["view"])
</script>
