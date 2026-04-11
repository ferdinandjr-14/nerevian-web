<template>
    <section>
        <header class="flex gap-2 mb-5 py-3">
            <span class="font-semibold text-xl">TRACK ORDER:</span>
            <form class="border-b" @submit.prevent="handleTrackSearch">
                <InputText
                    v-model="searchOrderId"
                    class="w-80 border-0 outline-0 text-xl"
                    type="text"
                    placeholder="Enter Order ID"
                    aria-label="Order number"
                />
                <Button
                    icon="pi pi-arrow-right"
                    text
                    class="font-semibold text-xl"
                    type="submit"
                    aria-label="Track order"
                />
            </form>
        </header>

        <p v-if="searchError" class="search-error">{{ searchError }}</p>

        <DataTable
            scrollable
            scrollHeight="600px"
            v-model:filters="tableFilters"
            :value="trackingOrders"
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
                        TRACK ORDER
                    </button>
                </template>
            </Column>
        </DataTable>
    </section>
</template>

<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { FilterMatchMode } from "@primevue/core/api"
import StatusBadge from "../components/StatusBadge.vue"
import { offers, OFFER_STATUS_IDS } from "../data/offers"

const router = useRouter()

const searchOrderId = ref("")
const searchError = ref("")

const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const ACTIVE_STATUS_IDS = [
    OFFER_STATUS_IDS.ACCEPTED,
    OFFER_STATUS_IDS.SHIPPED,
    OFFER_STATUS_IDS.IN_TRANSIT,
]

const trackingOrders = computed(() =>
    offers
        .filter((offer) => ACTIVE_STATUS_IDS.includes(offer.estatOfertaId))
        .map((offer) => ({
            id: offer.id,
            offerId: offer.id,
            carrier: `${offer.shippingLineName || offer.inlandCarrierName || "-"}`,
            origin: offer.originLabel,
            destination: offer.destinationLabel,
            statusId: offer.estatOfertaId,
            statusLabel: offer.statusLabel,
            eta: offer.eta || "-",
        })),
)

const goToOfferDetails = (offerId) => {
    router.push({ name: "tracking-detail", params: { id: String(offerId) } })
}

const handleTrackSearch = () => {
    const query = searchOrderId.value.trim()
    if (!query) {
        searchError.value = "Please enter an order number."
        return
    }

    const match = offers.find((offer) => String(offer.id).includes(query))

    if (!match) {
        searchError.value = "Order not found. Try another order number."
        return
    }

    searchError.value = ""
    router.push({ name: "tracking-detail", params: { id: String(match.id) } })
}
</script>
