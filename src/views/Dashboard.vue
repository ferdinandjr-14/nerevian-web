<template>
    <section class="dashboard-page">
        <div class="stats-grid">
            <Card v-for="card in statsCards" :key="card.label" class="stat-card">
                <template #content>
                    <p class="stat-label">{{ card.label }}</p>
                    <p class="stat-value">{{ card.value }}</p>
                </template>
            </Card>
        </div>

        <div class="content-grid">
            <Card class="panel table-panel">
                <template #content>
                    <DataTable
                        v-model:filters="tableFilters"
                        :value="shipments"
                        :globalFilterFields="['id', 'carrier', 'route', 'status', 'eta']"
                        class="shipments-table"
                        dataKey="id"
                        paginator
                        :rows="5"
                        :rowsPerPageOptions="[5, 10, 20]"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first}-{last} of {totalRecords} results"
                    >
                        <template #header>
                            <div class="table-header">
                                <IconField>
                                    <InputIcon class="pi pi-search" />
                                    <InputText
                                        v-model="tableFilters.global.value"
                                        placeholder="Search shipments"
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
                        <Column field="status" header="Current Status" sortable>
                            <template #body="{ data }">
                                <span :class="['status-pill', statusClass(data.status)]">
                                    {{ data.status }}
                                </span>
                            </template>
                        </Column>
                        <Column field="eta" header="ETA" sortable />
                        <Column header="Action">
                            <template #body>
                                <Button label="View details" text class="details-btn" />
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>

            <Card class="panel alerts-panel">
                <template #content>
                    <div class="alerts-title-wrap">
                        <h3>Alerts</h3>
                    </div>

                    <div class="alerts-list">
                        <Card v-for="alert in alerts" :key="alert.id" class="alert-card">
                            <template #content>
                                <p class="alert-title">{{ alert.title }}</p>
                                <p class="alert-text">{{ alert.message }}</p>
                            </template>
                        </Card>
                    </div>
                </template>
            </Card>
        </div>
    </section>
</template>

<script setup>
import { ref } from "vue"
import { FilterMatchMode } from "@primevue/core/api"

const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const statsCards = [
    { label: "Total Orders", value: "9 672" },
    { label: "Pending Orders", value: "1 672" },
    { label: "Active Orders", value: "1 051" },
    { label: "Rejected Orders", value: "1 051" },
    { label: "Orders Delivered", value: "6301" },
]

const shipments = [
    { id: "#SHP-9821", carrier: "Carrier: Maersk Line", route: "Rotterdam, NL -> Barcelona, ES", status: "In Transit", eta: "21/10/2026" },
    { id: "#SHP-7734", carrier: "Carrier: DHL Express", route: "Barcelona, ES -> London, UK", status: "Delayed", eta: "21/10/2026" },
    { id: "#SHP-4412", carrier: "Carrier: FedEx", route: "Shenzhen, CN -> Barcelona, ES", status: "Pending", eta: "21/10/2026" },
    { id: "#SHP-1082", carrier: "Carrier: Cargo-Lloyd", route: "Mumbai, IN -> Barcelona, ES", status: "In Transit", eta: "21/10/2026" },
    { id: "#SHP-3381", carrier: "Carrier: UPS Global", route: "Barcelona, ES -> Tokyo, JP", status: "In Transit", eta: "21/10/2026" },
    { id: "#SHP-1290", carrier: "Carrier: Evergreen Marine", route: "Valencia, ES -> New York, US", status: "In Transit", eta: "22/10/2026" },
    { id: "#SHP-5517", carrier: "Carrier: COSCO Shipping", route: "Qingdao, CN -> Genoa, IT", status: "Pending", eta: "23/10/2026" },
    { id: "#SHP-9142", carrier: "Carrier: MSC", route: "Santos, BR -> Algeciras, ES", status: "Delayed", eta: "24/10/2026" },
    { id: "#SHP-6403", carrier: "Carrier: Hapag-Lloyd", route: "Hamburg, DE -> Montreal, CA", status: "In Transit", eta: "25/10/2026" },
    { id: "#SHP-7731", carrier: "Carrier: CMA CGM", route: "Marseille, FR -> Casablanca, MA", status: "Pending", eta: "26/10/2026" },
    { id: "#SHP-2069", carrier: "Carrier: ONE", route: "Singapore, SG -> Sydney, AU", status: "In Transit", eta: "27/10/2026" },
    { id: "#SHP-4876", carrier: "Carrier: Yang Ming", route: "Kaohsiung, TW -> Seattle, US", status: "Delayed", eta: "28/10/2026" },
]

const alerts = [
    { id: 1, title: "Alert: Shipment #4928 Delayed", message: "Stuck at Port of Los Angeles due to terminal congestion." },
    { id: 2, title: "Alert: Shipment #7734 Customs Hold", message: "Awaiting customs inspection documents in London terminal." },
    { id: 3, title: "Alert: Shipment #1082 Weather Alert", message: "Route updated because of heavy monsoon conditions near Mumbai." },
    { id: 4, title: "Alert: Shipment #3381 Capacity Issue", message: "Transfer delayed 12h while reassigned to a larger vessel." },
]

const statusClass = (status) => {
    if (status === "In Transit") return "status-transit"
    if (status === "Delayed") return "status-delayed"
    return "status-pending"
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
    grid-template-columns: 1fr 250px;
    gap: 0.65rem;
}

.panel {
    border-radius: 8px;
    overflow: hidden;
}

.stat-label {
    text-transform: uppercase;
    margin: 0;
    color: #d4e6e8;
    letter-spacing: 0.4px;
    background: #084953;
    border-radius: 6px;
    padding: 0.6rem 0.4rem;
    font-weight: 600;
}

.stat-value {
    margin: 0.85rem 0 0.55rem;
    text-align: center;
    color: #eef7f7;
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

.status-pill {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 0.2rem 0.55rem;
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

.alerts-panel {
    display: flex;
    flex-direction: column;
}

.alerts-title-wrap {
    display: flex;
    justify-content: center;
    padding: 0.75rem 0.75rem 0.2rem;
}

.alerts-title-wrap h3 {
    margin: 0;
    background: #ff4b4b;
    color: #fff;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    padding: 0.35rem 1rem;
}

.alerts-list {
    padding: 0.7rem;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
}

.alert-title {
    margin: 0 0 0.2rem;
    color: #ffd1d1;
    font-weight: 700;
}

.alert-text {
    margin: 0;
    color: #8fb1b6;
    line-height: 1.35;
}

:deep(.stat-card.p-card),
:deep(.panel.p-card) {
    background: #073d45;
    border: 1px solid #0f5660;
    border-radius: 8px;
}

:deep(.stat-card .p-card-body),
:deep(.panel .p-card-body),
:deep(.alert-card .p-card-body) {
    padding: 0.6rem;
}

:deep(.table-panel .p-card-body) {
    padding: 0.85rem 1rem;
}

:deep(.shipments-table .p-datatable-table) {
    min-width: 700px;
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

:deep(.alert-card.p-card) {
    border-left: 2px solid #ff3d49;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0 6px 6px 0;
    border-top: none;
    border-right: none;
    border-bottom: none;
}

@media (max-width: 1100px) {
    .stats-grid {
        grid-template-columns: repeat(3, minmax(140px, 1fr));
    }

    .content-grid {
        grid-template-columns: 1fr;
    }

    .alerts-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(180px, 1fr));
        gap: 0.5rem;
    }
}

@media (max-width: 760px) {
    .dashboard-page {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: repeat(2, minmax(130px, 1fr));
    }

    .alerts-list {
        grid-template-columns: 1fr;
    }
}
</style>
