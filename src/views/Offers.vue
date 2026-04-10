<template>
    <section class="offers-page">
        <header class="flex justify-between">
            <Button
                label="CREATE OFFER +"
                class="bg-danger p-2 px-4 rounded-lg text-primary"
                @click="goToCreateOffer"
            />

            <div class="flex items-center">
                <IconField class="search-wrap">
                    <InputIcon class="pi pi-search" />
                    <InputText
                        v-model="searchTerm"
                        class="search-input"
                        type="text"
                        placeholder="SEARCH BY ID"
                        aria-label="Search offers by id"
                    />
                </IconField>

                <Select
                    v-model="selectedStatus"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    class="filter-select"
                    aria-label="Filter offers"
                />
            </div>
        </header>

        <div class="offers-list">
            <Accordion
                v-if="filteredOffers.length"
                v-model:value="expandedOfferId"
                :multiple="false"
                collapsible
            >
                <AccordionPanel
                    v-for="offer in filteredOffers"
                    :key="offer.id"
                    :value="offer.id"
                    class="bg-accent mt-5 rounded-xl text-primary flex flex-col"
                >
                    <AccordionHeader class="flex flex-wrap justify-between items-center px-4 py-2">
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

                            <div class="offer-route-row">
                                <p class="route-city">{{ offer.originLabel }}</p>
                                <span class="route-divider" aria-hidden="true"></span>
                                <i class="pi pi-ship route-icon" aria-hidden="true"></i>
                                <i class="pi pi-arrow-right route-arrow" aria-hidden="true"></i>
                                <p class="route-city">{{ offer.destinationLabel }}</p>

                                <Button
                                    icon="pi pi-arrow-right"
                                    class="detail-link-btn"
                                    aria-label="View offer details"
                                    @click="goToOfferDetails(offer.id)"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>

            <p v-else class="empty-state">No offers found for this search.</p>
        </div>
    </section>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"
import StatusBadge from "../components/StatusBadge.vue"
import InputInfo from "../components/InputInfo.vue"
import { offers, OFFER_STATUSES } from "../data/offers"

const router = useRouter()

const statusOptions = [
    { label: "ALL STATUSES", value: "all" },
    ...OFFER_STATUSES.map((status) => ({
        label: status.label.toUpperCase(),
        value: status.id,
    })),
]

const searchTerm = ref("")
const selectedStatus = ref("all")
const expandedOfferId = ref(offers[0]?.id || null)

const filteredOffers = computed(() => {
    const query = searchTerm.value.trim().toLowerCase()

    return offers.filter((offer) => {
        if (selectedStatus.value !== "all" && offer.estatOfertaId !== selectedStatus.value)
            return false
        if (!query) return true
        return String(offer.id).toLowerCase().includes(query)
    })
})

watch(
    filteredOffers,
    (nextOffers) => {
        if (!nextOffers.length) {
            expandedOfferId.value = null
            return
        }

        const exists = nextOffers.some((offer) => offer.id === expandedOfferId.value)
        if (!exists) expandedOfferId.value = nextOffers[0].id
    },
    { immediate: true },
)

const goToCreateOffer = () => {
    router.push({ name: "create-offer" })
}

const goToOfferDetails = (offerId) => {
    router.push({ name: "create-offer", query: { offerId: String(offerId) } })
}
</script>
<style scoped></style>
