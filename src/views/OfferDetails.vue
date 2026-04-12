<template>
    <p v-if="loadError" class="mt-[0.45rem] text-[#b42318]">{{ loadError }}</p>
    <div v-else-if="isLoading" class="flex items-center gap-2">
        <span
            class="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
        Loading offer details
    </div>
    <section
        v-else
        class="create-offer-page bg-primary! max-[700px]:px-3 max-[700px]:pt-[0.85rem] max-[700px]:pb-[1.8rem]"
    >
        <header class="flex justify-between mt-5">
            <Button
                icon="pi pi-arrow-left"
                text
                class="cursor-pointer"
                type="button"
                @click="goBack"
            />
            <StatusBadge :statusId="statusId" />
        </header>

        <Accordion v-model:value="openSections" multiple class="offer-accordion">
            <AccordionPanel
                v-for="section in sections"
                :key="section.key"
                :value="section.key"
                class="bg-accent-muted mt-10 rounded-xl"
            >
                <AccordionHeader
                    class="bg-accent w-full text-left px-4 py-4 text-primary flex justify-between rounded-xl items-center cursor-pointer hover:bg-secondary-muted transition-all duration-300 ease-in-out"
                >
                    {{ section.title }}
                </AccordionHeader>
                <AccordionContent class="p-5">
                    <div v-if="section.key === 'general'" class="fields-grid cols-3">
                        <label class="field-block">
                            <span>Client</span>
                            <Select
                                v-model="form.client_id"
                                :options="clientOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block">
                            <span>Transport Type</span>
                            <Select
                                v-model="form.tipus_transport_id"
                                :options="transportOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block">
                            <span>Flow</span>
                            <Select
                                v-model="form.tipus_fluxe_id"
                                :options="flowOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block">
                            <span>Cargo Type</span>
                            <Select
                                v-model="form.tipus_carrega_id"
                                :options="cargoOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block">
                            <span>Incoterm</span>
                            <Select
                                v-model="form.incoterm_id"
                                :options="incotermOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block">
                            <span>Validation Type</span>
                            <Select
                                v-model="form.tipus_validacio_id"
                                :options="validationOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                    </div>

                    <div v-if="section.key === 'route'" class="fields-grid cols-3">
                        <label class="field-block">
                            <span>Carrier</span>
                            <Select
                                v-model="form.transportista_id"
                                :options="carrierOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block" v-if="isMaritimeTransport">
                            <span>Port of Origin</span>
                            <Select
                                v-model="form.port_origen_id"
                                :options="portOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block" v-if="isMaritimeTransport">
                            <span>Port of Destination</span>
                            <Select
                                v-model="form.port_desti_id"
                                :options="portOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block" v-if="isAirTransport">
                            <span>Airport of Origin</span>
                            <Select
                                v-model="form.aeroport_origen_id"
                                :options="airportOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block" v-if="isAirTransport">
                            <span>Airport of Destination</span>
                            <Select
                                v-model="form.aeroport_desti_id"
                                :options="airportOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block" v-if="isMaritimeTransport">
                            <span>Shipping Line</span>
                            <Select
                                v-model="form.linia_transport_maritim_id"
                                :options="shippingLineOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block" v-if="isMaritimeTransport">
                            <span>Container Type</span>
                            <Select
                                v-model="form.tipus_contenidor_id"
                                :options="containerOptions"
                                optionLabel="label"
                                optionValue="value"
                                class="w-full"
                                disabled
                            />
                        </label>
                        <label class="field-block">
                            <span>Gross Weight (kg)</span>
                            <InputText v-model="form.pes_brut" type="number" disabled />
                        </label>
                        <label class="field-block">
                            <span>Volume (m3)</span>
                            <InputText v-model="form.volum" type="number" disabled />
                        </label>
                    </div>

                    <div v-if="section.key === 'dates'" class="fields-grid cols-3">
                        <label class="field-block">
                            <span>Created Date</span>
                            <InputText v-model="form.data_creacio" type="date" disabled />
                        </label>
                        <label class="field-block">
                            <span>Validity Start</span>
                            <InputText v-model="form.data_validessa_inicial" type="date" disabled />
                        </label>
                        <label class="field-block">
                            <span>Validity End</span>
                            <InputText v-model="form.data_validessa_fina" type="date" disabled />
                        </label>
                        <label class="field-block">
                            <span>Status</span>
                            <InputText :modelValue="statusLabel" type="text" disabled />
                        </label>
                    </div>

                    <div v-if="section.key === 'additional'" class="fields-grid cols-3">
                        <label class="field-block col-span-full">
                            <span>Comments</span>
                            <Textarea
                                v-model="form.comentaris"
                                rows="4"
                                autoResize
                                class="bg-primary rounded-b-xl rounded-tr-xl shadow-[2px_2px_4px_1px_rgb(124,124,124)] px-4 py-2 max-h-50 outline-0"
                                disabled
                            />
                        </label>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>

        <footer
            class="mt-12 flex max-[700px]:grid max-[700px]:grid-cols-1 justify-between items-center gap-3.5"
        >
            <div>
                <Button
                    icon="pi pi-eye"
                    label="CHECK DOCUMENTS"
                    type="button"
                    class="p-2 bg-danger text-primary rounded-lg px-4 flex items-center gap-2 cursor-pointer"
                    @click="showDocumentsModal = true"
                />
            </div>
        </footer>

        <Dialog
            v-model:visible="showDocumentsModal"
            modal
            class="pb-5 min-h-100 min-w-100 rounded-lg bg-primary"
            :draggable="false"
            :pt="{
                mask: {
                    class: 'bg-black/40 backdrop-blur-xs',
                },
                header: {
                    class: 'relative p-0',
                },
                headerActions: {
                    class: 'absolute right-3 top-3 text-primary cursor-pointer outline-0',
                },
            }"
        >
            <template #header>
                <h3 class="bg-secondary p-3 text-primary text-center font-semibold rounded-t-lg">
                    DOCUMENTS
                </h3>
            </template>
            <div class="flex flex-col gap-2 bg-primary p-3">
                <p v-if="!documents.length" class="m-0 text-[#2c575e]">
                    No documents uploaded yet.
                </p>
                <Button
                    v-for="(doc, index) in documents"
                    :key="`${doc.name}-${index}`"
                    type="button"
                    class="bg-accent-muted p-2 rounded-md text-dark flex items-center justify-between"
                    @click="downloadDocument(doc)"
                >
                    <span>{{ doc.name }}</span>
                    <i class="pi pi-download"></i>
                </Button>
            </div>
        </Dialog>
    </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue"
