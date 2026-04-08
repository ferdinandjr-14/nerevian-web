<template>
  <section class="dashboard bg-primary">
    <div class="stats-grid">
      <article v-for="card in statsCards" :key="card.label" class="stat-card">
        <p class="stat-label">{{ card.label }}</p>
        <p class="stat-value">{{ card.value }}</p>
      </article>
    </div>

    <div class="content-grid">
      <section class="panel table-panel">
        <div class="table-head">
          <span v-for="column in dashboardMeta.tableColumns" :key="column">{{ column }}</span>
        </div>

        <div class="table-body">
          <div v-for="row in paginatedShipments" :key="row.id" class="table-row">
            <div class="shipment-cell">
              <p class="shipment-id">{{ row.id }}</p>
              <p class="shipment-meta">{{ row.carrier }}</p>
            </div>

            <p class="route">{{ row.route }}</p>

            <div>
              <span :class="['status-pill', statusClass(row.status)]">
                {{ row.status }}
              </span>
            </div>

            <p>{{ row.eta }}</p>

            <button class="details-btn" type="button">{{ dashboardMeta.detailsButtonLabel }}</button>
          </div>
        </div>

        <footer class="table-footer">
          <p>{{ paginationLabel }}</p>

          <div class="pagination">
            <button type="button" :disabled="currentPage === 1" @click="goToPreviousPage">
              {{ dashboardMeta.paginationSymbols.previous }}
            </button>
            <button
              v-for="page in pageNumbers"
              :key="page"
              type="button"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button type="button" :disabled="currentPage === totalPages" @click="goToNextPage">
              {{ dashboardMeta.paginationSymbols.next }}
            </button>
          </div>
        </footer>
      </section>

      <aside class="panel alerts-panel">
        <div class="alerts-title-wrap">
          <h3>{{ dashboardMeta.alertsTitle }}</h3>
        </div>

        <div class="alerts-list">
          <article v-for="alert in alerts" :key="alert.id" class="alert-card">
            <p class="alert-title">{{ alert.title }}</p>
            <p class="alert-text">{{ alert.message }}</p>
          </article>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const dashboardMeta = {
  tableColumns: ['ID', 'Route', 'Current Status', 'ETA', 'Action'],
  detailsButtonLabel: 'View details',
  alertsTitle: 'Alerts',
  paginationSymbols: {
    previous: '‹',
    next: '›'
  }
}

const statsCards = [
  { label: 'Total Orders', value: '9 672' },
  { label: 'Pending Orders', value: '1 672' },
  { label: 'Active Orders', value: '1 051' },
  { label: 'Rejected Orders', value: '1 051' },
  { label: 'Orders Delivered', value: '6301' }
]

