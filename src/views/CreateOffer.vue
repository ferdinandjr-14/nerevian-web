<template>
	<section class="create-offer-page">
		<header class="offer-topbar">
			<button class="back-btn" type="button" @click="goBack">←</button>

			<div class="topbar-right">
				<span v-if="isAccepted" class="accepted-badge">Accepted</span>
				<span v-if="isAccepted" class="accepted-check">✓</span>
				<button class="reset-btn" type="button" @click="resetOffer">Reset</button>
			</div>
		</header>

		<section v-for="section in sections" :key="section.key" class="form-section">
			<button class="section-header" type="button" @click="toggleSection(section.key)">
				<span>{{ section.title }}</span>
				<span :class="['header-chevron', { up: openedSections[section.key] }]">⌄</span>
			</button>

			<div v-if="openedSections[section.key]" class="section-content">
				<div v-if="section.key === 'general'" class="fields-grid cols-3">
					<label class="field-block">
						<span>Commercial Offer ID</span>
						<input v-model="form.commercialOfferId" type="text" />
					</label>
					<label class="field-block">
						<span>Customer</span>
						<input v-model="form.customer" type="text" />
					</label>
					<label class="field-block">
						<span>Customer Reference</span>
						<input v-model="form.customerReference" type="text" />
					</label>
					<label class="field-block">
						<span>Sales Representative</span>
						<input v-model="form.salesRepresentative" type="text" />
					</label>
					<label class="field-block">
						<span>Contact Name</span>
						<input v-model="form.contactName" type="text" />
					</label>
					<label class="field-block">
						<span>Group By Party Type</span>
						<input v-model="form.groupByPartyType" type="text" />
					</label>
				</div>

				<div v-if="section.key === 'route'" class="fields-grid cols-3">
					<label class="field-block">
						<span>Transport Mode</span>
						<input v-model="form.transportMode" type="text" />
					</label>
					<label class="field-block">
						<span>Flow</span>
						<input v-model="form.flow" type="text" />
					</label>
					<label class="field-block">
						<span>Incoterm</span>
						<input v-model="form.incoterm" type="text" />
					</label>
					<label class="field-block">
						<span>Port Of Origin</span>
						<input v-model="form.portOrigin" type="text" />
					</label>
					<label class="field-block">
						<span>Port Of Destination</span>
						<input v-model="form.portDestination" type="text" />
					</label>
					<label class="field-block">
						<span>Shipping Line</span>
						<input v-model="form.shippingLine" type="text" />
					</label>
					<label class="field-block">
						<span>Inland Carrier</span>
						<input v-model="form.inlandCarrier" type="text" />
					</label>
					<label class="field-block">
						<span>Cargo Type</span>
						<input v-model="form.cargoType" type="text" />
					</label>
					<label class="field-block">
						<span>Gross Weight (kg)</span>
						<input v-model="form.grossWeight" type="text" />
					</label>
				</div>

				<div v-if="section.key === 'dates'" class="fields-grid cols-3 dates-grid">
					<label class="field-block">
						<span>Created Date</span>
						<input v-model="form.createdDateStart" type="text" />
					</label>
					<label class="field-block secondary-date">
						<span>&nbsp;</span>
						<input v-model="form.createdDateEnd" type="text" />
					</label>
					<label class="field-block">
						<span>Status</span>
						<input v-model="form.status" type="text" />
					</label>

					<label class="field-block">
						<span>Validity Period</span>
						<input v-model="form.validityStart" type="text" />
					</label>
					<label class="field-block secondary-date">
						<span>&nbsp;</span>
						<input v-model="form.validityEnd" type="text" />
					</label>
					<label class="field-block">
						<span>Reject Reason</span>
						<input v-model="form.rejectReason" type="text" />
					</label>
				</div>

				<div v-if="section.key === 'additional'" class="fields-grid cols-3">
					<label class="field-block">
						<span>Volume</span>
						<input v-model="form.volume" type="text" />
					</label>
					<label class="field-block">
						<span>Profit Center</span>
						<input v-model="form.profitCenter" type="text" />
					</label>
					<div></div>
					<label class="field-block field-block-full">
						<span>Comments</span>
						<textarea v-model="form.comments" rows="3"></textarea>
					</label>
				</div>
			</div>
		</section>

		<footer class="offer-footer">
			<input
				ref="fileInputRef"
				type="file"
				multiple
				class="hidden-file-input"
				@change="handleDocumentsUpload"
			/>

			<div class="footer-left">
				<button v-if="!isAccepted" class="docs-btn" type="button" @click="openFilePicker">
					↥ UPLOAD DOCUMENTS
				</button>
				<button v-else class="docs-btn" type="button" @click="openDocumentsModal">👁 CHECK DOCUMENTS</button>
			</div>

			<div class="footer-right">
				<button v-if="!isAccepted" class="submit-btn" type="button" @click="submitOffer">SUBMIT</button>
			</div>
		</footer>

		<p v-if="uploadFeedback" class="upload-feedback">{{ uploadFeedback }}</p>

		<div v-if="showDocumentsModal" class="documents-overlay" @click.self="closeDocumentsModal">
			<div class="documents-modal">
				<header class="documents-header">
					<h3>DOCUMENTS</h3>
					<button type="button" class="close-modal-btn" @click="closeDocumentsModal">✕</button>
				</header>

				<div class="documents-list">
					<p v-if="!documents.length" class="documents-empty">No documents uploaded yet.</p>
					<button
						v-for="(doc, index) in documents"
						:key="`${doc.name}-${index}`"
						type="button"
						class="document-item"
						@click="downloadDocument(doc)"
					>
						<span>{{ doc.name }}</span>
						<span>⬇</span>
					</button>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createEmptyOfferForm, getOfferById } from '../data/offers'