import { AxiosError } from "axios"
import { useRoute, useRouter } from "vue-router"
import { getOfferDocuments } from "@/services/offer-documents"
import {
    TRANSPORT_TYPE,
    assignOfferToForm,
    createEmptyOfferForm,
    fetchOfferById,
    fetchOfferLookups,
    mapLookupOption,
} from "@/services/offers"
import StatusBadge from "@/components/StatusBadge.vue"

const sections = [
    { key: "general", title: "General Information" },
    { key: "route", title: "Route & Cargo Details" },
    { key: "dates", title: "Dates & Status" },
    { key: "additional", title: "Additional Details" },
]

const route = useRoute()
const router = useRouter()
const openSections = ref(sections.map((section) => section.key))
const form = reactive(createEmptyOfferForm())
const lookups = reactive({
    clients: [],
    tipus_transports: [],
    tipus_fluxes: [],
    tipus_carrega: [],
    tipus_contenidors: [],
    tipus_validacions: [],
    incoterms: [],
    aeroports: [],
    ports: [],
    transportistes: [],
    linies_transport_maritim: [],
})

const statusId = ref()
const statusLabel = ref("")
const loadError = ref("")
const documents = ref([])
const showDocumentsModal = ref(false)
const isLoading = ref(true)

const transportOptions = computed(() =>
    mapLookupOption(lookups.tipus_transports, (item) => item.tipus),
)
const flowOptions = computed(() => mapLookupOption(lookups.tipus_fluxes, (item) => item.tipus))
const cargoOptions = computed(() => mapLookupOption(lookups.tipus_carrega, (item) => item.tipus))
const containerOptions = computed(() =>
    mapLookupOption(lookups.tipus_contenidors, (item) => item.tipus),
)
const validationOptions = computed(() =>
    mapLookupOption(lookups.tipus_validacions, (item) => item.tipus),
)
const clientOptions = computed(() =>
    mapLookupOption(lookups.clients, (item) => `${item.nom} (${item.cif})`),
)
const carrierOptions = computed(() =>
    mapLookupOption(
        lookups.transportistes,
        (item) =>
            `${item.nom} - ${item.ciutat?.nom ?? "Unknown city"} (${item.ciutat?.pais?.nom ?? "Unknown country"})`,
    ),
)
const shippingLineOptions = computed(() =>
    mapLookupOption(
        lookups.linies_transport_maritim,
        (item) => `${item.nom} - ${item.ciutat?.nom ?? "Unknown city"}`,
    ),
)
const portOptions = computed(() =>
    mapLookupOption(
        lookups.ports,
        (item) =>
            `${item.nom} - ${item.ciutat?.nom ?? "Unknown city"} (${item.ciutat?.pais?.nom ?? "Unknown country"})`,
    ),
)
const airportOptions = computed(() =>
    mapLookupOption(
        lookups.aeroports,
        (item) =>
            `${item.codi?.trim() ?? ""} - ${item.nom} (${item.ciutat?.nom ?? "Unknown city"}, ${item.ciutat?.pais?.nom ?? "Unknown country"})`,
    ),
)
const incotermOptions = computed(() =>
    mapLookupOption(
        lookups.incoterms,
        (item) =>
            `${item.tipus_incoterm?.codi?.trim() ?? "N/A"} - ${item.tipus_incoterm?.nom ?? "Unknown incoterm"}${item.tracking_step?.nom ? ` | ${item.tracking_step.nom}` : ""}`,
    ),
)

