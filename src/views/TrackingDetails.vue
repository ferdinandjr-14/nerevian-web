<template>
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    <div v-else-if="isLoading" class="flex items-center gap-2 mt-5">
        <LoadingSpinner />
        Tracking Order...
    </div>
    <section v-else class="tracking-details-page bg-primary!">
        <header class="details-header">
            <button type="button" class="back-btn" @click="router.push({ name: 'tracking' })">
                Back to tracking
            </button>
        </header>

        <template v-if="order">
            <section class="timeline-preview" aria-label="Tracking progress preview">
                <div class="timeline-track" aria-hidden="true">
                    <div
                        v-for="(step, index) in timelinePreviewSteps"
                        :key="step.id"
                        class="flex justify-start md:justify-center relative z-10 items-center"
                    >
                        <span
                            :class="[
                                'rounded-full shrink-0 transition-all duration-300',
                                index <= previewActiveStep ? 'bg-secondary' : 'bg-accent-muted',
                                index === previewActiveStep
                                    ? 'border-4 border-accent w-16 h-16 md:w-20 md:h-20 anim-active'
                                    : 'w-12 h-12 md:w-14 md:h-14 anim-idle',
                            ]"
                        ></span>
                        <span
                            v-if="index < timelinePreviewSteps.length - 1"
                            class="hidden md:block absolute -right-3 top-1/2 w-3 h-3 border-t-2 border-r-2 border-dark/80 -translate-y-1/2 rotate-45 opacity-90 anim-arrow"
                        ></span>
                    </div>
                </div>

                <div class="timeline-labels" aria-hidden="true">
                    <p
                        v-for="(step, index) in timelinePreviewSteps"
                        :key="`${step.id}-label`"
                        :class="[
                            'leading-tight text-left md:text-center pl-12 md:pl-0 -mt-10 md:mt-0 mb-2 md:mb-0 transition-colors duration-300',
                            index === previewActiveStep
                                ? 'text-secondary font-bold text-lg'
                                : 'text-accent-muted font-medium',
                        ]"
                    >
                        {{ step.label }}
                    </p>
                </div>
            </section>

            <Card class="details-card details-info-card bg-secondary p-5 rounded-xl">
                <template #content>
                    <div class="details-grid">
                        <p><span>Order ID:</span> {{ order.orderId }}</p>
                        <p><span>Shipment ID:</span> {{ order.shipmentId }}</p>
                        <p><span>Carrier:</span> {{ order.carrier }}</p>
                        <p><span>Status:</span> {{ order.status }}</p>
                        <p><span>Route:</span> {{ order.route }}</p>
                        <p><span>Shipped:</span> {{ order.shipped }}</p>
                        <p><span>ETA:</span> {{ order.eta }}</p>
                    </div>
                </template>
            </Card>
        </template>

        <Card v-else class="details-card missing-card">
            <template #content>
                <p class="text-secondary">
                    We could not find that order. Please go back and try another order ID.
                </p>
            </template>
        </Card>
    </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { fetchOfferById, mapOfferSummary } from "@/services/offers"
import LoadingSpinner from "@/components/LoadingSpinner.vue"

const route = useRoute()
const router = useRouter()
const order = ref(null)

const isLoading = ref(true)
const errorMessage = ref(null)

const timelinePreviewSteps = [
    { id: "verified-origin", label: "Verified at origin" },
    { id: "loaded-freight", label: "Loaded on freight" },
    { id: "on-route", label: "On route" },
    { id: "arrived-destination", label: "Arrived at destination port" },
    { id: "customs", label: "Awaiting customs" },
]

const getPreviewStep = (trackingStepOrder) => {
    const step = Number(trackingStepOrder)

    if (!step) return 0
    if (step <= 2) return 0
    if (step <= 4) return 1
    if (step <= 6) return 2
    if (step <= 7) return 3
    return 4
}

const previewActiveStep = computed(() => getPreviewStep(order.value?.trackingStepOrder))

const loadOffer = async () => {
    try {
        const offer = await fetchOfferById(route.params.id)
        const summary = mapOfferSummary(offer)

        order.value = {
            orderId: `OFF-${summary.id}`,
            shipmentId: `OFF-${summary.id}`,
            carrier: summary.shippingLineName || summary.carrierName || "-",
            status: summary.statusLabel,
            route: `${summary.originLabel} -> ${summary.destinationLabel}`,
            shipped: summary.createdAt,
            eta: summary.eta,
            trackingStepOrder: summary.trackingStepOrder,
        }
        isLoading.value = false
    } catch {
        order.value = null
        errorMessage.value = "Couldn't load order"
    }
}

onMounted(loadOffer)

watch(
    () => route.params.id,
    () => {
        loadOffer()
    },
)
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
}

.back-btn {
    border: none;
    background: #0a525c;
    color: #eef7f7;
    border-radius: 6px;
    padding: 0.45rem 0.7rem;
    cursor: pointer;
}

.details-card {
    color: #d8ecee;
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
    content: "";
    position: absolute;
    left: 0.9rem;
    right: 0.9rem;
    height: 2px;
    background: rgba(8, 29, 33, 0.72);
    transform: translateY(0);
    animation: rail-glow 2.4s ease-in-out infinite;
}

.timeline-labels {
    display: grid;
    grid-template-columns: repeat(5, minmax(50px, 1fr));
    gap: 0.75rem;
    margin-top: 0.45rem;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(240px, 1fr));
    gap: 0.75rem;
}

.details-info-card {
    margin-top: clamp(6.5rem, 25vh, 15rem);
}

.anim-idle {
    animation: idle-pulse 2.8s ease-in-out infinite;
}

.anim-active {
    animation: active-pulse 1.7s ease-out infinite;
}

.anim-arrow {
    animation: arrow-glow 2.1s ease-in-out infinite;
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
}

.details-grid span {
    color: #8fb8bd;
    font-weight: 700;
}

.missing-card {
}

:deep(.details-card.p-card) {
    background: #073d45;
    border: 1px solid #0f5660;
    border-radius: 8px;
}

:deep(.details-card .p-card-body) {
    padding: 1.2rem;
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
}
</style>
