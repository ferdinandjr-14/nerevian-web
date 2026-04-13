<template>
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    <div v-else-if="isLoading" class="flex items-center gap-2 mt-5">
        <LoadingSpinner />
        Loading Dashboard...
    </div>
    <section v-else>
        <div class="stats-grid">
            <CardInfo
                v-for="card in statsCards"
                :key="card.label"
                :label="card.label"
                :value="card.value"
            />
        </div>

        <DataTable
            scrollable
            scrollHeight="600px"
            v-model:filters="tableFilters"
            :value="shipments"
            dataKey="id"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :pt="{
                root: { class: 'w-full bg-secondary rounded-xl overflow-hidden' },
                table: { class: 'w-full border-collapse' },
                thead: { class: 'border-b border-secondary-muted' },
                tbody: { class: 'divide-y divide-secondary-muted' },
                pcPaginator: {
                    root: {
                        class: 'flex gap-5 items-center justify-center gap-2 px-6 py-4 bg-secondary-muted text-primary',
                    },
                    content: {
                        class: 'flex items-center gap-3',
                    },
                    pcRowPerPageDropdown: {
                        root: {
                            class: 'flex items-center justify-center gap-1 bg-secondary border border-secondary-muted rounded-lg px-3 py-1 cursor-pointer text-sm text-primary',
                        },
                        label: { class: 'text-primary text-sm' },
                        dropdown: { class: 'text-primary text-xs ml-1' },
                        overlay: {
                            class: 'bg-secondary border border-secondary-muted rounded-lg mt-1 overflow-hidden z-50',
                        },
                        option: ({ context }) => ({
                            class: [
                                'px-4 py-2 text-sm cursor-pointer transition-colors',
                                context.selected
                                    ? 'bg-accent text-primary'
                                    : 'text-primary hover:bg-secondary-muted',
                            ],
                        }),
                        list: { class: 'p-1' },
                    },
                },
            }"
        >
            <Column
                header="Shipment ID"
                :pt="{
                    headerCell: { class: 'px-6 py-4 text-left text-primary' },
                    bodyCell: { class: 'px-6 py-5' },
                }"
            >
                <template #body="{ data }">
                    <div class="flex flex-col gap-0.5">
                        <p class="text-accent font-semibold text-sm tracking-wide">
                            #{{ data.id }}
                        </p>
                        <p class="text-primary text-xs opacity-50">Carrier: {{ data.carrier }}</p>
                    </div>
                </template>
            </Column>

            <Column
                header="Route"
                :pt="{
                    headerCell: { class: 'px-6 py-4 text-left text-primary' },
                    bodyCell: { class: 'px-6 py-5' },
                }"
            >
                <template #body="{ data }">
                    <div class="flex items-center gap-2 text-primary text-sm">
                        <span>{{ data.origin }}</span>
                        <i class="pi pi-arrow-right text-accent opacity-60 text-xs" />
                        <span>{{ data.destination }}</span>
                    </div>
                </template>
            </Column>

            <Column
                field="statusLabel"
                header="Current Status"
                :pt="{
                    headerCell: { class: 'px-6 py-4 text-left text-primary' },
                    bodyCell: { class: 'px-6 py-5' },
                }"
            >
                <template #body="{ data }">
                    <StatusBadge :status-id="data.statusId" />
                </template>
            </Column>

            <Column
                field="eta"
                header="ETA"
                :pt="{
                    headerCell: { class: 'px-6 py-4 text-left text-primary' },
                    bodyCell: { class: 'px-6 py-5' },
                }"
            >
                <template #body="{ data }">
                    <span class="text-primary text-sm tabular-nums">{{ data.eta }}</span>
                </template>
            </Column>

            <Column
                header="Action"
                :pt="{
                    headerCell: { class: 'px-6 py-4 text-left text-primary' },
                    bodyCell: { class: 'px-6 py-5' },
                }"
            >
                <template #body="{ data }">
                    <button
                        class="text-xs font-bold uppercase tracking-widest text-accent hover:text-primary transition-colors cursor-pointer"
                        @click="goToOfferDetails(data.offerId)"
                    >
                        View Details
                    </button>
                </template>
            </Column>
        </DataTable>
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { FilterMatchMode } from "@primevue/core/api"
import CardInfo from "../components/CardInfo.vue"
import StatusBadge from "../components/StatusBadge.vue"
import { ACTIVE_OFFER_STATUS_IDS, OFFER_STATUS_IDS } from "../data/offers"
import { fetchOffers, mapOfferSummary } from "@/services/offers"
import LoadingSpinner from "@/components/LoadingSpinner.vue"

const router = useRouter()
const offers = ref([])
const isLoading = ref(true)
const errorMessage = ref(null)

const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const loadOffers = async () => {
    try {
        const data = await fetchOffers()
        offers.value = data.map(mapOfferSummary)
        isLoading.value = false
    } catch {
        offers.value = []
        errorMessage.value = "Coulnd't load offers"
    }
}

const countByStatus = (statusId) =>
    offers.value.filter((offer) => offer.estatOfertaId === statusId).length

const statsCards = computed(() => {
    const totalOffers = offers.value.length
    const pendingOffers = countByStatus(OFFER_STATUS_IDS.PENDING)
    const activeOffers = offers.value.filter((offer) =>
        ACTIVE_OFFER_STATUS_IDS.includes(offer.estatOfertaId),
    ).length
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
    offers.value.map((offer) => ({
        id: `OFF-${offer.id}`,
        offerId: offer.id,
        carrier: offer.shippingLineName || offer.carrierName || "-",
        origin: offer.originLabel,
        destination: offer.destinationLabel,
        statusId: offer.estatOfertaId,
        statusLabel: offer.statusLabel,
        eta: offer.eta || "-",
    })),
)

const goToOfferDetails = (offerId) => {
    router.push({ name: "offer-detail", params: { id: String(offerId) } })
}

onMounted(loadOffers)
</script>

<style scoped>
.dashboard-page {
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
    grid-template-columns: 1fr;
    gap: 0.65rem;
}
</style>
