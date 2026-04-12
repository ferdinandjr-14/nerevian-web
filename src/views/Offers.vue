<template>
    <section class="offers-page">
        <header class="flex justify-between">
            <Button
                label="CREATE OFFER +"
                class="bg-danger p-2 px-4 rounded-lg text-primary cursor-pointer"
                @click="goToCreateOffer"
            />

            <div class="flex items-center gap-5">
                <IconField class="p-2 flex gap-2 items-center border-b border-b-secondary">
                    <InputIcon class="pi pi-search" />
                    <InputText
                        v-model="searchTerm"
                        type="text"
                        placeholder="SEARCH BY ID"
                        aria-label="Search offers by id"
                        class="w-60"
                    />
                </IconField>

                <Select
                    v-model="selectedStatus"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    class="cursor-pointer flex items-center gap-2 bg-accent py-2 px-5 text-primary rounded-lg text-center w-40 justify-center"
                    aria-label="Filter offers"
                    :pt="{
                        overlay: {
                            class: 'rounded-lg',
                        },
                        option: {
                            class: 'bg-white px-4 py-2 hover:bg-gray-200 cursor-pointer',
                        },
                        list: {
                            class: 'p-1',
                        },
                    }"
                />
            </div>
        </header>

        <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
        <p v-else-if="isLoading" class="mt-4 text-secondary">Loading offers...</p>

        <div class="mt-5" v-else>
            <OfferList :offers="filteredOffers" @view="goToOfferDetails" />
        </div>
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { AxiosError } from "axios"
import { useRouter } from "vue-router"
import { OFFER_STATUSES } from "../data/offers"
import { fetchOffers, mapOfferToListItem } from "@/services/offers"
import OfferList from "../components/OfferList.vue"

const router = useRouter()

const statusOptions = [
    { label: "ALL STATUSES", value: "all" },
    ...OFFER_STATUSES.map((status) => ({
        label: status.label.toUpperCase(),
        value: status.id,
    })),
]

const searchTerm = ref("")
const selectedStatus = ref("all")
const offers = ref([])
const isLoading = ref(false)
const errorMessage = ref("")

const loadOffers = async () => {
    isLoading.value = true
    errorMessage.value = ""

    try {
        const response = await fetchOffers()
        offers.value = response.items.map(mapOfferToListItem)
    } catch (error) {
        if (error instanceof AxiosError) {
            errorMessage.value = error.response?.data?.message || "Unable to load offers."
        } else {
            errorMessage.value = "Unable to load offers."
        }
    } finally {
        isLoading.value = false
    }
}

const filteredOffers = computed(() => {
    const query = searchTerm.value.trim().toLowerCase()

    return offers.value.filter((offer) => {
        if (
            selectedStatus.value !== "all" &&
            Number(offer.estatOfertaId) !== Number(selectedStatus.value)
        ) {
            return false
        }
        if (!query) return true
        return String(offer.id).toLowerCase().includes(query)
    })
})

const goToCreateOffer = () => {
    router.push({ name: "create-offer" })
}

const goToOfferDetails = (offerId) => {
    router.push({ name: "offer-detail", params: { id: String(offerId) } })
}

onMounted(loadOffers)
</script>
