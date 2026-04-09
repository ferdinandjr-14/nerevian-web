<template>
    <section class="offers-page">
        <header class="offers-toolbar">
            <Button label="CREATE OFFER +" class="create-offer-btn" @click="goToCreateOffer" />

            <div class="toolbar-right">
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
                class="offers-accordion"
            >
                <AccordionPanel
                    v-for="offer in filteredOffers"
                    :key="offer.id"
                    :value="offer.id"
                    class="offer-item"
                >
                    <AccordionHeader class="offer-row">
                        <span class="offer-title">Offer <strong>#{{ offer.id }}</strong></span>
                        <StatusBadge :status-id="offer.estatOfertaId" />
                    </AccordionHeader>

                    <AccordionContent>
                        <div class="offer-panel">
                            <div class="offer-meta-row">
                                <p><span>Customer:</span> <em>{{ offer.clientName }}</em></p>
                                <p><span>Incoterm:</span> <em>{{ offer.incotermCode }}</em></p>
                                <p><span>Cargo type:</span> <em>{{ offer.cargoTypeLabel }}</em></p>
                                <p><span>Shipping Line:</span> <em>{{ offer.shippingLineName }}</em></p>
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
        if (selectedStatus.value !== "all" && offer.estatOfertaId !== selectedStatus.value) return false
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

<style scoped>
.offers-page {
    min-height: 100vh;
    padding: 1.6rem;
    background: #e8e8dd;
}

.offers-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.8rem;
    margin-bottom: 0.75rem;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.65rem;
}

.offers-list {
    display: flex;
    flex-direction: column;
    gap: 0.56rem;
}

.offer-title {
    line-height: 1;
}

.offer-title strong {
    color: #8de4e8;
    font-weight: 700;
}

.offer-panel {
    background: #abd2c7;
    padding: 0.68rem 0.9rem 0.95rem;
    border-radius: 0 0 10px 10px;
}

.offer-meta-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(130px, 1fr));
    gap: 0.55rem;
    margin-bottom: 0.85rem;
}

.offer-meta-row p {
    margin: 0;
    color: #1a4248;
    white-space: nowrap;
}

.offer-meta-row span {
    color: #274b51;
    font-weight: 500;
    margin-right: 0.2rem;
}

.offer-meta-row em {
    font-style: normal;
    background: #f3f0e8;
    border-radius: 4px;
    padding: 0.15rem 0.4rem;
    color: #223d42;
}

.offer-route-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto 1fr auto;
    align-items: center;
    gap: 0.6rem;
}

.route-city {
    margin: 0;
    color: #184a52;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1;
    text-align: center;
}

.route-divider {
    width: 58px;
    height: 1px;
    background: #417278;
}

.route-icon {
    color: #1b9399;
    line-height: 1;
}

.route-arrow {
    color: #2b6368;
    line-height: 1;
}

.empty-state {
    margin-top: 1.1rem;
    color: #1a474e;
}

:deep(.create-offer-btn.p-button) {
    border: none;
    border-radius: 6px;
    background: #ff6666;
    color: #fff;
    letter-spacing: 0.45px;
    padding: 0.55rem 0.95rem;
}

:deep(.search-wrap .p-inputicon) {
    color: #2d5860;
}

:deep(.search-input.p-inputtext) {
    width: 202px;
    border: 1px solid #78979d;
    border-radius: 4px;
    height: 34px;
    padding-left: 2.1rem;
    background: transparent;
    color: #0f353b;
    text-transform: uppercase;
}

:deep(.search-input.p-inputtext::placeholder) {
    color: #2d5860;
}

:deep(.filter-select.p-select) {
    height: 34px;
    min-width: 155px;
    border: none;
    border-radius: 4px;
    background: #1f9da8;
    color: #fff;
    letter-spacing: 0.45px;
}

:deep(.filter-select .p-select-label) {
    color: #fff;
}

:deep(.filter-select .p-select-dropdown) {
    color: #fff;
}

:deep(.offers-accordion.p-accordion) {
    display: flex;
    flex-direction: column;
    gap: 0.56rem;
}

:deep(.offer-item.p-accordionpanel) {
    border: none;
    border-radius: 10px;
    overflow: hidden;
}

:deep(.offer-row.p-accordionheader) {
    background: #118c8c;
    color: #ebf7f8;
}

:deep(.offer-row .p-accordionheader-toggle-icon) {
    color: #d9f3f5;
}

:deep(.offer-row .p-accordionheader-content) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    min-height: 44px;
    padding: 0.4rem 0.9rem;
}

:deep(.offer-item .p-accordioncontent-content) {
    padding: 0;
    border: none;
}

:deep(.detail-link-btn.p-button) {
    border: none;
    background: #ff6666;
    color: #fff;
    width: 34px;
    height: 30px;
    border-radius: 7px;
    min-width: 34px;
    padding: 0;
}

@media (max-width: 980px) {
    .offers-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .toolbar-right {
        width: 100%;
    }

    :deep(.search-input.p-inputtext),
    :deep(.filter-select.p-select) {
        width: 100%;
    }

    .offer-meta-row {
        grid-template-columns: 1fr 1fr;
    }

    .offer-route-row {
        grid-template-columns: 1fr;
        justify-items: center;
        gap: 0.35rem;
    }

    .route-divider,
    .route-arrow {
        display: none;
    }
}
</style>