const isMaritimeTransport = computed(
    () => Number(form.tipus_transport_id) === TRANSPORT_TYPE.MARITIME,
)
const isAirTransport = computed(() => Number(form.tipus_transport_id) === TRANSPORT_TYPE.AIR)

const goBack = () => {
    router.push({ name: "offers" })
}

const downloadDocument = (doc) => {
    const placeholderContent = `Document preview placeholder for ${doc.name}`
    const blob = new Blob([placeholderContent], { type: "text/plain" })
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = doc.name.replace(/\.pdf$/i, ".txt")
    link.click()
    URL.revokeObjectURL(objectUrl)
}

const loadPageData = async () => {
    loadError.value = ""

    try {
        const [lookupData, offer] = await Promise.all([
            fetchOfferLookups(),
            fetchOfferById(route.params.id),
        ])

        lookups.clients = lookupData.clients ?? []
        lookups.tipus_transports = lookupData.tipus_transports ?? []
        lookups.tipus_fluxes = lookupData.tipus_fluxes ?? []
        lookups.tipus_carrega = lookupData.tipus_carrega ?? []
        lookups.tipus_contenidors = lookupData.tipus_contenidors ?? []
        lookups.tipus_validacions = lookupData.tipus_validacions ?? []
        lookups.incoterms = lookupData.incoterms ?? []
        lookups.aeroports = lookupData.aeroports ?? []
        lookups.ports = lookupData.ports ?? []
        lookups.transportistes = lookupData.transportistes ?? []
        lookups.linies_transport_maritim = lookupData.linies_transport_maritim ?? []

        assignOfferToForm(form, offer)
        statusId.value = offer.estat_oferta_id
        statusLabel.value = offer.estat_oferta.estat
        documents.value = getOfferDocuments(offer.id)
        isLoading.value = false
    } catch (error) {
        if (error instanceof AxiosError) {
            loadError.value = error.response?.data?.message || "Unable to load offer."
        } else {
            loadError.value = "Unable to load offer."
        }
    }
}

onMounted(loadPageData)

watch(
    () => route.params.id,
    () => {
        showDocumentsModal.value = false
        loadPageData()
    },
)
</script>

<style scoped>
.fields-grid {
    display: grid;
    gap: 0.62rem 1.8rem;
}

.cols-3 {
    grid-template-columns: repeat(3, minmax(120px, 1fr));
}

.field-block {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
    margin-top: 1rem;

    input,
    [data-pc-name="select"] {
        display: flex;
        background-color: var(--color-primary);
        border-radius: 0px 12px 12px;
        padding: 12px;
        align-items: center;
        justify-content: space-between;
        box-shadow: 2px 2px 4px 1px rgb(124, 124, 124);
    }
}

.field-block span {
    background: #118c8c;
    color: #def5f5;
    padding: 0.3rem 3rem 0.3rem 0.8rem;
    width: fit-content;
    min-width: 66px;
    border-radius: 12px 12px 0 0;
    text-align: start;
}

@media (max-width: 960px) {
    .cols-3 {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 700px) {
    .cols-3 {
        grid-template-columns: 1fr;
    }

    .fields-grid {
        gap: 0.55rem;
    }
}
</style>
