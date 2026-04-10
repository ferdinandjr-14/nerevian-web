<template>
  <section class="dashboard bg-primary">

    <!-- Stats -->
    <div class="stats-grid">
      <StatCard
        v-for="card in statsCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
      />
    </div>

    <div class="content-grid">

      <!-- PrimeVue DataTable -->
      <section class="panel table-panel">
        <DataTable
          :value="shipments"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first}-{last} of {totalRecords} results"
          tableStyle="width: 100%"
          class="shp-table"
        >
          <Column field="id" header="ID">
            <template #body="{ data }">
              <div>
                <p class="shipment-id">{{ data.id }}</p>
                <p class="shipment-meta">{{ data.carrier }}</p>
              </div>
            </template>
          </Column>

          <Column field="route" header="Route">
            <template #body="{ data }">
              <p class="route">{{ data.route }}</p>
            </template>
          </Column>

          <Column field="status" header="Current Status">
            <template #body="{ data }">
              <span :class="['status-pill', statusClass(data.status)]">
                {{ data.status }}
              </span>
            </template>
          </Column>

          <Column field="eta" header="ETA" />

          <Column header="Action">
            <template #body>
              <button class="details-btn" type="button">View details</button>
            </template>
          </Column>
        </DataTable>
      </section>

      <!-- Alert list -->
      <AlertList :alerts="alerts" title="Alerts" />

    </div>
  </section>
</template>

<script setup>
import StatCard from './StatCard.vue'
import AlertList from './Alertlist.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const statsCards = [
  { label: 'Total Orders', value: '9 672' },
  { label: 'Pending Orders', value: '1 672' },
  { label: 'Active Orders', value: '1 051' },
  { label: 'Rejected Orders', value: '1 051' },
  { label: 'Orders Delivered', value: '6301' }
]

const shipments = [
  { id: '#SHP-9821', carrier: 'Carrier: Maersk Line',       route: 'Rotterdam, NL  →  Barcelona, ES',  status: 'In Transit', eta: '21/10/2026' },
  { id: '#SHP-7734', carrier: 'Carrier: DHL Express',       route: 'Barcelona, ES  →  London, UK',      status: 'Delayed',    eta: '21/10/2026' },
  { id: '#SHP-4412', carrier: 'Carrier: FedEx',             route: 'Shenzhen, CN  →  Barcelona, ES',   status: 'Pending',    eta: '21/10/2026' },
  { id: '#SHP-1082', carrier: 'Carrier: Cargo-Lloyd',       route: 'Mumbai, IN  →  Barcelona, ES',     status: 'In Transit', eta: '21/10/2026' },
  { id: '#SHP-3381', carrier: 'Carrier: UPS Global',        route: 'Barcelona, ES  →  Tokyo, JP',      status: 'In Transit', eta: '21/10/2026' },
  { id: '#SHP-1290', carrier: 'Carrier: Evergreen Marine',  route: 'Valencia, ES  →  New York, US',    status: 'In Transit', eta: '22/10/2026' },
  { id: '#SHP-5517', carrier: 'Carrier: COSCO Shipping',    route: 'Qingdao, CN  →  Genoa, IT',        status: 'Pending',    eta: '23/10/2026' },
  { id: '#SHP-9142', carrier: 'Carrier: MSC',               route: 'Santos, BR  →  Algeciras, ES',     status: 'Delayed',    eta: '24/10/2026' },
  { id: '#SHP-6403', carrier: 'Carrier: Hapag-Lloyd',       route: 'Hamburg, DE  →  Montreal, CA',     status: 'In Transit', eta: '25/10/2026' },
  { id: '#SHP-7731', carrier: 'Carrier: CMA CGM',           route: 'Marseille, FR  →  Casablanca, MA', status: 'Pending',    eta: '26/10/2026' },
  { id: '#SHP-2069', carrier: 'Carrier: ONE',               route: 'Singapore, SG  →  Sydney, AU',     status: 'In Transit', eta: '27/10/2026' },
  { id: '#SHP-4876', carrier: 'Carrier: Yang Ming',         route: 'Kaohsiung, TW  →  Seattle, US',   status: 'Delayed',    eta: '28/10/2026' },
  { id: '#SHP-3325', carrier: 'Carrier: ZIM',               route: 'Haifa, IL  →  Piraeus, GR',        status: 'Pending',    eta: '29/10/2026' },
  { id: '#SHP-7154', carrier: 'Carrier: Maersk Line',       route: 'Lisbon, PT  →  Dakar, SN',         status: 'In Transit', eta: '30/10/2026' },
  { id: '#SHP-8610', carrier: 'Carrier: DHL Express',       route: 'Frankfurt, DE  →  Dublin, IE',     status: 'In Transit', eta: '31/10/2026' },
  { id: '#SHP-9034', carrier: 'Carrier: FedEx',             route: 'Memphis, US  →  Madrid, ES',       status: 'Delayed',    eta: '01/11/2026' },
  { id: '#SHP-2783', carrier: 'Carrier: UPS Global',        route: 'Chicago, US  →  Berlin, DE',       status: 'Pending',    eta: '02/11/2026' },
  { id: '#SHP-4408', carrier: 'Carrier: Cargo-Lloyd',       route: 'Doha, QA  →  Rome, IT',            status: 'In Transit', eta: '03/11/2026' },
  { id: '#SHP-5901', carrier: 'Carrier: MSC',               route: 'Durban, ZA  →  Antwerp, BE',       status: 'Delayed',    eta: '04/11/2026' },
  { id: '#SHP-7488', carrier: 'Carrier: HMM',               route: 'Busan, KR  →  Vancouver, CA',      status: 'In Transit', eta: '05/11/2026' },
  { id: '#SHP-8127', carrier: 'Carrier: COSCO Shipping',    route: 'Ningbo, CN  →  Felixstowe, UK',    status: 'Pending',    eta: '06/11/2026' },
  { id: '#SHP-9275', carrier: 'Carrier: CMA CGM',           route: 'Le Havre, FR  →  Alexandria, EG',  status: 'In Transit', eta: '07/11/2026' },
  { id: '#SHP-3162', carrier: 'Carrier: ONE',               route: 'Osaka, JP  →  Los Angeles, US',    status: 'Delayed',    eta: '08/11/2026' },
  { id: '#SHP-6547', carrier: 'Carrier: Yang Ming',         route: 'Taipei, TW  →  Rotterdam, NL',     status: 'In Transit', eta: '09/11/2026' },
  { id: '#SHP-7806', carrier: 'Carrier: ZIM',               route: 'Ashdod, IL  →  Valencia, ES',      status: 'Pending',    eta: '10/11/2026' },
  { id: '#SHP-8429', carrier: 'Carrier: Maersk Line',       route: 'Oslo, NO  →  Reykjavik, IS',       status: 'In Transit', eta: '11/11/2026' },
  { id: '#SHP-9730', carrier: 'Carrier: DHL Express',       route: 'Paris, FR  →  Zurich, CH',         status: 'Delayed',    eta: '12/11/2026' },
  { id: '#SHP-1185', carrier: 'Carrier: UPS Global',        route: 'Brussels, BE  →  Vienna, AT',      status: 'In Transit', eta: '13/11/2026' }
]

