<template>
  <p v-if="pageError" class="mb-4 text-red-600">{{ pageError }}</p>
  <div v-if="isLoading" class="mt-5 flex items-center gap-2">
    <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
    Loading incoterms...
  </div>

  <section v-else class="pb-10">
    <IncotermsTable
      :incoterms="incoterms"
      @create="openCreateModal"
      @edit="openEditModal"
      @delete="openDeleteConfirm"
    />

    <IncotermForm
      v-model:visible="showIncotermModal"
      :incoterm="selectedIncoterm"
      :trackingSteps="trackingSteps"
      :isEditing="isEditing"
      :saving="isSubmitting"
      :serverError="submitError"
      @save="handleFormSave"
      @close="(bySave) => { if (bySave) loadData() }"
    />

    <Dialog v-model:visible="showDeleteConfirm" modal header="CONFIRM DELETE" :draggable="false" :pt="dialogPT">
      <p class="text-dark">Are you sure you want to delete this incoterm?</p>
      <template #footer>
        <Button label="CANCEL" type="button" severity="secondary" class="cursor-pointer rounded-lg border-0 px-6 py-2" @click="showDeleteConfirm = false" />
        <Button label="DELETE" type="button" severity="danger" :disabled="isSubmitting" class="cursor-pointer rounded-lg border-0 bg-danger px-6 py-2 font-medium text-white" @click="confirmDelete" />
      </template>
    </Dialog>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue"
import IncotermsTable from "@/components/IncotermsTable.vue"
import IncotermForm from "@/components/IncotermForm.vue"
import Dialog from "primevue/dialog"
import Button from "primevue/button"
import { fetchIncoterms, fetchTrackingSteps, createIncoterm, updateIncoterm, deleteIncoterm } from "@/services/incoterms"

const incoterms = ref([])
const trackingSteps = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const pageError = ref("")
const submitError = ref("")
const showIncotermModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const selectedIncoterm = ref(null)

const dialogPT = {
  header: { class: "bg-secondary border-b border-secondary-muted rounded-t-xl" },
  content: { class: "bg-primary" },
  footer: { class: "bg-primary border-t border-secondary-muted flex justify-end gap-2" },
}

const loadData = async () => {
  try {
    isLoading.value = true
    pageError.value = ""
    const [incData, steps] = await Promise.all([fetchIncoterms(), fetchTrackingSteps()])
    incoterms.value = incData
    trackingSteps.value = steps
  } catch (err) {
    pageError.value = err.message || "Failed to load data"
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const firstErrorMessage = (error, fallbackMessage) => {
  const validationErrors = error.response?.data?.errors

  if (validationErrors && typeof validationErrors === "object") {
    const firstFieldErrors = Object.values(validationErrors)[0]

    if (Array.isArray(firstFieldErrors) && firstFieldErrors.length) {
      return firstFieldErrors[0]
    }
  }

  return error.response?.data?.message || fallbackMessage
}

const openCreateModal = () => {
  isEditing.value = false
  selectedIncoterm.value = null
  submitError.value = ""
  showIncotermModal.value = true
}

const openEditModal = (inc) => {
  isEditing.value = true
  selectedIncoterm.value = inc
  submitError.value = ""
  showIncotermModal.value = true
}

const openDeleteConfirm = (inc) => {
  selectedIncoterm.value = inc
  showDeleteConfirm.value = true
}

const handleFormSave = async (formData) => {
  try {
    submitError.value = ""
    isSubmitting.value = true
    if (isEditing.value && selectedIncoterm.value) {
      await updateIncoterm(selectedIncoterm.value.id, formData)
    } else {
      await createIncoterm(formData)
    }
    showIncotermModal.value = false
    await loadData()
  } catch (err) {
    submitError.value = firstErrorMessage(err, "Unable to save incoterm.")
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = async () => {
  try {
    isSubmitting.value = true
    await deleteIncoterm(selectedIncoterm.value.id)
    showDeleteConfirm.value = false
    await loadData()
  } catch (err) {
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadData)
</script>
