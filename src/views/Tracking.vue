<template>
	<section class="tracking-page">
		<header class="track-search">
			<span class="track-label">TRACK ORDER:</span>
			<form class="track-inline-form" @submit.prevent="handleTrackSearch">
				<input
					v-model="searchOrderId"
					class="track-input"
					type="text"
					placeholder="98274839743464562341234124"
					aria-label="Order number"
				/>
				<button class="track-submit" type="submit" aria-label="Track order">→</button>
			</form>
		</header>

		<p v-if="searchError" class="search-error">{{ searchError }}</p>

		<section class="panel table-panel">
			<div class="table-head">
				<span v-for="column in columns" :key="column">{{ column }}</span>
			</div>

			<div class="table-body">
				<div v-for="row in paginatedOrders" :key="row.orderId" class="table-row">
					<div class="shipment-cell">
						<p class="shipment-id">{{ row.shipmentId }}</p>
						<p class="shipment-meta">{{ row.carrier }}</p>
					</div>

					<p class="route">{{ row.route }}</p>

					<div>
						<span :class="['status-pill', statusClass(row.status)]">{{ row.status }}</span>
					</div>

					<p>{{ row.shipped }}</p>
					<p>{{ row.eta }}</p>

					<button class="details-btn" type="button" @click="goToTrackingDetails(row.orderId)">
						TRACK ORDER
					</button>
				</div>
			</div>

			<footer class="table-footer">
				<p>{{ paginationLabel }}</p>

				<div class="pagination">
					<button type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">‹</button>
					<button
						v-for="page in pageNumbers"
						:key="page"
						type="button"
						:class="{ active: page === currentPage }"
						@click="goToPage(page)"
					>
						{{ page }}
					</button>
					<button type="button" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">›</button>
				</div>
			</footer>
		</section>
	</section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { normalizeOrderValue, trackingOrders } from '../data/trackingOrders'

const router = useRouter()

const columns = ['SHIPMENT ID', 'ROUTE', 'CURRENT STATUS', 'SHIPPED', 'ETA', 'ACTION']
const itemsPerPage = 7

const searchOrderId = ref('98274839743464562341234124')
const searchError = ref('')
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(trackingOrders.length / itemsPerPage))

const pageNumbers = computed(() => {
	const pageCount = Math.max(1, totalPages.value)
	return Array.from({ length: pageCount }, (_, index) => index + 1)
})

const paginatedOrders = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage
	return trackingOrders.slice(start, start + itemsPerPage)
})

const paginationLabel = computed(() => {
	if (!trackingOrders.length) return 'Showing 0 results'

	const start = (currentPage.value - 1) * itemsPerPage + 1
	const end = Math.min(currentPage.value * itemsPerPage, trackingOrders.length)
	return `Showing ${start}-${end} of ${trackingOrders.length} results`
})

const goToPage = (page) => {
	if (page < 1 || page > totalPages.value) return
	currentPage.value = page
}

const statusClass = (status) => {
	if (status === 'In Transit') return 'status-transit'
	if (status === 'Delayed') return 'status-delayed'
	return 'status-pending'
}

const goToTrackingDetails = (orderId) => {
	router.push({ name: 'tracking-detail', params: { id: orderId } })
}

const handleTrackSearch = () => {
	const query = normalizeOrderValue(searchOrderId.value)
	if (!query) {
		searchError.value = 'Please enter an order number.'
		return
	}

	const match = trackingOrders.find(
		(order) =>
			normalizeOrderValue(order.orderId) === query ||
			normalizeOrderValue(order.shipmentId) === query
	)

	if (!match) {
		searchError.value = 'Order not found. Try another order number.'
		return
	}

	searchError.value = ''
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
	font-size: 0.8rem;
	letter-spacing: 0.8px;
	color: #1f2d2f;
	font-weight: 700;
}

.track-inline-form {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
}

.track-input {
	border: none;
	border-bottom: 2px solid #2b545c;
	background: transparent;
	min-width: 260px;
	font-size: 1.65rem;
	line-height: 1;
	color: #113f47;
	font-weight: 400;
	outline: none;
	padding: 0.1rem 0;
}

.track-submit {
	border: none;
	background: transparent;
	color: #1c2528;
	font-size: 2rem;
	line-height: 1;
	cursor: pointer;
	padding: 0 0.15rem;
}

.search-error {
	color: #b02d2d;
	font-size: 0.8rem;
	margin: -0.45rem 0 0.8rem;
}

.panel {
	background: #073d45;
	border: 1px solid #0f5660;
	border-radius: 6px;
	overflow: hidden;
}

.table-head,
.table-row {
	display: grid;
	grid-template-columns: 1.1fr 2fr 1fr 0.8fr 0.8fr 0.9fr;
	align-items: center;
	gap: 0.85rem;
}

.table-head {
	padding: 0.95rem 1rem;
	font-size: 0.52rem;
	text-transform: uppercase;
	letter-spacing: 0.85px;
	color: #94bcc0;
	font-weight: 700;
}

.table-body {
	padding: 0 1rem;
}

.table-row {
	min-height: 42px;
	border-top: 1px solid rgba(123, 187, 198, 0.09);
	font-size: 0.66rem;
	color: #d8ecee;
}

.shipment-id {
	margin: 0;
	color: #1ab1bb;
	font-weight: 700;
	font-size: 0.62rem;
}

.shipment-meta {
	margin: 1px 0 0;
	color: #7ca6ab;
	font-size: 0.48rem;
}

.route {
	margin: 0;
	color: #d7ecef;
}

.status-pill {
	display: inline-flex;
	align-items: center;
	border-radius: 999px;
	padding: 0.13rem 0.45rem;
	font-size: 0.5rem;
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

.details-btn {
	background: transparent;
	border: none;
	color: #1ab1bb;
	text-transform: uppercase;
	font-size: 0.58rem;
	letter-spacing: 0.85px;
	cursor: pointer;
	padding: 0;
	text-align: left;
}

.table-footer {
	margin-top: 0.3rem;
	background: #0a525c;
	color: #8fb8bd;
	font-size: 0.58rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.62rem 1rem;
}

.pagination {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
}

.pagination button {
	width: 16px;
	height: 16px;
	border-radius: 3px;
	border: none;
	background: transparent;
	color: #c7e2e5;
	font-size: 0.56rem;
	cursor: pointer;
}

.pagination .active {
	background: #1f9da8;
	color: #fff;
}

.pagination button:disabled {
	opacity: 0.35;
	cursor: not-allowed;
}

@media (max-width: 980px) {
	.table-head,
	.table-row {
		grid-template-columns: 1fr;
		gap: 0.3rem;
	}

	.table-head {
		display: none;
	}

	.track-search {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
	}

	.track-input {
		min-width: 180px;
		font-size: 1.2rem;
	}
}
</style>