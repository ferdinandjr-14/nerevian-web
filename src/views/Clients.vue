<template>
    <p v-if="pageError" class="mb-4 text-red-600">{{ pageError }}</p>
    <div v-if="isLoading" class="mt-5 flex items-center gap-2">
        <span
            class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        Loading clients...
    </div>
    <section v-else class="pb-10">
        <div class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <IconField class="flex max-w-80 items-center gap-2 border-b border-secondary pb-2">
                <InputIcon class="pi pi-search text-secondary" />
                <InputText
                    v-model="searchTerm"
                    placeholder="Search clients"
                    class="w-full border-0 bg-transparent text-secondary outline-0"
                />
            </IconField>

            <Button
                label="ADD CLIENT"
                type="button"
                class="cursor-pointer rounded-lg bg-danger px-10 py-2 text-white"
                @click="openCreateModal"
            />
        </div>

        <div
            v-if="filteredClients.length"
            class="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
        >
            <ClientCard
                v-for="client in filteredClients"
                :key="client.id"
                :client="client"
                :is-deleting="deletingClientId === client.id"
                @edit="openEditModal"
                @delete="openDeleteConfirm"
            />
        </div>

        <p v-else class="text-lg text-secondary">No clients found.</p>

        <Dialog
            v-model:visible="showClientModal"
            modal
            :header="isEditing ? 'EDIT CLIENT' : 'CREATE CLIENT'"
            :draggable="false"
            :pt="dialogPT"
            @hide="handleDialogHide"
        >
            <div class="flex flex-col gap-4">
                <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-dark">NAME</span>
                    <InputText
                        v-model="clientForm.name"
                        type="text"
                        class="rounded-lg border border-secondary-muted bg-primary px-3 py-2 text-dark outline-none focus:border-accent"
                    />
                </label>

                <label class="flex flex-col gap-1.5">
                    <span class="text-sm font-medium text-dark">CIF</span>
                    <InputText
                        v-model="clientForm.cif"
                        type="text"
                        class="rounded-lg border border-secondary-muted bg-primary px-3 py-2 text-dark outline-none focus:border-accent"
                    />
                </label>
            </div>

            <template #footer>
                <Button
                    :label="isSubmitting ? 'SAVING...' : isEditing ? 'SAVE' : 'CREATE'"
                    type="button"
                    :disabled="isSubmitting"
                    class="cursor-pointer rounded-lg border-0 bg-danger px-6 py-2 font-medium text-white outline-none transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    @click="saveClient"
                />
            </template>
        </Dialog>

        <ConfirmPopup :pt="confirmPopupPT" />
    </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue"
import { useConfirm } from "primevue/useconfirm"
import ClientCard from "@/components/ClientCard.vue"
import { authState } from "@/services/auth"
import {
    createAdminClient,
    deleteAdminClient,
    fetchAdminClients,
    updateAdminClient,
} from "@/services/clients"
import router from "@/router"

const confirm = useConfirm()

const dialogPT = {
    mask: {
        class: "fixed inset-0 z-50 flex items-center justify-center bg-accent/30 backdrop-blur-xs",
    },
    root: {
        class: "m-4 flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-primary shadow-2xl",
    },
    header: {
        class: "flex items-center justify-between bg-secondary px-6 py-4 text-lg font-bold text-primary",
    },
    title: { class: "text-primary" },
    closeButton: {
        class: "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 text-primary outline-0 transition-colors hover:text-accent",
    },
    content: { class: "bg-primary px-6 py-5" },
    footer: { class: "flex justify-end gap-3 bg-primary px-6 py-4" },
}

const confirmPopupPT = {
    root: {
        class: "absolute z-50 mt-2 min-w-72 overflow-hidden rounded-xl border border-secondary-muted bg-primary shadow-2xl",
    },
    content: { class: "flex items-center gap-4 p-5" },
    icon: { class: "text-2xl text-danger" },
    message: { class: "m-0 text-lg font-medium text-dark" },
    footer: {
        class: "flex justify-end gap-3 border-t border-secondary-muted bg-primary px-5 py-4",
    },
    pcRejectButton: {
        root: {
            class: "cursor-pointer border-0 bg-transparent px-4 py-2 font-medium text-dark outline-none transition-colors hover:text-accent",
        },
    },
    pcAcceptButton: {
        root: {
            class: "cursor-pointer rounded-lg border-0 bg-red-500 px-6 py-2 font-medium text-primary outline-none transition-opacity hover:opacity-90",
        },
    },
    transition: {
        enterFromClass: "origin-top scale-y-0 opacity-0",
        enterActiveClass: "transition-all duration-200 ease-out",
        leaveActiveClass: "transition-all duration-200 ease-in origin-top",
        leaveToClass: "origin-top scale-y-0 opacity-0",
    },
}

