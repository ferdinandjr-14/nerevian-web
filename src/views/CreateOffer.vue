<template>
    <section class="create-offer-page">
        <header class="offer-topbar">
            <Button icon="pi pi-arrow-left" text class="back-btn" type="button" @click="goBack" />

            <div class="topbar-right">
                <span v-if="isAccepted" class="accepted-badge">Accepted</span>
                <span v-if="isAccepted" class="accepted-check">
                    <i class="pi pi-check"></i>
                </span>
                <Button label="Reset" type="button" class="reset-btn" @click="resetOffer" />
            </div>
        </header>

        <Accordion v-model:value="openSections" multiple class="offer-accordion">
            <AccordionPanel v-for="section in sections" :key="section.key" :value="section.key">
                <AccordionHeader>{{ section.title }}</AccordionHeader>
                <AccordionContent>
                    <div v-if="section.key === 'general'" class="fields-grid cols-3">
                        <label class="field-block">
                            <span>Commercial Offer ID</span>
                            <InputText v-model="form.commercialOfferId" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Customer</span>
                            <InputText v-model="form.customer" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Customer Reference</span>
                            <InputText v-model="form.customerReference" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Sales Representative</span>
                            <InputText v-model="form.salesRepresentative" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Contact Name</span>
                            <InputText v-model="form.contactName" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Group By Party Type</span>
                            <InputText v-model="form.groupByPartyType" type="text" />
                        </label>
                    </div>

                    <div v-if="section.key === 'route'" class="fields-grid cols-3">
                        <label class="field-block">
                            <span>Transport Mode</span>
                            <InputText v-model="form.transportMode" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Flow</span>
                            <InputText v-model="form.flow" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Incoterm</span>
                            <InputText v-model="form.incoterm" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Port Of Origin</span>
                            <InputText v-model="form.portOrigin" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Port Of Destination</span>
                            <InputText v-model="form.portDestination" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Shipping Line</span>
                            <InputText v-model="form.shippingLine" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Inland Carrier</span>
                            <InputText v-model="form.inlandCarrier" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Cargo Type</span>
                            <InputText v-model="form.cargoType" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Gross Weight (kg)</span>
                            <InputText v-model="form.grossWeight" type="text" />
                        </label>
                    </div>

                    <div v-if="section.key === 'dates'" class="fields-grid cols-3 dates-grid">
                        <label class="field-block">
                            <span>Created Date</span>
                            <InputText v-model="form.createdDateStart" type="text" />
                        </label>
                        <label class="field-block secondary-date">
                            <span>&nbsp;</span>
                            <InputText v-model="form.createdDateEnd" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Status</span>
                            <InputText v-model="form.status" type="text" />
                        </label>

                        <label class="field-block">
                            <span>Validity Period</span>
                            <InputText v-model="form.validityStart" type="text" />
                        </label>
                        <label class="field-block secondary-date">
                            <span>&nbsp;</span>
                            <InputText v-model="form.validityEnd" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Reject Reason</span>
                            <InputText v-model="form.rejectReason" type="text" />
                        </label>
                    </div>

                    <div v-if="section.key === 'additional'" class="fields-grid cols-3">
                        <label class="field-block">
                            <span>Volume</span>
                            <InputText v-model="form.volume" type="text" />
                        </label>
                        <label class="field-block">
                            <span>Profit Center</span>
                            <InputText v-model="form.profitCenter" type="text" />
                        </label>
                        <div></div>
                        <label class="field-block field-block-full">
                            <span>Comments</span>
                            <Textarea v-model="form.comments" rows="3" autoResize />
                        </label>
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>

        <footer class="offer-footer">
            <input
                ref="fileInputRef"
                type="file"
                multiple
                class="hidden-file-input"
                @change="handleDocumentsUpload"
            />

            <div class="footer-left">
                <Button
                    v-if="!isAccepted"
                    icon="pi pi-upload"
                    label="UPLOAD DOCUMENTS"
                    type="button"
                    class="docs-btn"
                    @click="openFilePicker"
                />
                <Button
                    v-else
                    icon="pi pi-eye"
                    label="CHECK DOCUMENTS"
                    type="button"
                    class="docs-btn"
                    @click="openDocumentsModal"
                />
            </div>

            <div class="footer-right">
                <Button
                    v-if="!isAccepted"
                    label="SUBMIT"
                    type="button"
                    class="submit-btn"
                    @click="submitOffer"
                />
            </div>
        </footer>

        <p v-if="uploadFeedback" class="upload-feedback">{{ uploadFeedback }}</p>

        <Dialog v-model:visible="showDocumentsModal" modal class="documents-dialog" :draggable="false">
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
import { reactive, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { createEmptyOfferForm, getOfferById, OFFER_STATUS_IDS } from "../data/offers"

const route = useRoute()
const router = useRouter()

const sections = [
    { key: "general", title: "General Information" },
    { key: "route", title: "Route & Cargo Details" },
    { key: "dates", title: "Dates & Status" },
    { key: "additional", title: "Additional Details" },
]

const openSections = ref(sections.map((section) => section.key))
const form = reactive(createEmptyOfferForm())
const isAccepted = ref(false)
const documents = ref([])
const uploadFeedback = ref("")
const showDocumentsModal = ref(false)
const fileInputRef = ref(null)

const applyFormData = (source) => {
    const nextData = source || createEmptyOfferForm()
    Object.keys(form).forEach((key) => {
        form[key] = nextData[key] || ""
    })
}

const mapDocuments = (sourceDocuments = []) =>
    sourceDocuments.map((docName) => ({
        name: docName,
        file: null,
        isPreset: true,
    }))

const loadOfferFromRoute = () => {
    const offerId = typeof route.query.offerId === "string" ? route.query.offerId : ""
    const selectedOffer = offerId ? getOfferById(offerId) : null

    if (!selectedOffer) {
        applyFormData(createEmptyOfferForm())
        documents.value = []
        isAccepted.value = false
        uploadFeedback.value = ""
        return
    }

    applyFormData(selectedOffer.formData)
    documents.value = mapDocuments(selectedOffer.documents)
    isAccepted.value = selectedOffer.estatOfertaId === OFFER_STATUS_IDS.ACCEPTED
    uploadFeedback.value = documents.value.length ? `${documents.value.length} document(s) loaded.` : ""
}

watch(() => route.query.offerId, loadOfferFromRoute, { immediate: true })

const goBack = () => {
    router.push({ name: "offers" })
}

const resetOffer = () => {
    applyFormData(createEmptyOfferForm())
    documents.value = []
    isAccepted.value = false
    uploadFeedback.value = ""
    showDocumentsModal.value = false
    openSections.value = sections.map((section) => section.key)
    router.replace({ name: "create-offer" })
}

const openFilePicker = () => {
    if (fileInputRef.value) fileInputRef.value.click()
}

const handleDocumentsUpload = (event) => {
    const fileList = event.target.files
    if (!fileList || !fileList.length) return

    const nextDocuments = Array.from(fileList).map((file) => ({
        name: file.name,
        file,
        isPreset: false,
    }))

    documents.value = [...documents.value, ...nextDocuments]
    uploadFeedback.value = `${nextDocuments.length} document(s) uploaded.`
    event.target.value = ""
}

const ensureCommercialOfferId = () => {
    if (form.commercialOfferId) return
    form.commercialOfferId = `OFF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
}

const submitOffer = () => {
    ensureCommercialOfferId()
    form.status = "Accepted"
    isAccepted.value = true
    uploadFeedback.value = "Offer accepted successfully."
}

const openDocumentsModal = () => {
    showDocumentsModal.value = true
}

const downloadDocument = (doc) => {
    if (doc.file) {
        const objectUrl = URL.createObjectURL(doc.file)
        const link = document.createElement("a")
        link.href = objectUrl
        link.download = doc.name
        link.click()
        URL.revokeObjectURL(objectUrl)
        return
    }

    const placeholderContent = `Document preview placeholder for ${doc.name}`
    const blob = new Blob([placeholderContent], { type: "text/plain" })
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = doc.name.replace(/\.pdf$/i, ".txt")
    link.click()
    URL.revokeObjectURL(objectUrl)
}
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
    gap: 0.4rem;
}

.accepted-badge {
    background: #1fa850;
    color: #fff;
    padding: 0.16rem 0.5rem;
    border-radius: 4px;
    text-transform: capitalize;
}

.accepted-check {
    background: #0d8e45;
    color: #fff;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
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
    gap: 0.2rem;
}

.field-block span {
    background: #118c8c;
    color: #def5f5;
    border-radius: 4px 4px 0 0;
    padding: 0.14rem 0.3rem;
    width: fit-content;
    min-width: 66px;
}

.field-block-full {
    grid-column: 1 / -1;
}

.secondary-date {
    align-self: end;
}

.offer-footer {
    margin-top: 0.45rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.8rem;
}

.hidden-file-input {
    display: none;
}

.upload-feedback {
    margin-top: 0.45rem;
    color: #1c5259;
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

:deep(.reset-btn.p-button) {
    border: 1px solid #7f9da1;
    background: #f8fbfb;
    color: #496c71;
    border-radius: 4px;
    padding: 0.18rem 0.45rem;
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
:deep(.field-block .p-textarea) {
    border: none;
    border-radius: 5px;
    background: #ece9dd;
    min-height: 24px;
    padding: 0.28rem 0.42rem;
    color: #183e44;
    box-shadow: none;
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

:deep(.submit-btn.p-button) {
    border: none;
    background: #ff6666;
    color: #fff;
    border-radius: 5px;
    padding: 0.42rem 1.55rem;
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

.documents-header h3 {
    margin: 0;
    letter-spacing: 0.4px;
    font-weight: 600;
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

    :deep(.docs-btn.p-button),
    :deep(.submit-btn.p-button) {
        width: 100%;
    }
}
</style>