const route = useRoute()
const router = useRouter()

const sections = [
	{ key: 'general', title: '◎ General Information' },
	{ key: 'route', title: '✈ Route & Cargo Details' },
	{ key: 'dates', title: '◷ Dates & Status' },
	{ key: 'additional', title: '☷ Additional Details' }
]

const openedSections = reactive({
	general: true,
	route: true,
	dates: true,
	additional: true
})

const form = reactive(createEmptyOfferForm())
const isAccepted = ref(false)
const documents = ref([])
const uploadFeedback = ref('')
const showDocumentsModal = ref(false)
const fileInputRef = ref(null)

const applyFormData = (source) => {
	const nextData = source || createEmptyOfferForm()
	Object.keys(form).forEach((key) => {
		form[key] = nextData[key] || ''
	})
}

const mapDocuments = (sourceDocuments = []) =>
	sourceDocuments.map((docName) => ({
		name: docName,
		file: null,
		isPreset: true
	}))

const loadOfferFromRoute = () => {
	const offerId = typeof route.query.offerId === 'string' ? route.query.offerId : ''
	const selectedOffer = offerId ? getOfferById(offerId) : null

	if (!selectedOffer) {
		applyFormData(createEmptyOfferForm())
		documents.value = []
		isAccepted.value = false
		uploadFeedback.value = ''
		return
	}

	applyFormData(selectedOffer.formData)
	documents.value = mapDocuments(selectedOffer.documents)
	isAccepted.value = selectedOffer.status === 'ACCEPTED'
	uploadFeedback.value = documents.value.length ? `${documents.value.length} document(s) loaded.` : ''
}

watch(() => route.query.offerId, loadOfferFromRoute, { immediate: true })

const toggleSection = (sectionKey) => {
	openedSections[sectionKey] = !openedSections[sectionKey]
}

const goBack = () => {
	router.push({ name: 'offers' })
}

const resetOffer = () => {
	applyFormData(createEmptyOfferForm())
	documents.value = []
	isAccepted.value = false
	uploadFeedback.value = ''
	showDocumentsModal.value = false
	router.replace({ name: 'create-offer' })
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
		isPreset: false
	}))

	documents.value = [...documents.value, ...nextDocuments]
	uploadFeedback.value = `${nextDocuments.length} document(s) uploaded.`
	event.target.value = ''
}

