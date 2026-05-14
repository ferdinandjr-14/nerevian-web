<template>
    <p v-if="pageError" class="mb-4 text-red-600">{{ pageError }}</p>
    <div v-if="isLoading" class="mt-5 flex items-center gap-2">
        <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        Loading incoterms...
    </div>
    <section v-else class="pb-10">
        <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 class="text-2xl font-bold text-dark">Incoterms</h2>
            <Button
                label="ADD INCOTERM"
                type="button"
                class="cursor-pointer rounded-lg bg-danger px-10 py-2 text-white"
                @click="openCreateModal"
            />
        </div>

        <DataTable
            v-if="incoterms.length"
            scrollable
            scrollHeight="600px"
            :value="incoterms"
            dataKey="id"
            :pt="{
                root: { class: 'w-full bg-secondary rounded-xl overflow-hidden' },
                table: { class: 'w-full border-collapse' },
                thead: { class: 'border-b border-secondary-muted' },
                tbody: { class: 'divide-y divide-secondary-muted' },
            }"
        >
            <Column field="codi" header="Code" style="width: 15%">
                <template #body="slotProps">
                    <span class="font-medium text-dark">{{ slotProps.data.codi }}</span>
                </template>
            </Column>
            <Column field="nom" header="Name" style="width: 40%">
                <template #body="slotProps">
                    {{ slotProps.data.nom }}
                </template>
            </Column>
            <Column field="tracking_steps" header="Tracking Steps" style="width: 30%">
                <template #body="slotProps">
                    <div v-if="slotProps.data.tracking_steps.length" class="flex flex-wrap gap-1">
                        <span
                            v-for="step in slotProps.data.tracking_steps"
                            :key="step.id"
                            class="rounded bg-accent-light px-2 py-1 text-xs text-dark"
                        >
                            {{ step.nom }}
                        </span>
                    </div>
                    <span v-else class="text-secondary">-</span>
                </template>
            </Column>
            <Column header="Actions" style="width: 15%">
                <template #body="slotProps">
                    <div class="flex gap-2">
                        <Button
                            icon="pi pi-pencil"
                            severity="warning"
                            text
                            rounded
                            class="cursor-pointer"
                            @click="openEditModal(slotProps.data)"
                        />
                        <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            rounded
                            :disabled="deletingIncotermId === slotProps.data.id"
                            class="cursor-pointer"
                            @click="openDeleteConfirm(slotProps.data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <p v-else class="text-lg text-secondary">No incoterms found.</p>

        <Dialog
            v-model:visible="showIncotermModal"
            modal
            :header="isEditing ? 'EDIT INCOTERM' : 'CREATE INCOTERM'"
            :draggable="false"
            :pt="dialogPT"
            @hide="handleDialogHide"
        >
            <div class="flex flex-col gap-4">
                <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-dark">CODE</span>
                    <InputText
                        v-model="incotermForm.codi"
                        type="text"
                        placeholder="e.g., FOB"
                        class="rounded-lg border border-secondary-muted bg-primary px-3 py-2 text-dark outline-none focus:border-accent"
                    />
                </label>

                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-dark">NAME</span>
                    <InputText
                        v-model="incotermForm.nom"
                        type="text"
                        placeholder="e.g., Free on Board"
                        class="rounded-lg border border-secondary-muted bg-primary px-3 py-2 text-dark outline-none focus:border-accent"
                    />
                </label>

                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-dark">TRACKING STEPS</span>
                    <div class="flex flex-col gap-2">
                        <div
                            v-for="step in trackingSteps"
                            :key="step.id"
                            class="flex items-center gap-2"
                        >
                            <Checkbox
                                :modelValue="incotermForm.tracking_step_ids.includes(step.id)"
                                :binary="true"
                                @update:modelValue="
                                    (checked) =>
                                        updateTrackingStepSelection(step.id, checked)
                                "
                            />
                            <label class="cursor-pointer text-dark">{{ step.nom }}</label>
                        </div>
                    </div>
                </label>
            </div>

            <template #footer>
                <Button
                    :label="isSubmitting ? 'SAVING...' : isEditing ? 'SAVE' : 'CREATE'"
                    type="button"
                    :disabled="isSubmitting"
                    class="cursor-pointer rounded-lg border-0 bg-danger px-6 py-2 font-medium text-white outline-none transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    @click="saveIncoterm"
                />
            </template>
        </Dialog>

        <Dialog
            v-model:visible="showDeleteConfirm"
            modal
            header="CONFIRM DELETE"
            :draggable="false"
            :pt="dialogPT"
        >
            <p class="text-dark">Are you sure you want to delete this incoterm?</p>
            <template #footer>
                <Button
                    label="CANCEL"
                    type="button"
                    severity="secondary"
                    class="cursor-pointer rounded-lg border-0 px-6 py-2"
                    @click="showDeleteConfirm = false"
                />
                <Button
                    label="DELETE"
                    type="button"
                    severity="danger"
                    :disabled="isSubmitting"
                    class="cursor-pointer rounded-lg border-0 bg-danger px-6 py-2 font-medium text-white outline-none transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    @click="confirmDelete"
                />
            </template>
        </Dialog>
    </section>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import { fetchIncoterms, fetchTrackingSteps, createIncoterm, updateIncoterm, deleteIncoterm } from "@/services/incoterms"
