<template>
    <section class="tracking-page">
        <header class="track-search">
            <span class="track-label">TRACK ORDER:</span>
            <form class="track-inline-form" @submit.prevent="handleTrackSearch">
                <InputText
                    v-model="searchOrderId"
                    class="track-input"
                    type="text"
                    placeholder="98274839743464562341234124"
                    aria-label="Order number"
                />
                <Button icon="pi pi-arrow-right" text class="track-submit" type="submit" aria-label="Track order" />
            </form>
        </header>

        <p v-if="searchError" class="search-error">{{ searchError }}</p>

        <Card class="panel table-panel">
            <template #content>
                <DataTable
                    v-model:filters="tableFilters"
                    :value="trackingOrders"
                    :globalFilterFields="['orderId', 'shipmentId', 'carrier', 'route', 'status', 'shipped', 'eta']"
                    class="tracking-table"
                    dataKey="orderId"
                    paginator
                    :rows="7"
                    :rowsPerPageOptions="[7, 14, 21]"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first}-{last} of {totalRecords} results"
                >
                    <template #header>
                        <div class="table-header">
                            <IconField>
                                <InputIcon class="pi pi-search" />
                                <InputText
                                    v-model="tableFilters.global.value"
                                    placeholder="Filter tracking rows"
                                />
                            </IconField>
                        </div>
                    </template>

                    <Column header="Shipment ID" sortable>
                        <template #body="{ data }">
                            <div class="shipment-cell">
                                <p class="shipment-id">{{ data.shipmentId }}</p>
                                <p class="shipment-meta">{{ data.carrier }}</p>
                            </div>
                        </template>
                    </Column>
                    <Column field="route" header="Route" sortable />
                    <Column field="status" header="Current Status" sortable>
                        <template #body="{ data }">
                            <span :class="['status-pill', statusClass(data.status)]">{{ data.status }}</span>
                        </template>
                    </Column>
                    <Column field="shipped" header="Shipped" sortable />
                    <Column field="eta" header="ETA" sortable />
                    <Column header="Action">
                        <template #body="{ data }">
                            <Button
                                label="TRACK ORDER"
                                text
                                class="details-btn"
                                @click="goToTrackingDetails(data.orderId)"
                            />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </section>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { FilterMatchMode } from "@primevue/core/api"
import { normalizeOrderValue, trackingOrders } from "../data/trackingOrders"

const router = useRouter()

const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const searchOrderId = ref("98274839743464562341234124")
const searchError = ref("")

const statusClass = (status) => {
    if (status === "In Transit") return "status-transit"
    if (status === "Delayed") return "status-delayed"
    return "status-pending"
}

const goToTrackingDetails = (orderId) => {
    router.push({ name: "tracking-detail", params: { id: orderId } })
}

const handleTrackSearch = () => {
    const query = normalizeOrderValue(searchOrderId.value)
    if (!query) {
        searchError.value = "Please enter an order number."
        return
    }

    const match = trackingOrders.find(
        (order) =>
            normalizeOrderValue(order.orderId) === query ||
            normalizeOrderValue(order.shipmentId) === query,
    )

    if (!match) {
        searchError.value = "Order not found. Try another order number."
        return
    }

    searchError.value = ""
    goToTrackingDetails(match.orderId)
}
</script>

<style scoped>
.tracking-page {
    min-height: 100vh;
    padding: 1.8rem 2rem;
    background: #e8e8dd;
}

.track-search {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.2rem;
}

.track-label {
    letter-spacing: 0.8px;
    color: #1f2d2f;
    font-weight: 700;
}

.track-inline-form {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.search-error {
    color: #b02d2d;
    margin: -0.45rem 0 0.8rem;
}

.panel {
    border-radius: 6px;
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: flex-end;
}

.shipment-id {
    margin: 0;
    color: #1ab1bb;
    font-weight: 700;
}

.shipment-meta {
    margin: 1px 0 0;
    color: #7ca6ab;
}

.status-pill {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.15rem 0.45rem;
    border: 1px solid transparent;
    white-space: nowrap;
}

.status-transit {
    background: rgba(32, 178, 120, 0.18);
    border-color: rgba(32, 178, 120, 0.45);
    color: #6ee6a9;
}

.status-delayed {
    background: rgba(255, 184, 0, 0.15);
    border-color: rgba(255, 184, 0, 0.45);
    color: #ffd769;
}

.status-pending {
    background: rgba(139, 167, 183, 0.18);
    border-color: rgba(139, 167, 183, 0.4);
    color: #b4ccd7;
}

:deep(.track-input.p-inputtext) {
    border: none;
    border-bottom: 2px solid #2b545c;
    border-radius: 0;
    box-shadow: none;
    background: transparent;
    min-width: 260px;
    color: #113f47;
    font-weight: 400;
    outline: none;
    padding: 0.1rem 0;
}

:deep(.track-input.p-inputtext:focus) {
    border-bottom-color: #2b545c;
}

:deep(.track-submit.p-button) {
    border: none;
    background: transparent;
    color: #1c2528;
    min-width: 28px;
    padding: 0 0.15rem;
}

:deep(.table-panel.p-card) {
    background: #073d45;
    border: 1px solid #0f5660;
}

:deep(.table-panel .p-card-body) {
    padding: 0.95rem 1rem;
}

:deep(.tracking-table .p-datatable-table) {
    min-width: 840px;
}

:deep(.tracking-table .p-datatable-header) {
    background: transparent;
    border: none;
    padding: 0 0 0.95rem;
}

:deep(.tracking-table .p-inputtext) {
    min-width: 220px;
}

:deep(.tracking-table .p-datatable-thead > tr > th) {
    background: transparent;
    color: #94bcc0;
    text-transform: uppercase;
    letter-spacing: 0.85px;
    font-weight: 700;
    border: none;
    padding: 0 0 0.95rem;
}

:deep(.tracking-table .p-datatable-tbody > tr) {
    background: transparent;
}

:deep(.tracking-table .p-datatable-tbody > tr > td) {
    border-top: 1px solid rgba(123, 187, 198, 0.09);
    border-bottom: none;
    color: #d8ecee;
    padding: 0.65rem 0;
}

:deep(.tracking-table .p-paginator) {
    background: #0a525c;
    border: none;
    color: #8fb8bd;
    padding: 0.62rem 0;
}

:deep(.tracking-table .p-paginator-page.p-paginator-page-selected) {
    background: #1f9da8;
    color: #fff;
}

:deep(.details-btn.p-button) {
    background: transparent;
    border: none;
    color: #1ab1bb;
    text-transform: uppercase;
    letter-spacing: 0.85px;
    padding: 0;
}

:deep(.details-btn.p-button:hover) {
    background: transparent;
    color: #1ab1bb;
}

@media (max-width: 980px) {
    .track-search {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.35rem;
    }

    :deep(.track-input.p-inputtext) {
        min-width: 180px;
    }
}
</style>
