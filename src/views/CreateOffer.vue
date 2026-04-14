<template>
    <p v-if="loadError" class="mt-[0.45rem] text-[#b42318]">{{ loadError }}</p>
    <div v-else-if="isLoadingLookups" class="flex items-center gap-2">
        <span
            class="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
        Loading data...
    </div>
    <section
        v-else
        class="create-offer-page bg-primary! max-[700px]:px-3 max-[700px]:pt-[0.85rem] max-[700px]:pb-[1.8rem]"
    >
        <header class="flex justify-between mt-5 items-center">
            <Button
                icon="pi pi-arrow-left"
                text
                class="cursor-pointer"
                type="button"
                @click="router.push({ name: 'offers' })"
            />
            <Button
                label="Reset"
                type="button"
                class="cursor-pointer bg-danger text-primary px-6 py-2 rounded-full"
                @click="resetOffer"
            />
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
                                placeholder="Select client"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block">
                            <span>Transport Type</span>
                            <Select
                                v-model="form.tipus_transport_id"
                                :options="transportOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select transport"
                                class="w-full"
                                :pt="selectPT"
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
                                placeholder="Select flow"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block">
                            <span>Cargo Type</span>
                            <Select
                                v-model="form.tipus_carrega_id"
                                :options="cargoOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select cargo type"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block">
                            <span>Incoterm</span>
                            <Select
                                v-model="form.incoterm_id"
                                :options="incotermOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select incoterm"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block">
                            <span>Validation Type</span>
                            <Select
                                v-model="form.tipus_validacio_id"
                                :options="validationOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select validation"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block">
                            <span>Price</span>
                            <InputText v-model="form.preu" type="number" min="0" step="0.01" />
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
                                placeholder="Select carrier"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block" v-if="isMaritimeTransport">
                            <span>Port of Origin</span>
                            <Select
                                v-model="form.port_origen_id"
                                :options="portOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select origin port"
                                class="w-full"
                                filter
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block" v-if="isMaritimeTransport">
                            <span>Port of Destination</span>
                            <Select
                                v-model="form.port_desti_id"
                                :options="portOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select destination port"
                                class="w-full"
                                filter
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block">
                            <span>Shipping Line</span>
                            <Select
                                v-model="form.linia_transport_maritim_id"
                                :options="shippingLineOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select shipping line"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block">
                            <span>Container Type</span>
                            <Select
                                v-model="form.tipus_contenidor_id"
                                :options="containerOptions"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Select container type"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block">
                            <span>Gross Weight (kg)</span>
                            <InputText v-model="form.pes_brut" type="number" min="0" step="0.01" />
                        </label>
                        <label class="field-block">
                            <span>Volume (m3)</span>
                            <InputText v-model="form.volum" type="number" min="0" step="0.01" />
                        </label>
                    </div>

                    <div v-if="section.key === 'dates'" class="fields-grid cols-3">
                        <label class="field-block">
                            <span>Created Date</span>
                            <InputText v-model="form.data_creacio" type="date" />
                        </label>
                        <label class="field-block">
                            <span>Validity Start</span>
                            <InputText v-model="form.data_validessa_inicial" type="date" />
                        </label>
                        <label class="field-block">
                            <span>Validity End</span>
                            <InputText v-model="form.data_validessa_fina" type="date" />
                        </label>
                        <label class="field-block">
                            <span>Status</span>
                            <InputText modelValue="Pending" type="text" disabled />
                        </label>
                    </div>

                    <div v-if="section.key === 'additional'" class="fields-grid cols-3">
                        <label class="field-block">
                            <span>Commercial</span>
                            <Select
                                v-model="form.agent_comercial_id"
                                :options="commercials"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Assign commercial"
                                class="w-full"
                                :pt="selectPT"
                            />
                        </label>
                        <label class="field-block col-span-full">
                            <span>Comments</span>
                            <Textarea
                                v-model="form.comentaris"
                                rows="4"
                                autoResize
                                class="bg-primary rounded-b-xl rounded-tr-xl shadow-[2px_2px_4px_1px_rgb(124,124,124)] px-4 py-2 max-h-50 outline-0"
                            />
                        </label>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>

        <footer class="mt-12 flex justify-between items-center gap-3.5 pb-40">
            <div>
                <input
                    ref="fileInputRef"
                    type="file"
                    multiple
                    class="hidden"
                    @change="handleDocumentsUpload"
                />
                <Button
                    icon="pi pi-upload"
                    label="UPLOAD DOCUMENTS"
                    type="button"
                    class="p-2 bg-accent text-primary rounded-lg px-4 flex items-center gap-2 cursor-pointer"
                    @click="fileInputRef.click()"
                />
            </div>
            <div>
                <Button
                    label="SUBMIT"
                    type="button"
                    class="cursor-pointer bg-danger px-5 py-2 text-primary rounded-lg flex items-center justify-center gap-3"
                    :disabled="isSubmitting"
                    :loading="isSubmitting"
                    @click="submitOffer"
                />
            </div>
        </footer>

        <p v-if="uploadFeedback" class="mt-[0.45rem] text-secondary">{{ uploadFeedback }}</p>
        <p v-if="submitError" class="mt-[0.45rem] text-red-500">{{ submitError }}</p>

        <Dialog
            v-model:visible="showDocumentsModal"
            modal
            class="pb-5 min-h-100 min-w-100 rounded-lg bg-primary"
            :draggable="false"
            :pt="{
                mask: { class: 'bg-black/40 backdrop-blur-xs' },
                header: { class: 'relative p-0' },
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
                    class="bg-accent-muted p-2 rounded-md text-dark flex items-center justify-between cursor-pointer"
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
import { useRouter } from "vue-router"
import {
    TRANSPORT_TYPE,
    clearTransportSpecificFields,
    createOffer,
    createEmptyOfferForm,
    createOfferPayload,
    fetchOfferLookups,
    mapLookupOption,
} from "@/services/offers"
import { uploadOfferDocuments } from "@/services/offer-documents"

