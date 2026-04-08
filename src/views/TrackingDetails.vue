<template>
	<section class="tracking-details-page">
		<header class="details-header">
			<button type="button" class="back-btn" @click="router.push({ name: 'tracking' })">← Back to tracking</button>
			<h2>Tracking Details</h2>
		</header>

		<template v-if="order">
			<section class="timeline-preview" aria-label="Tracking progress preview">
				<div class="timeline-track" aria-hidden="true">
					<div
						v-for="(step, index) in timelinePreviewSteps"
						:key="step.id"
						:class="['timeline-step', { active: index === previewActiveStep }]"
					>
						<span class="timeline-dot"></span>
						<span v-if="index < timelinePreviewSteps.length - 1" class="timeline-arrow"></span>
					</div>
				</div>

				<div class="timeline-labels" aria-hidden="true">
					<p
						v-for="(step, index) in timelinePreviewSteps"
						:key="`${step.id}-label`"
						:class="['timeline-label', { active: index === previewActiveStep }]"
					>
						{{ step.label }}
					</p>
				</div>
			</section>

			<article class="details-card details-info-card">
				<div class="details-grid">
					<p><span>Order ID:</span> {{ order.orderId }}</p>
					<p><span>Shipment ID:</span> {{ order.shipmentId }}</p>
					<p><span>Carrier:</span> {{ order.carrier }}</p>
					<p><span>Status:</span> {{ order.status }}</p>
					<p><span>Route:</span> {{ order.route }}</p>
					<p><span>Shipped:</span> {{ order.shipped }}</p>
					<p><span>ETA:</span> {{ order.eta }}</p>
				</div>
			</article>
		</template>

		<article v-else class="details-card missing-card">
			<p>We could not find that order. Please go back and try another order ID.</p>
		</article>
	</section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { normalizeOrderValue, trackingOrders } from '../data/trackingOrders'

const route = useRoute()
const router = useRouter()

const timelinePreviewSteps = [
	{ id: 'verified-origin', label: 'Verified at origin' },
	{ id: 'loaded-freight', label: 'Loaded on freight' },
	{ id: 'on-route', label: 'On route' },
	{ id: 'arrived-destination', label: 'Arrived at destination port' },
	{ id: 'customs', label: 'Awaiting customs' }
]

const previewActiveStep = 2

const order = computed(() => {
	const target = normalizeOrderValue(route.params.id)
	return trackingOrders.find(
		(item) =>
			normalizeOrderValue(item.orderId) === target ||
			normalizeOrderValue(item.shipmentId) === target
	)
})
</script>

<style scoped>
.tracking-details-page {
	min-height: 100vh;
	padding: 2rem;
	background: #e8e8dd;
}

.details-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1rem;
}

.details-header h2 {
	margin: 0;
	color: #163c43;
	font-size: 1.5rem;
}

.back-btn {
	border: none;
	background: #0a525c;
	color: #eef7f7;
	font-size: 0.78rem;
	border-radius: 6px;
	padding: 0.45rem 0.7rem;
	cursor: pointer;
}

.details-card {
	background: #073d45;
	border: 1px solid #0f5660;
	border-radius: 8px;
	color: #d8ecee;
	padding: 1.2rem;
}

.timeline-preview {
	margin-top: clamp(3.25rem, 12vh, 8rem);
	margin-bottom: 1.4rem;
	padding: 0.55rem 0.2rem 0.85rem;
}

.timeline-track {
	position: relative;
	display: grid;
	grid-template-columns: repeat(5, minmax(50px, 1fr));
	align-items: center;
	gap: 1.15rem;
	padding: 0 0.5rem;
}

.timeline-track::before {
	content: '';
	position: absolute;
	left: 0.9rem;
	right: 0.9rem;
	height: 2px;
	background: rgba(8, 29, 33, 0.72);
	transform: translateY(0);
	animation: rail-glow 2.4s ease-in-out infinite;
}

.timeline-step {
	display: flex;
	justify-content: center;
	position: relative;
	z-index: 1;
}

.timeline-arrow {
	position: absolute;
	right: -9px;
	top: 50%;
	width: 9px;
	height: 9px;
	border-top: 2px solid rgba(8, 29, 33, 0.88);
	border-right: 2px solid rgba(8, 29, 33, 0.88);
	transform: translateY(-50%) rotate(45deg);
	opacity: 0.95;
	animation: arrow-glow 2.1s ease-in-out infinite;
}

.timeline-dot {
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background: #147f88;
	border: 2px solid #72c5cb;
	box-shadow: 0 0 0 0 rgba(39, 187, 197, 0.42);
	animation: idle-pulse 2.8s ease-in-out infinite;
}

.timeline-step.active .timeline-dot {
	width: 60px;
	height: 60px;
	background: #1f9da8;
	border-color: #b6edf1;
	animation: active-pulse 1.7s ease-out infinite;
}

.timeline-labels {
	display: grid;
	grid-template-columns: repeat(5, minmax(50px, 1fr));
	gap: 0.75rem;
	margin-top: 0.45rem;
}

.timeline-label {
	margin: 0;
	font-size: 0.62rem;
	line-height: 1.3;
	color: #8fb8bd;
	text-align: center;
}

.timeline-label.active {
	color: #d7f5f7;
	font-weight: 700;
}

.details-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(240px, 1fr));
	gap: 0.75rem;
}

.details-info-card {
	margin-top: clamp(6.5rem, 25vh, 15rem);
}

@keyframes idle-pulse {
	0%,
	100% {
		box-shadow: 0 0 0 0 rgba(32, 178, 186, 0.2);
	}
	50% {
		box-shadow: 0 0 0 6px rgba(32, 178, 186, 0);
	}
}

@keyframes active-pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(61, 208, 218, 0.5);
	}
	80%,
	100% {
		box-shadow: 0 0 0 11px rgba(61, 208, 218, 0);
	}
}

@keyframes rail-glow {
	0%,
	100% {
		opacity: 0.45;
	}
	50% {
		opacity: 0.85;
	}
}

@keyframes arrow-glow {
	0%,
	100% {
		opacity: 0.55;
	}
	50% {
		opacity: 1;
	}
}

.details-grid p {
	margin: 0;
	font-size: 0.9rem;
}

.details-grid span {
	color: #8fb8bd;
	font-weight: 700;
}

.missing-card {
	font-size: 0.9rem;
}

@media (max-width: 760px) {
	.tracking-details-page {
		padding: 1rem;
	}

	.details-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.details-grid {
		grid-template-columns: 1fr;
	}

	.details-info-card {
		margin-top: 1.4rem;
	}

	.timeline-track,
	.timeline-labels {
		grid-template-columns: 1fr;
		gap: 0.4rem;
	}

	.timeline-track {
		justify-items: start;
		padding-left: 0.25rem;
	}

	.timeline-track::before {
		display: none;
	}

	.timeline-arrow {
		display: none;
	}

	.timeline-step {
		justify-content: flex-start;
	}

	.timeline-label {
		text-align: left;
		padding-left: 2.8rem;
		margin-top: -2.25rem;
		margin-bottom: 0.55rem;
	}
}
</style>
