<template>
    <section class="create-offer-page bg-primary!">
        <header class="offer-topbar">
            <Button icon="pi pi-arrow-left" text class="back-btn" type="button" @click="goBack" />

            <div class="topbar-right">
                <span v-if="statusLabel" class="status-badge">{{ statusLabel }}</span>
            </div>
        </header>

        <p v-if="loadError" class="feedback-message feedback-error">{{ loadError }}</p>

        <Accordion v-model:value="openSections" multiple class="offer-accordion">
            <AccordionPanel
                v-for="section in sections"
                :key="section.key"
                :value="section.key"
                class="bg-accent-muted mt-10 rounded-lg"
            >
                <AccordionHeader
                    class="bg-accent w-full text-left px-4 py-4 text-primary flex justify-between rounded-lg items-center cursor-pointer hover:bg-secondary-muted transition-all duration-300 ease-in-out"
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
                        <label class="field-block field-block-full">
                            <span>Comments</span>
                            <Textarea
                                v-model="form.comentaris"
                                rows="4"
                                autoResize
                                class="bg-primary rounded-b-xl rounded-tr-xl shadow-lg px-4 py-2 max-h-50 outline-0 input-shadow"
                                disabled
                            />
                        </label>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>

        <footer class="offer-footer">
            <div class="footer-left">
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
            class="documents-dialog"
            :draggable="false"
        >
            <template #header>
                <div class="documents-header">
                    <h3>DOCUMENTS</h3>
                </div>
            </template>

            <div class="documents-list">
                <p v-if="!documents.length" class="documents-empty">No documents uploaded yet.</p>
                <Button
                    v-for="(doc, index) in documents"
                    :key="`${doc.name}-${index}`"
                    type="button"
                    class="document-item"
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

const statusLabel = ref("Pending")
const loadError = ref("")
const documents = ref([])
const showDocumentsModal = ref(false)

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
        statusLabel.value = offer.estat_oferta?.estat ?? "Pending"
        documents.value = getOfferDocuments(offer.id)
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
.create-offer-page {
    min-height: 100vh;
    background: #e8e8dd;
    padding: 1rem 1rem 2rem;
}

.offer-topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.85rem;
}

.topbar-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.status-badge {
    background: #1f7a8c;
    color: #fff;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    text-transform: capitalize;
}

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
        border-radius: 0px 8px 8px;
        padding: 12px;
        align-items: center;
        justify-content: space-between;
        box-shadow: 2px 2px 4px 1px rgb(124, 124, 124);
    }
}

.field-block-full {
    grid-column: 1 / -1;
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

.offer-footer {
    margin-top: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.8rem;
}

.feedback-message {
    margin-top: 0.45rem;
}

.feedback-error {
    color: #b42318;
}

.documents-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-height: 210px;
}

.documents-empty {
    margin: 0;
    color: #2c575e;
}

.documents-header h3 {
    margin: 0;
    letter-spacing: 0.4px;
    font-weight: 600;
}

.input-shadow {
    box-shadow: 2px 2px 4px 1px rgb(124, 124, 124);
}

:deep(.back-btn.p-button) {
    border: none;
    background: transparent;
    color: #118c8c;
    font-weight: 900;
    line-height: 1;
    text-shadow: 0 1px 0 rgba(4, 53, 53, 0.25);
    padding: 0;
    min-width: 24px;
}

:deep(.offer-accordion.p-accordion) {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
}

:deep(.offer-accordion .p-accordionpanel) {
    background: #abd2c7;
    border-radius: 8px;
    overflow: hidden;
    border: none;
}

:deep(.offer-accordion .p-accordionheader) {
    background: #118c8c;
    color: #e9f6f5;
}

:deep(.offer-accordion .p-accordionheader-content) {
    padding: 0.52rem 0.8rem;
}

:deep(.offer-accordion .p-accordionheader-toggle-icon) {
    color: #e9f6f5;
}

:deep(.offer-accordion .p-accordioncontent-content) {
    padding: 0.72rem 0.9rem 0.95rem;
    background: #abd2c7;
}

:deep(.field-block .p-inputtext),
:deep(.field-block .p-textarea),
:deep(.field-block .p-select) {
    border: none;
    border-radius: 5px;
    background: #ece9dd;
    min-height: 40px;
    padding: 0.28rem 0.42rem;
    color: #183e44;
    box-shadow: none;
    width: 100%;
}

:deep(.field-block .p-select-label),
:deep(.field-block .p-select-dropdown) {
    color: #183e44;
}

:deep(.field-block .p-textarea) {
    min-height: 64px;
    resize: vertical;
}

:deep(.docs-btn.p-button) {
    border: none;
    background: #053741;
    color: #fff;
    border-radius: 5px;
    padding: 0.42rem 0.9rem;
}

:deep(.documents-dialog.p-dialog) {
    width: min(520px, 100%);
}

:deep(.documents-dialog .p-dialog-content) {
    background: #ece9dd;
    padding: 0.8rem;
}

:deep(.documents-dialog .p-dialog-header) {
    background: #0a4d57;
    color: #fff;
    padding: 0.42rem 0.65rem;
}

:deep(.documents-dialog .p-dialog-title) {
    width: 100%;
}

:deep(.documents-dialog .p-dialog-header-icon) {
    color: #fff;
}

:deep(.document-item.p-button) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: none;
    background: #abd2c7;
    color: #11444d;
    border-radius: 4px;
    padding: 0.45rem 0.6rem;
}

@media (max-width: 960px) {
    .cols-3 {
        grid-template-columns: 1fr 1fr;
    }

    .field-block-full {
        grid-column: 1 / -1;
    }
}

@media (max-width: 700px) {
    .create-offer-page {
        padding: 0.85rem 0.75rem 1.8rem;
    }

    .cols-3 {
        grid-template-columns: 1fr;
    }

    .fields-grid {
        gap: 0.55rem;
    }

    .offer-footer {
        display: grid;
        grid-template-columns: 1fr;
    }

    :deep(.docs-btn.p-button) {
        width: 100%;
    }
}
</style>