const sections = [
    { key: "general", title: "General Information" },
    { key: "route", title: "Route & Cargo Details" },
    { key: "dates", title: "Dates & Status" },
    { key: "additional", title: "Additional Details" },
]

const router = useRouter()
const openSections = ref(sections.map((s) => s.key))
const form = reactive(createEmptyOfferForm())
const lookups = reactive({
    clients: [],
    commercials: [],
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

const isLoadingLookups = ref(true)
const isSubmitting = ref(false)
const loadError = ref("")
const submitError = ref("")
const uploadFeedback = ref("")
const documents = ref([])
const showDocumentsModal = ref(false)
const fileInputRef = ref(null)

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
const commercials = computed(() =>
    mapLookupOption(lookups.commercials, (item) => `${item.nom} ${item.cognoms}`),
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

watch(
    () => form.tipus_transport_id,
    () => clearTransportSpecificFields(form),
)

const loadLookups = async () => {
    isLoadingLookups.value = true
    loadError.value = ""

    try {
        const data = await fetchOfferLookups()
        lookups.clients = data.clients ?? []
        lookups.commercials = data.commercials ?? []
        lookups.tipus_transports = data.tipus_transports ?? []
        lookups.tipus_fluxes = data.tipus_fluxes ?? []
        lookups.tipus_carrega = data.tipus_carrega ?? []
        lookups.tipus_contenidors = data.tipus_contenidors ?? []
        lookups.tipus_validacions = data.tipus_validacions ?? []
        lookups.incoterms = data.incoterms ?? []
        lookups.aeroports = data.aeroports ?? []
        lookups.ports = data.ports ?? []
        lookups.transportistes = data.transportistes ?? []
        lookups.linies_transport_maritim = data.linies_transport_maritim ?? []
    } catch (error) {
        loadError.value = error.response?.data?.message || "Unable to load offer data."
    } finally {
        isLoadingLookups.value = false
    }
}

const resetOffer = () => {
    Object.assign(form, createEmptyOfferForm())
    documents.value = []
    uploadFeedback.value = ""
    submitError.value = ""
    showDocumentsModal.value = false
    openSections.value = sections.map((s) => s.key)
}

const handleDocumentsUpload = (event) => {
    const fileList = event.target.files
    if (!fileList?.length) return

    const newDocs = Array.from(fileList).map((file) => ({ name: file.name, file }))
    documents.value = [...documents.value, ...newDocs]
    uploadFeedback.value = `${newDocs.length} document(s) uploaded.`
    showDocumentsModal.value = true
    event.target.value = ""
}

const downloadDocument = (doc) => {
    const objectUrl = URL.createObjectURL(doc.file)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = doc.name
    link.click()
    URL.revokeObjectURL(objectUrl)
}

const submitOffer = async () => {
    isSubmitting.value = true
    submitError.value = ""

    try {
        const offer = await createOffer(createOfferPayload(form))

        if (offer?.id && documents.value.length) {
            try {
                await uploadOfferDocuments(
                    offer.id,
                    documents.value.map((document) => document.file),
                )
            } catch (error) {
                const fieldErrors = error.response?.data?.errors
                const firstError = fieldErrors
                    ? Object.values(fieldErrors).flat().find(Boolean)
                    : null
                submitError.value =
                    firstError ||
                    error.response?.data?.message ||
                    "Offer created, but the documents could not be uploaded."
                await router.push({ name: "offer-detail", params: { id: String(offer.id) } })
                return
            }
        }

        if (offer?.id) {
            router.push({ name: "offer-detail", params: { id: String(offer.id) } })
        }
    } catch (error) {
        const fieldErrors = error.response?.data?.errors
        const firstError = fieldErrors ? Object.values(fieldErrors).flat().find(Boolean) : null
        submitError.value = firstError || error.response?.data?.message || "Unable to save offer."
    } finally {
        isSubmitting.value = false
    }
}

onMounted(loadLookups)

const selectPT = {
    listcontainer: {
        class: "max-h-60 overflow-y-auto border",
    },
    list: {
        class: "p-0",
    },
    header: {
        class: "border-b bg-white",
    },
    pcfiltercontainer: {
        root: {
            class: "relative flex items-center w-full",
        },
    },
    pcfilter: {
        root: {
            class: [
                "w-full bg-transparent",
                "pl-9 pr-3 py-2 text-sm",
                "text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]",
                "outline-none focus:ring-0",
            ],
        },
    },
    pcfiltericoncontainer: {
        root: {
            class: [
                "absolute left-3 top-1/2 -translate-y-1/2",
                "pointer-events-none text-[var(--color-text-muted)]",
            ],
        },
    },
    option: {
        class: "bg-white px-4 py-2 hover:bg-gray-200 cursor-pointer",
    },
}
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
