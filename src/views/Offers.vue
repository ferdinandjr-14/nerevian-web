<template>
	<section class="offers-page">
		<header class="offers-toolbar">
			<button class="create-offer-btn" type="button" @click="goToCreateOffer">CREATE OFFER +</button>

			<div class="toolbar-right">
				<input
					v-model="searchTerm"
					class="search-input"
					type="text"
					placeholder="SEARCH BY ID"
					aria-label="Search offers by id"
				/>

				<select v-model="selectedStatus" class="filter-select" aria-label="Filter offers">
					<option value="all">FILTER</option>
					<option value="accepted">ACCEPTED</option>
				</select>
			</div>
		</header>

		<div class="offers-list">
			<article
				v-for="offer in filteredOffers"
				:key="offer.id"
				:class="['offer-item', { expanded: expandedOfferId === offer.id }]"
			>
				<button class="offer-row" type="button" @click="toggleOffer(offer.id)">
					<span class="offer-title">Offer <strong>#{{ offer.id }}</strong></span>
					<span class="offer-status-wrap">
						<span class="offer-status">{{ offer.status }}</span>
						<span :class="['chevron', { up: expandedOfferId === offer.id }]">⌄</span>
					</span>
				</button>

				<div v-if="expandedOfferId === offer.id" class="offer-panel">
					<div class="offer-meta-row">
						<p><span>Customer:</span> <em>{{ offer.customer }}</em></p>
						<p><span>Incoterm:</span> <em>{{ offer.incoterm }}</em></p>
						<p><span>Cargo type:</span> <em>{{ offer.cargoType }}</em></p>
						<p><span>Shipping Line:</span> <em>{{ offer.shippingLine }}</em></p>
					</div>

					<div class="offer-route-row">
						<p class="route-city">{{ offer.origin }}</p>
						<span class="route-divider" aria-hidden="true"></span>
						<span class="route-icon" aria-hidden="true">⚓</span>
						<span class="route-arrow" aria-hidden="true">→</span>
						<p class="route-city">{{ offer.destination }}</p>

						<button
							class="detail-link-btn"
							type="button"
							aria-label="View offer details"
							@click.stop="goToOfferDetails(offer.id)"
						>
							→
						</button>
					</div>
				</div>
			</article>

			<p v-if="!filteredOffers.length" class="empty-state">No accepted offers found for this search.</p>
		</div>
	</section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { activeOffers } from '../data/offers'

const router = useRouter()
const offers = activeOffers

const searchTerm = ref('')
const selectedStatus = ref('all')
const expandedOfferId = ref(offers[0].id)

const filteredOffers = computed(() => {
	const query = searchTerm.value.trim().toLowerCase()

	return offers.filter((offer) => {
		if (!offer.isActive) return false
		if (selectedStatus.value === 'accepted' && offer.status !== 'ACCEPTED') return false
		if (!query) return true
		return offer.id.toLowerCase().includes(query)
	})
})

const toggleOffer = (id) => {
	expandedOfferId.value = expandedOfferId.value === id ? null : id
}

const goToCreateOffer = () => {
	router.push({ name: 'create-offer' })
}

const goToOfferDetails = (offerId) => {
	router.push({ name: 'create-offer', query: { offerId } })
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

.create-offer-btn {
	border: none;
	border-radius: 6px;
	background: #ff6666;
	color: #fff;
	font-size: 0.73rem;
	letter-spacing: 0.45px;
	padding: 0.55rem 0.95rem;
	cursor: pointer;
}

.toolbar-right {
	display: flex;
	align-items: center;
	gap: 0.65rem;
}

.search-input {
	width: 202px;
	border: 1px solid #78979d;
	border-radius: 4px;
	height: 34px;
	padding: 0 0.55rem;
	font-size: 0.72rem;
	background: transparent;
	color: #0f353b;
	text-transform: uppercase;
}

.search-input::placeholder {
	color: #2d5860;
}

.filter-select {
	height: 34px;
	border: none;
	border-radius: 4px;
	padding: 0 1.85rem 0 0.8rem;
	background: #1f9da8;
	color: #fff;
	font-size: 0.72rem;
	letter-spacing: 0.45px;
	cursor: pointer;
	appearance: none;
	position: relative;
	background-image: linear-gradient(45deg, transparent 50%, #fff 50%), linear-gradient(135deg, #fff 50%, transparent 50%);
	background-position: calc(100% - 13px) 14px, calc(100% - 8px) 14px;
	background-size: 5px 5px, 5px 5px;
	background-repeat: no-repeat;
}

.offers-list {
	display: flex;
	flex-direction: column;
	gap: 0.56rem;
}

.offer-item {
	border-radius: 10px;
	overflow: hidden;
}

.offer-row {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
	border: none;
	background: #118c8c;
	color: #ebf7f8;
	min-height: 44px;
	padding: 0.4rem 0.9rem;
	cursor: pointer;
	text-align: left;
}

.offer-title {
	font-size: 1.08rem;
	line-height: 1;
}

.offer-title strong {
	font-size: 1.26rem;
	color: #8de4e8;
	font-weight: 700;
}

.offer-status-wrap {
	display: inline-flex;
	align-items: center;
	gap: 0.52rem;
}

.offer-status {
	font-size: 0.75rem;
	font-weight: 700;
	color: #ffffff;
	letter-spacing: 0.4px;
	border: 1px solid #7dff7c;
	border-radius: 999px;
	padding: 0.15rem 0.45rem;
	background: #20b860;
}

.chevron {
	font-size: 1.15rem;
	line-height: 1;
	color: #d9f3f5;
	transition: transform 0.2s ease;
}

.chevron.up {
	transform: rotate(180deg);
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
	font-size: 0.72rem;
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
	font-size: 0.67rem;
}

.offer-route-row {
	display: grid;
	grid-template-columns: 1fr auto auto auto 1fr auto;
	align-items: center;
	gap: 0.6rem;
}

.route-city {
	margin: 0;
	font-size: 2rem;
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
	font-size: 2rem;
	color: #1b9399;
	line-height: 1;
}

.route-arrow {
	font-size: 1.4rem;
	color: #2b6368;
	line-height: 1;
}

.detail-link-btn {
	border: none;
	background: #ff6666;
	color: #fff;
	width: 34px;
	height: 30px;
	border-radius: 7px;
	font-size: 1.15rem;
	line-height: 1;
	cursor: pointer;
}

.empty-state {
	margin-top: 1.1rem;
	font-size: 0.88rem;
	color: #1a474e;
}

@media (max-width: 980px) {
	.offers-toolbar {
		flex-direction: column;
		align-items: stretch;
	}

	.toolbar-right {
		width: 100%;
	}

	.search-input,
	.filter-select {
		width: 100%;
	}

	.offer-title {
		font-size: 0.95rem;
	}

	.offer-title strong {
		font-size: 1.08rem;
	}

	.offer-meta-row {
		grid-template-columns: 1fr 1fr;
	}

	.offer-route-row {
		grid-template-columns: 1fr;
		justify-items: center;
		gap: 0.35rem;
	}

	.route-city {
		font-size: 1.2rem;
	}

	.route-divider,
	.route-arrow {
		display: none;
	}

	.detail-link-btn {
		margin-top: 0.4rem;
	}
}
</style>