const shipments = [
  {
    id: '#SHP-9821',
    carrier: 'Carrier: Maersk Line',
    route: 'Rotterdam, NL  →  Barcelona, ES',
    status: 'In Transit',
    eta: '21/10/2026'
  },
  {
    id: '#SHP-7734',
    carrier: 'Carrier: DHL Express',
    route: 'Barcelona, ES  →  London, UK',
    status: 'Delayed',
    eta: '21/10/2026'
  },
  {
    id: '#SHP-4412',
    carrier: 'Carrier: FedEx',
    route: 'Shenzhen, CN  →  Barcelona, ES',
    status: 'Pending',
    eta: '21/10/2026'
  },
  {
    id: '#SHP-1082',
    carrier: 'Carrier: Cargo-Lloyd',
    route: 'Mumbai, IN  →  Barcelona, ES',
    status: 'In Transit',
    eta: '21/10/2026'
  },
  {
    id: '#SHP-3381',
    carrier: 'Carrier: UPS Global',
    route: 'Barcelona, ES  →  Tokyo, JP',
    status: 'In Transit',
    eta: '21/10/2026'
  },
  {
    id: '#SHP-1290',
    carrier: 'Carrier: Evergreen Marine',
    route: 'Valencia, ES  →  New York, US',
    status: 'In Transit',
    eta: '22/10/2026'
  },
  {
    id: '#SHP-5517',
    carrier: 'Carrier: COSCO Shipping',
    route: 'Qingdao, CN  →  Genoa, IT',
    status: 'Pending',
    eta: '23/10/2026'
  },
  {
    id: '#SHP-9142',
    carrier: 'Carrier: MSC',
    route: 'Santos, BR  →  Algeciras, ES',
    status: 'Delayed',
    eta: '24/10/2026'
  },
  {
    id: '#SHP-6403',
    carrier: 'Carrier: Hapag-Lloyd',
    route: 'Hamburg, DE  →  Montreal, CA',
    status: 'In Transit',
    eta: '25/10/2026'
  },
  {
    id: '#SHP-7731',
    carrier: 'Carrier: CMA CGM',
    route: 'Marseille, FR  →  Casablanca, MA',
    status: 'Pending',
    eta: '26/10/2026'
  },
  {
    id: '#SHP-2069',
    carrier: 'Carrier: ONE',
    route: 'Singapore, SG  →  Sydney, AU',
    status: 'In Transit',
    eta: '27/10/2026'
  },
  {
    id: '#SHP-4876',
    carrier: 'Carrier: Yang Ming',
    route: 'Kaohsiung, TW  →  Seattle, US',
    status: 'Delayed',
    eta: '28/10/2026'
  },
  {
    id: '#SHP-3325',
    carrier: 'Carrier: ZIM',
    route: 'Haifa, IL  →  Piraeus, GR',
    status: 'Pending',
    eta: '29/10/2026'
  },
  {
    id: '#SHP-7154',
    carrier: 'Carrier: Maersk Line',
    route: 'Lisbon, PT  →  Dakar, SN',
    status: 'In Transit',
    eta: '30/10/2026'
  },
  {
    id: '#SHP-8610',
    carrier: 'Carrier: DHL Express',
    route: 'Frankfurt, DE  →  Dublin, IE',
    status: 'In Transit',
    eta: '31/10/2026'
  },
  {
    id: '#SHP-9034',
    carrier: 'Carrier: FedEx',
    route: 'Memphis, US  →  Madrid, ES',
    status: 'Delayed',
    eta: '01/11/2026'
  },
  {
    id: '#SHP-2783',
    carrier: 'Carrier: UPS Global',
    route: 'Chicago, US  →  Berlin, DE',
    status: 'Pending',
    eta: '02/11/2026'
  },
  {
    id: '#SHP-4408',
    carrier: 'Carrier: Cargo-Lloyd',
    route: 'Doha, QA  →  Rome, IT',
    status: 'In Transit',
    eta: '03/11/2026'
  },
  {
    id: '#SHP-5901',
    carrier: 'Carrier: MSC',
    route: 'Durban, ZA  →  Antwerp, BE',
    status: 'Delayed',
    eta: '04/11/2026'
  },
  {
    id: '#SHP-7488',
    carrier: 'Carrier: HMM',
    route: 'Busan, KR  →  Vancouver, CA',
    status: 'In Transit',
    eta: '05/11/2026'
  },
  {
    id: '#SHP-8127',
    carrier: 'Carrier: COSCO Shipping',
    route: 'Ningbo, CN  →  Felixstowe, UK',
    status: 'Pending',
    eta: '06/11/2026'
  },
  {
    id: '#SHP-9275',
    carrier: 'Carrier: CMA CGM',
    route: 'Le Havre, FR  →  Alexandria, EG',
    status: 'In Transit',
    eta: '07/11/2026'
  },
  {
    id: '#SHP-3162',
    carrier: 'Carrier: ONE',
    route: 'Osaka, JP  →  Los Angeles, US',
    status: 'Delayed',
    eta: '08/11/2026'
  },
  {
    id: '#SHP-6547',
    carrier: 'Carrier: Yang Ming',
    route: 'Taipei, TW  →  Rotterdam, NL',
    status: 'In Transit',
    eta: '09/11/2026'
  },
  {
    id: '#SHP-7806',
    carrier: 'Carrier: ZIM',
    route: 'Ashdod, IL  →  Valencia, ES',
    status: 'Pending',
    eta: '10/11/2026'
  },
  {
    id: '#SHP-8429',
    carrier: 'Carrier: Maersk Line',
    route: 'Oslo, NO  →  Reykjavik, IS',
    status: 'In Transit',
    eta: '11/11/2026'
  },
  {
    id: '#SHP-9730',
    carrier: 'Carrier: DHL Express',
    route: 'Paris, FR  →  Zurich, CH',
    status: 'Delayed',
    eta: '12/11/2026'
  },
  {
    id: '#SHP-1185',
    carrier: 'Carrier: UPS Global',
    route: 'Brussels, BE  →  Vienna, AT',
    status: 'In Transit',
    eta: '13/11/2026'
  }
]