import Button from "primevue/button"
import Dialog from "primevue/dialog"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import InputText from "primevue/inputtext"
import Checkbox from "primevue/checkbox"

const incoterms = ref([])
const trackingSteps = ref([])
const isLoading = ref(true)
const isSubmitting = ref(false)
const pageError = ref("")
const submitError = ref("")
const showIncotermModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const deletingIncotermId = ref(null)
const selectedIncoterm = ref(null)

const incotermForm = ref({
    codi: "",
    nom: "",
    tracking_step_ids: [],
})

const dialogPT = {
    header: { class: "bg-secondary border-b border-secondary-muted rounded-t-xl" },
    content: { class: "bg-primary" },
    footer: { class: "bg-primary border-t border-secondary-muted flex justify-end gap-2" },
}

const createEmptyForm = () => ({
    codi: "",
    nom: "",
    tracking_step_ids: [],
})

const loadData = async () => {
    try {
        isLoading.value = true
        pageError.value = ""
        const [incotermsData, stepsData] = await Promise.all([
            fetchIncoterms(),
            fetchTrackingSteps(),
        ])
        incoterms.value = incotermsData
        trackingSteps.value = stepsData
    } catch (error) {
        pageError.value = error.message || "Failed to load data"
        console.error(error)
    } finally {
        isLoading.value = false
    }
}

const openCreateModal = () => {
    isEditing.value = false
    incotermForm.value = createEmptyForm()
    submitError.value = ""
    showIncotermModal.value = true
}

const openEditModal = (incoterm) => {
    isEditing.value = true
    selectedIncoterm.value = incoterm
    incotermForm.value = {
        codi: incoterm.codi,
        nom: incoterm.nom,
        tracking_step_ids: incoterm.tracking_steps.map((step) => step.id),
    }
    submitError.value = ""
    showIncotermModal.value = true
}

const openDeleteConfirm = (incoterm) => {
    selectedIncoterm.value = incoterm
    showDeleteConfirm.value = true
}

const updateTrackingStepSelection = (stepId, checked) => {
    if (checked) {
        if (!incotermForm.value.tracking_step_ids.includes(stepId)) {
            incotermForm.value.tracking_step_ids.push(stepId)
        }
    } else {
        const index = incotermForm.value.tracking_step_ids.indexOf(stepId)
        if (index > -1) {
            incotermForm.value.tracking_step_ids.splice(index, 1)
        }
    }
}

const saveIncoterm = async () => {
    try {
        submitError.value = ""
        isSubmitting.value = true

        if (!incotermForm.value.codi.trim()) {
            submitError.value = "Code is required"
            return
        }

        if (!incotermForm.value.nom.trim()) {
            submitError.value = "Name is required"
            return
        }

        if (isEditing.value) {
            await updateIncoterm(selectedIncoterm.value.id, incotermForm.value)
        } else {
            await createIncoterm(incotermForm.value)
        }

        showIncotermModal.value = false
        await loadData()
    } catch (error) {
        submitError.value = error.message || "Failed to save incoterm"
        console.error(error)
    } finally {
        isSubmitting.value = false
    }
}

const confirmDelete = async () => {
    try {
        submitError.value = ""
        isSubmitting.value = true
        deletingIncotermId.value = selectedIncoterm.value.id

        await deleteIncoterm(selectedIncoterm.value.id)

        showDeleteConfirm.value = false
        await loadData()
    } catch (error) {
        submitError.value = error.message || "Failed to delete incoterm"
        console.error(error)
    } finally {
        isSubmitting.value = false
        deletingIncotermId.value = null
    }
}

const handleDialogHide = () => {
    incotermForm.value = createEmptyForm()
    submitError.value = ""
    isEditing.value = false
    selectedIncoterm.value = null
}

onMounted(() => {
    loadData()
})
</script>
