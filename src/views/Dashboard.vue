<template>
    <section class="dashboard-page">
        <div class="stats-grid">
            <CardInfo
                v-for="card in statsCards"
                :key="card.label"
                :label="card.label"
                :value="card.value"
            />
        </div>

        <div class="content-grid">
            <Card class="panel table-panel">
                <template #content>
                    <DataTable
                        v-model:filters="tableFilters"
                        :value="shipments"
                        :globalFilterFields="['id', 'carrier', 'route', 'statusLabel', 'eta']"
                        class="shipments-table"
                        dataKey="id"
                        paginator
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20]"
                        scrollable
                        scrollHeight="24rem"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first}-{last} of {totalRecords} results"
                    >
                        <template #header>
                            <div class="table-header">
                                <IconField>
                                    <InputIcon class="pi pi-search" />
                                    <InputText
                                        v-model="tableFilters.global.value"
                                        placeholder="Search offers"
                                    />
                                </IconField>
                            </div>
                        </template>

                        <Column header="ID" sortable>
                            <template #body="{ data }">
                                <div class="shipment-cell">
                                    <p class="shipment-id">{{ data.id }}</p>
                                    <p class="shipment-meta">{{ data.carrier }}</p>
                                </div>
                            </template>
                        </Column>
                        <Column field="route" header="Route" sortable />
                        <Column field="statusLabel" header="Current Status" sortable>
                            <template #body="{ data }">
                                <StatusBadge :status-id="data.statusId" />
                            </template>
                        </Column>
                        <Column field="eta" header="ETA" sortable />
                        <Column header="Action">
                            <template #body="{ data }">
                                <Button
                                    label="View details"
                                    text
                                    class="details-btn"
                                    @click="goToOfferDetails(data.offerId)"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </div>
    </section>
</template>

<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { FilterMatchMode } from "@primevue/core/api"
import CardInfo from "../components/CardInfo.vue"
import StatusBadge from "../components/StatusBadge.vue"
import { offers, OFFER_STATUS_IDS } from "../data/offers"

const router = useRouter()

const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const ACTIVE_STATUS_IDS = [
    OFFER_STATUS_IDS.ACCEPTED,
    OFFER_STATUS_IDS.SHIPPED,
    OFFER_STATUS_IDS.DELAYED,
    OFFER_STATUS_IDS.IN_TRANSIT,
    OFFER_STATUS_IDS.OUT_FOR_DELIVERY,
]

const countByStatus = (statusId) => offers.filter((offer) => offer.estatOfertaId === statusId).length

const statsCards = computed(() => {
    const totalOffers = offers.length
    const pendingOffers = countByStatus(OFFER_STATUS_IDS.PENDING)
    const activeOffers = offers.filter((offer) => ACTIVE_STATUS_IDS.includes(offer.estatOfertaId)).length
    const rejectedOffers = countByStatus(OFFER_STATUS_IDS.REJECTED)
    const finalizedOffers = countByStatus(OFFER_STATUS_IDS.FINALIZED)

    return [
        { label: "Total Offers", value: totalOffers.toLocaleString("en-US") },
        { label: "Pending Offers", value: pendingOffers.toLocaleString("en-US") },
        { label: "Active Offers", value: activeOffers.toLocaleString("en-US") },
        { label: "Rejected Offers", value: rejectedOffers.toLocaleString("en-US") },
        { label: "Finalized Offers", value: finalizedOffers.toLocaleString("en-US") },
    ]
})

const shipments = computed(() =>
    offers.map((offer) => ({
        id: `#OFF-${offer.id}`,
        offerId: offer.id,
        carrier: `Carrier: ${offer.shippingLineName || offer.inlandCarrierName || "-"}`,
        route: `${offer.originLabel} -> ${offer.destinationLabel}`,
        statusId: offer.estatOfertaId,
        statusLabel: offer.statusLabel,
        eta: offer.eta || "-",
    })),
)

const goToOfferDetails = (offerId) => {
    router.push({ name: "create-offer", query: { offerId: String(offerId) } })
}
</script>

<style scoped>
.dashboard-page {
    min-height: 100vh;
    padding: 2rem;
    background: #e8e8dd;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(150px, 1fr));
    gap: 0.65rem;
    margin-bottom: 0.65rem;
}

.content-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.65rem;
}

.panel {
    border-radius: 8px;
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: flex-end;
}

.shipment-cell {
    min-width: 180px;
}

.shipment-id {
    margin: 0;
    color: #3dd0da;
    font-weight: 600;
}

.shipment-meta {
    margin: 2px 0 0;
    color: #7ca6ab;
}

:deep(.panel.p-card) {
    background: #073d45;
    border: 1px solid #0f5660;
    border-radius: 8px;
}

:deep(.panel .p-card-body) {
    padding: 0.6rem;
}

:deep(.table-panel .p-card-body) {
    padding: 0.85rem 1rem;
}

:deep(.shipments-table .p-datatable-table) {
    min-width: 700px;
}

:deep(.shipments-table .p-datatable-table-container) {
    min-height: 24rem;
}

:deep(.shipments-table .p-datatable-header) {
    background: transparent;
    border: none;
    padding: 0 0 0.85rem;
}

:deep(.shipments-table .p-inputtext) {
    min-width: 220px;
}

:deep(.shipments-table .p-datatable-thead > tr > th) {
    background: transparent;
    color: #9ec0c5;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 700;
    border: none;
    padding: 0 0 0.85rem;
}

:deep(.shipments-table .p-datatable-tbody > tr) {
    background: transparent;
}

:deep(.shipments-table .p-datatable-tbody > tr > td) {
    border-top: 1px solid rgba(123, 187, 198, 0.1);
    border-bottom: none;
    color: #d8ecee;
    padding: 0.85rem 0;
}

:deep(.shipments-table .p-paginator) {
    background: #0a525c;
    border: none;
    color: #8fb8bd;
    padding: 0.7rem 0;
}

:deep(.shipments-table .p-paginator-page.p-paginator-page-selected) {
    background: #1f9da8;
    color: #fff;
}

:deep(.details-btn.p-button) {
    padding: 0;
    border: none;
    color: #3dd0da;
    text-transform: uppercase;
    background: transparent;
}

:deep(.details-btn.p-button:hover) {
    background: transparent;
    color: #3dd0da;
}

@media (max-width: 1100px) {
    .stats-grid {
        grid-template-columns: repeat(3, minmax(140px, 1fr));
    }
}

@media (max-width: 760px) {
    .dashboard-page {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: repeat(2, minmax(130px, 1fr));
    }
}
</style>