const ensureCommercialOfferId = () => {
	if (form.commercialOfferId) return
	form.commercialOfferId = `OFF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
}

const submitOffer = () => {
	ensureCommercialOfferId()
	form.status = 'Accepted'
	isAccepted.value = true
	uploadFeedback.value = 'Offer accepted successfully.'
}

const openDocumentsModal = () => {
	showDocumentsModal.value = true
}

const closeDocumentsModal = () => {
	showDocumentsModal.value = false
}

const downloadDocument = (doc) => {
	if (doc.file) {
		const objectUrl = URL.createObjectURL(doc.file)
		const link = document.createElement('a')
		link.href = objectUrl
		link.download = doc.name
		link.click()
		URL.revokeObjectURL(objectUrl)
		return
	}

	const placeholderContent = `Document preview placeholder for ${doc.name}`
	const blob = new Blob([placeholderContent], { type: 'text/plain' })
	const objectUrl = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = objectUrl
	link.download = doc.name.replace(/\.pdf$/i, '.txt')
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

.back-btn {
	border: none;
	background: transparent;
	color: #118c8c;
	font-size: 1.95rem;
	font-weight: 900;
	line-height: 1;
	text-shadow: 0 1px 0 rgba(4, 53, 53, 0.25);
	cursor: pointer;
	padding: 0;
}

.topbar-right {
	display: flex;
	align-items: center;
	gap: 0.4rem;
}

.accepted-badge {
	background: #1fa850;
	color: #fff;
	font-size: 0.58rem;
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
	font-size: 0.65rem;
	font-weight: 700;
}

.reset-btn {
	border: 1px solid #7f9da1;
	background: #f8fbfb;
	color: #496c71;
	font-size: 0.56rem;
	border-radius: 4px;
	padding: 0.18rem 0.45rem;
	cursor: pointer;
}

.form-section {
	background: #abd2c7;
	border-radius: 8px;
	margin-bottom: 0.8rem;
	overflow: hidden;
}

.section-header {
	width: 100%;
	border: none;
	background: #118c8c;
	color: #e9f6f5;
	padding: 0.52rem 0.8rem;
	font-size: 0.73rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	text-align: left;
}

.header-chevron {
	font-size: 1rem;
	line-height: 1;
	transition: transform 0.2s ease;
}

.header-chevron.up {
	transform: rotate(180deg);
}

.section-content {
	padding: 0.72rem 0.9rem 0.95rem;
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
	font-size: 0.52rem;
	border-radius: 4px 4px 0 0;
	padding: 0.14rem 0.3rem;
	width: fit-content;
	min-width: 66px;
}

.field-block input,
.field-block textarea {
	border: none;
	border-radius: 5px;
	background: #ece9dd;
	min-height: 24px;
	padding: 0.28rem 0.42rem;
	font-size: 0.62rem;
	color: #183e44;
	outline: none;
}

.field-block textarea {
	min-height: 64px;
	resize: vertical;
}

.field-block-full {
	grid-column: 1 / -1;
}

.dates-grid {
	position: relative;
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

.docs-btn {
	border: none;
	background: #053741;
	color: #fff;
	border-radius: 5px;
	font-size: 0.85rem;
	padding: 0.42rem 0.9rem;
	cursor: pointer;
}

.submit-btn {
	border: none;
	background: #ff6666;
	color: #fff;
	border-radius: 5px;
	font-size: 0.85rem;
	padding: 0.42rem 1.55rem;
	cursor: pointer;
}

.upload-feedback {
	margin-top: 0.45rem;
	font-size: 0.75rem;
	color: #1c5259;
}

.documents-overlay {
	position: fixed;
	inset: 0;
	background: rgba(8, 43, 49, 0.5);
	display: grid;
	place-items: center;
	z-index: 20;
	padding: 1rem;
}

.documents-modal {
	width: min(520px, 100%);
	background: #ece9dd;
	border-radius: 6px;
	padding: 0.8rem;
	box-shadow: 0 12px 26px rgba(0, 0, 0, 0.18);
}

.documents-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.5rem;
	background: #0a4d57;
	padding: 0.42rem 0.65rem;
	border-radius: 5px;
	color: #fff;
}

.documents-header h3 {
	margin: 0;
	font-size: 1.15rem;
	letter-spacing: 0.4px;
	font-weight: 600;
}

.close-modal-btn {
	border: none;
	background: transparent;
	color: #fff;
	font-size: 1rem;
	cursor: pointer;
}

.documents-list {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	min-height: 210px;
}

.documents-empty {
	margin: 0;
	font-size: 0.82rem;
	color: #2c575e;
}

.document-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: none;
	background: #abd2c7;
	color: #11444d;
	border-radius: 4px;
	padding: 0.45rem 0.6rem;
	font-size: 0.76rem;
	cursor: pointer;
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

	.cols-3,
	.offer-footer {
		grid-template-columns: 1fr;
	}

	.fields-grid {
		gap: 0.55rem;
	}

	.offer-footer {
		display: grid;
	}

	.docs-btn,
	.submit-btn {
		width: 100%;
	}
}
</style>