const alerts = [
  { id: 1, title: '⚠ Shipment #4928 Delayed',        message: 'Stuck at Port of Los Angeles due to terminal congestion.' },
  { id: 2, title: '⚠ Shipment #7734 Customs Hold',   message: 'Awaiting customs inspection documents in London terminal.' },
  { id: 3, title: '⚠ Shipment #1082 Weather Alert',  message: 'Route updated because of heavy monsoon conditions near Mumbai.' },
  { id: 4, title: '⚠ Shipment #3381 Capacity Issue', message: 'Transfer delayed 12h while reassigned to a larger vessel.' }
]

const statusClass = (status) => {
  if (status === 'In Transit') return 'status-transit'
  if (status === 'Delayed') return 'status-delayed'
  return 'status-pending'
}
</script>

<style>
/*
  PrimeVue DataTable overrides — scoped no funciona para elementos internos
  de PrimeVue, por eso estos estilos son globales (o usa :deep() si prefieres scoped).
*/
.shp-table .p-datatable-thead > tr > th {
  background: #073d45 !important;
  color: #9ec0c5 !important;
  font-size: 0.64rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.8px !important;
  font-weight: 700 !important;
  border-color: rgba(123, 187, 198, 0.1) !important;
  padding: 0.85rem 1rem !important;
}

.shp-table .p-datatable-tbody > tr {
  background: #073d45 !important;
  color: #d8ecee !important;
  font-size: 0.78rem !important;
}

.shp-table .p-datatable-tbody > tr > td {
  border-color: rgba(123, 187, 198, 0.1) !important;
  padding: 0.6rem 1rem !important;
}

.shp-table .p-datatable-tbody > tr:hover > td {
  background: rgba(15, 86, 96, 0.4) !important;
}

.shp-table .p-paginator {
  background: #0a525c !important;
  color: #8fb8bd !important;
  font-size: 0.68rem !important;
  border: none !important;
  padding: 0.7rem 1rem !important;
  justify-content: space-between !important;
}

.shp-table .p-paginator .p-paginator-page,
.shp-table .p-paginator .p-paginator-prev,
.shp-table .p-paginator .p-paginator-next,
.shp-table .p-paginator .p-paginator-first,
.shp-table .p-paginator .p-paginator-last {
  min-width: 1.6rem !important;
  height: 1.6rem !important;
  color: #c7e2e5 !important;
  background: transparent !important;
  border: none !important;
  font-size: 0.68rem !important;
}

.shp-table .p-paginator .p-paginator-page.p-highlight {
  background: #1f9da8 !important;
  color: #fff !important;
  border-radius: 3px !important;
}

.shp-table .p-paginator .p-disabled {
  opacity: 0.35 !important;
}

.shp-table .p-paginator .p-paginator-current {
  color: #8fb8bd !important;
}

/* Dropdown de rows per page */
.shp-table .p-paginator .p-dropdown {
  background: #073d45 !important;
  border-color: #0f5660 !important;
  color: #c7e2e5 !important;
  font-size: 0.68rem !important;
}
</style>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2rem;
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
  background: #073d45;
  border: 1px solid #0f5660;
  border-radius: 8px;
  overflow: hidden;
}

.shipment-id {
  margin: 0;
  color: #3dd0da;
  font-weight: 600;
}

.shipment-meta {
  margin: 2px 0 0;
  color: #7ca6ab;
  font-size: 0.65rem;
}

.route {
  margin: 0;
  color: #d7ecef;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.18rem 0.55rem;
  font-size: 0.65rem;
  border: 1px solid transparent;
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

.details-btn {
  background: transparent;
  border: none;
  color: #3dd0da;
  text-transform: uppercase;
  font-size: 0.62rem;
  letter-spacing: 0.9px;
  cursor: pointer;
  padding: 0;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(3, minmax(140px, 1fr));
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .dashboard {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(130px, 1fr));
  }
}
</style>