const alerts = [
  {
    id: 1,
    title: '⚠ Shipment #4928 Delayed',
    message: 'Stuck at Port of Los Angeles due to terminal congestion.'
  },
  {
    id: 2,
    title: '⚠ Shipment #7734 Customs Hold',
    message: 'Awaiting customs inspection documents in London terminal.'
  },
  {
    id: 3,
    title: '⚠ Shipment #1082 Weather Alert',
    message: 'Route updated because of heavy monsoon conditions near Mumbai.'
  },
  {
    id: 4,
    title: '⚠ Shipment #3381 Capacity Issue',
    message: 'Transfer delayed 12h while reassigned to a larger vessel.'
  }
]

const itemsPerPage = 5
const currentPage = ref(1)

const totalResults = computed(() => shipments.length)
const totalPages = computed(() => Math.ceil(totalResults.value / itemsPerPage))

const paginatedShipments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return shipments.slice(start, end)
})

const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

const paginationLabel = computed(() => {
  if (totalResults.value === 0) return 'Showing 0 results'

  const start = (currentPage.value - 1) * itemsPerPage + 1
  const end = Math.min(currentPage.value * itemsPerPage, totalResults.value)
  return `Showing ${start}-${end} of ${totalResults.value} results`
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const goToPreviousPage = () => {
  goToPage(currentPage.value - 1)
}

const goToNextPage = () => {
  goToPage(currentPage.value + 1)
}

const statusClass = (status) => {
  if (status === 'In Transit') return 'status-transit'
  if (status === 'Delayed') return 'status-delayed'
  return 'status-pending'
}
</script>

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

.stat-card {
  background: #073d45;
  border-radius: 8px;
  padding: 0.6rem;
  border: 1px solid #0f5660;
}

.stat-label {
  text-transform: uppercase;
  font-size: 0.72rem;
  text-align: center;
  margin: 0;
  color: #d4e6e8;
  letter-spacing: 0.4px;
  background: #084953;
  border-radius: 6px;
  padding: 0.6rem 0.4rem;
}

.stat-value {
  margin: 0.85rem 0 0.55rem;
  text-align: center;
  font-size: 2.15rem;
  font-weight: 300;
  color: #eef7f7;
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

.table-head,
.table-row {
  display: grid;
  grid-template-columns: 1.2fr 2fr 1fr 0.8fr 0.9fr;
  align-items: center;
  gap: 0.85rem;
}

.table-head {
  padding: 0.85rem 1rem;
  font-size: 0.64rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #9ec0c5;
  font-weight: 700;
}

.table-body {
  padding: 0 1rem;
}

.table-row {
  min-height: 60px;
  border-top: 1px solid rgba(123, 187, 198, 0.1);
  font-size: 0.78rem;
  color: #d8ecee;
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
  text-align: left;
}

.table-footer {
  margin-top: 0.4rem;
  background: #0a525c;
  color: #8fb8bd;
  font-size: 0.68rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem 1rem;
}

.pagination {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.pagination button {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  border: none;
  background: transparent;
  color: #c7e2e5;
  font-size: 0.68rem;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.pagination .active {
  background: #1f9da8;
  color: #fff;
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
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 0.35rem 1rem;
}

.alerts-list {
  padding: 0.7rem;
  overflow: auto;
}

.alert-card {
  border-left: 2px solid #ff3d49;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0 6px 6px 0;
  padding: 0.55rem 0.6rem;
  margin-bottom: 0.85rem;
}

.alert-title {
  margin: 0 0 0.2rem;
  font-size: 0.64rem;
  color: #ffd1d1;
  font-weight: 700;
}

.alert-text {
  margin: 0;
  font-size: 0.6rem;
  color: #8fb1b6;
  line-height: 1.35;
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

  .alert-card {
    margin-bottom: 0;
  }
}

@media (max-width: 760px) {
  .dashboard {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(130px, 1fr));
  }

  .table-head,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.3rem;
    padding: 0.6rem 0;
  }

  .table-head {
    display: none;
  }

  .table-row {
    border-top: 1px solid rgba(123, 187, 198, 0.14);
  }

  .table-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .alerts-list {
    grid-template-columns: 1fr;
  }
}
</style>