const clients = ref([])
const searchTerm = ref("")
const isLoading = ref(true)
const isSubmitting = ref(false)
const deletingClientId = ref(null)
const pageError = ref("")
const submitError = ref("")
const showClientModal = ref(false)
const isEditing = ref(false)
const selectedClientId = ref(null)

const clientForm = reactive({
    name: "",
    cif: "",
})

const filteredClients = computed(() => {
    const normalizedSearch = searchTerm.value.trim().toLowerCase()

    if (!normalizedSearch) {
        return clients.value
    }

    return clients.value.filter((client) =>
        [client.name, client.cif].some((value) =>
            String(value || "")
                .toLowerCase()
                .includes(normalizedSearch),
        ),
    )
})

const sortClients = (items) => [...items].sort((left, right) => left.name.localeCompare(right.name))

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

const resetClientForm = () => {
    clientForm.name = ""
    clientForm.cif = ""
    submitError.value = ""
}

const handleDialogHide = () => {
    submitError.value = ""
}

const openCreateModal = () => {
    isEditing.value = false
    selectedClientId.value = null
    resetClientForm()
    showClientModal.value = true
}

const openEditModal = (client) => {
    isEditing.value = true
    selectedClientId.value = client.id
    clientForm.name = client.name
    clientForm.cif = client.cif
    submitError.value = ""
    showClientModal.value = true
}

const upsertClient = (client) => {
    const existingIndex = clients.value.findIndex((item) => item.id === client.id)

    if (existingIndex === -1) {
        clients.value = sortClients([...clients.value, client])
        return
    }

    const nextClients = [...clients.value]
    nextClients.splice(existingIndex, 1, client)
    clients.value = sortClients(nextClients)
}

const validateClientForm = () => {
    if (!clientForm.name.trim() || !clientForm.cif.trim()) {
        return "Name and CIF are required."
    }

    return ""
}

const saveClient = async () => {
    submitError.value = validateClientForm()

    if (submitError.value) {
        return
    }

    isSubmitting.value = true

    try {
        const currentClient =
            selectedClientId.value !== null
                ? (clients.value.find((client) => client.id === selectedClientId.value) ?? null)
                : null

        const savedClient =
            isEditing.value && selectedClientId.value !== null
                ? await updateAdminClient(selectedClientId.value, clientForm, currentClient)
                : await createAdminClient(clientForm)

        upsertClient(savedClient)
        showClientModal.value = false
        handleDialogHide()
    } catch (error) {
        submitError.value = firstErrorMessage(error, "Unable to save client.")
    } finally {
        isSubmitting.value = false
    }
}

const openDeleteConfirm = (event, client) => {
    confirm.require({
        target: event.currentTarget,
        message: "Are you sure you want to delete this client?",
        icon: "pi pi-exclamation-triangle",
        rejectLabel: "CANCEL",
        acceptLabel: "DELETE",
        reject: () => {
            deletingClientId.value = null
        },
        accept: async () => {
            deletingClientId.value = client.id
            pageError.value = ""

            try {
                await deleteAdminClient(client.id)
                clients.value = clients.value.filter((item) => item.id !== client.id)
            } catch (error) {
                pageError.value = firstErrorMessage(error, "Unable to delete client.")
            } finally {
                deletingClientId.value = null
            }
        },
    })
}

const loadClients = async () => {
    if (authState.user?.rol_id !== "4") {
        await router.replace("/dashboard")
        return
    }

    isLoading.value = true
    pageError.value = ""

    try {
        clients.value = await fetchAdminClients()
    } catch (error) {
        pageError.value = firstErrorMessage(error, "Unable to load clients.")
    } finally {
        isLoading.value = false
    }
}

onMounted(loadClients)
</script>
