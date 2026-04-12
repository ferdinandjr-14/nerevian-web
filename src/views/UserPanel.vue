<template>
    <p v-if="pageError" class="mb-4 text-red-600">{{ pageError }}</p>
    <div v-if="isLoading" class="flex items-center gap-2 mt-5">
        <span
            class="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
        />
        Loading users
    </div>
    <section v-else class="pb-10">
        <Tabs v-if="roleTabs.length" v-model:value="activeRoleTab">
            <TabList>
                <Tab
                    v-for="role in roleTabs"
                    :key="role.value"
                    :value="role.value"
                    :class="[
                        'w-50 py-3 mb-5 cursor-pointer text-lg',
                        activeRoleTab === role.value
                            ? 'border-b-4'
                            : 'border-b-4 border-b-accent-muted hover:border-b-secondary transition-all duration-300 ease-in-out',
                    ]"
                >
                    {{ role.label }}
                </Tab>
            </TabList>
            <TabPanels>
                <Button
                    label="ADD USER"
                    type="button"
                    class="bg-danger text-primary py-2 px-10 rounded-lg cursor-pointer mb-5"
                    @click="openCreateModal"
                />
                <TabPanel v-for="role in roleTabs" :key="`${role.value}-panel`" :value="role.value">
                    <DataTable
                        v-model:filters="tableFilters"
                        :value="usersByRole(role.value)"
                        :globalFilterFields="['id', 'name', 'surname', 'email', 'clientName']"
                        class="users-table"
                        dataKey="id"
                        paginator
                        :rows="12"
                        :rowsPerPageOptions="[12, 24, 36]"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        showGridlines
                        :pt="{
                            root: { class: 'w-full bg-accent rounded-xl overflow-hidden' },
                            table: { class: 'w-full border-collapse' },
                            thead: { class: 'border-b border-secondary-muted' },
                            tbody: { class: 'divide-y divide-secondary-muted' },
                            pcPaginator: {
                                root: {
                                    class: 'flex gap-5 items-center justify-center gap-2 px-6 py-4 bg-accent-muted border-t border-secondary text-secondary',
                                },
                                content: {
                                    class: 'flex items-center gap-3',
                                },
                                pcRowPerPageDropdown: {
                                    root: {
                                        class: 'flex items-center justify-center gap-1 bg-accent border border-secondary-muted rounded-lg px-3 py-1 cursor-pointer text-lg text-primary',
                                    },
                                    label: { class: 'text-primary text-lg' },
                                    dropdown: { class: 'text-primary text-xs ml-1' },
                                    overlay: {
                                        class: 'bg-accent-muted border border-secondary-muted rounded-lg mt-1 overflow-hidden z-50',
                                    },
                                    option: ({ context }) => ({
                                        class: [
                                            'px-4 py-2 text-lg cursor-pointer transition-colors rounded-md',
                                            context.selected
                                                ? 'bg-accent text-primary'
                                                : 'text-secondary hover:bg-accent',
                                        ],
                                    }),
                                    list: { class: 'p-1' },
                                },
                            },
                        }"
                    >
                        <template #header>
                            <div class="pl-4 pt-6 pb-4 text-primary">
                                <IconField class="flex gap-2 items-center border-b max-w-70 pb-2">
                                    <InputIcon class="pi pi-search" />
                                    <InputText
                                        v-model="tableFilters.global.value"
                                        placeholder="Search users"
                                        class="border-0 outline-0 w-full"
                                    />
                                </IconField>
                            </div>
                        </template>

                        <Column field="id" header="ID" sortable :pt="columnPT">
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{ data.id }}</span>
                            </template>
                        </Column>
                        <Column field="name" header="NAME" sortable :pt="columnPT">
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{ data.name || "-" }}</span>
                            </template>
                        </Column>
                        <Column field="surname" header="SURNAME" sortable :pt="columnPT">
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{
                                    data.surname || "-"
                                }}</span>
                            </template>
                        </Column>
                        <Column field="email" header="EMAIL" sortable :pt="columnPT">
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{ data.email }}</span>
                            </template>
                        </Column>
                        <Column
                            field="clientName"
                            header="CLIENT"
                            sortable
                            :pt="columnPT"
                            v-if="activeRoleTab === 'client'"
                        >
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{
                                    data.clientName || "-"
                                }}</span>
                            </template>
                        </Column>
                        <Column
                            header="ACTION"
                            :pt="{
                                headerCell: { class: 'px-6 py-4 text-left text-primary' },
                                bodyCell: {
                                    class: 'px-6 py-5 bg-accent-muted text-secondary font-medium',
                                },
                            }"
                        >
                            <template #body="{ data }">
                                <div class="flex gap-4">
                                    <Button
                                        icon="pi pi-pencil"
                                        text
                                        type="button"
                                        class="cursor-pointer text-secondary"
                                        aria-label="Edit user"
                                        @click="openEditModal(data)"
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        text
                                        type="button"
                                        :disabled="
                                            isCurrentUser(data.id) || deletingUserId === data.id
                                        "
                                        :class="[
                                            'cursor-pointer',
                                            isCurrentUser(data.id) || deletingUserId === data.id
                                                ? 'text-secondary/40 cursor-not-allowed'
                                                : 'text-red-400',
                                        ]"
                                        aria-label="Delete user"
                                        @click="openDeleteConfirm($event, data)"
                                    />
                                </div>
                            </template>
                        </Column>

                        <template #empty>
                            <p class="empty-row">No users found.</p>
                        </template>
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>
        <p v-else class="text-secondary text-lg">No roles available.</p>

        <Dialog
            v-model:visible="showUserModal"
            modal
            :header="isEditing ? 'EDIT USER' : 'CREATE USER'"
            :draggable="false"
            :pt="{
                mask: {
                    class: 'bg-accent/30 fixed inset-0 flex justify-center items-center z-50 backdrop-blur-xs',
                },
                root: {
                    class: 'bg-primary rounded-xl shadow-2xl flex flex-col w-full max-w-md overflow-hidden m-4',
                },
                header: {
                    class: 'bg-secondary text-primary px-6 py-4 flex justify-between items-center font-bold text-lg',
                },
                title: { class: 'text-primary' },
                closeButton: {
                    class: 'text-primary hover:text-accent transition-colors cursor-pointer flex items-center justify-center w-8 h-8 rounded-full outline-0 border-0 ring-0 cursor-pointer',
                },
                content: { class: 'bg-primary px-6 py-5' },
                footer: {
                    class: 'bg-primary px-6 py-4 flex justify-end gap-3',
                },
            }"
            @hide="handleDialogHide"
        >
            <div class="flex flex-col gap-4">
                <p v-if="submitError" class="text-sm text-red-600">{{ submitError }}</p>

                <label class="flex flex-col gap-1.5">
                    <span class="text-dark font-medium text-sm">NAME</span>
                    <InputText
                        v-model="userForm.name"
                        type="text"
                        class="border border-secondary-muted rounded-lg px-3 py-2 text-dark bg-primary outline-none focus:border-accent"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-dark font-medium text-sm">SURNAME</span>
                    <InputText
                        v-model="userForm.surname"
                        type="text"
                        class="border border-secondary-muted rounded-lg px-3 py-2 text-dark bg-primary outline-none focus:border-accent"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-dark font-medium text-sm">EMAIL</span>
                    <InputText
                        v-model="userForm.email"
                        type="email"
                        class="border border-secondary-muted rounded-lg px-3 py-2 text-dark bg-primary outline-none focus:border-accent"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-dark font-medium text-sm">
                        {{ isEditing ? "PASSWORD (OPTIONAL)" : "PASSWORD" }}
                    </span>
                    <Password
                        v-model="userForm.password"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full border-0 outline-0 ring-0"
                        class="flex w-full border border-secondary px-3 py-2 rounded-lg items-center"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-dark font-medium text-sm">
                        {{ isEditing ? "CONFIRM PASSWORD (OPTIONAL)" : "CONFIRM PASSWORD" }}
                    </span>
                    <Password
                        v-model="userForm.passwordConfirmation"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full border-0 outline-0 ring-0"
                        class="flex w-full border border-secondary px-3 py-2 rounded-lg items-center"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-dark font-medium text-sm">ROLE</span>
                    <Select
                        v-model="userForm.roleId"
                        :options="roleOptions"
                        optionLabel="label"
                        optionValue="value"
                        :pt="selectPT"
                    />
                </label>
                <label v-if="isClientRoleSelected" class="flex flex-col gap-1.5">
                    <span class="text-dark font-medium text-sm">CLIENT</span>
                    <Select
                        v-model="userForm.clientId"
                        :options="clientOptions"
                        optionLabel="label"
                        optionValue="value"
                        filter
                        placeholder="Select client"
                        :pt="selectPT"
                    />
                </label>
            </div>
            <template #footer>
                <Button
                    :label="isSubmitting ? 'SAVING...' : isEditing ? 'SAVE' : 'CREATE'"
                    type="button"
                    :disabled="isSubmitting"
                    class="bg-danger text-primary px-6 py-2 rounded-lg cursor-pointer font-medium hover:opacity-90 transition-opacity outline-none border-0 disabled:opacity-60 disabled:cursor-not-allowed"
                    @click="saveUser"
                />
            </template>
        </Dialog>

        <ConfirmPopup
            :pt="{
                root: {
                    class: 'bg-primary rounded-xl shadow-2xl border border-secondary-muted overflow-hidden z-50 mt-2 min-w-72 absolute',
                },
                content: { class: 'p-5 flex items-center gap-4' },
                icon: { class: 'text-danger text-2xl' },
                message: { class: 'text-dark font-medium text-lg m-0' },
                footer: {
                    class: 'px-5 py-4 flex justify-end gap-3 border-t border-secondary-muted bg-primary',
                },
                pcRejectButton: {
                    root: {
                        class: 'px-4 py-2 text-dark hover:text-accent transition-colors cursor-pointer font-medium outline-none bg-transparent border-0',
                    },
                },
                pcAcceptButton: {
                    root: {
                        class: 'bg-red-500 text-primary px-6 py-2 rounded-lg cursor-pointer font-medium hover:opacity-90 transition-opacity outline-none border-0',
                    },
                },
                transition: {
                    enterFromClass: 'opacity-0 scale-y-0',
                    enterActiveClass: 'transition-all duration-200 ease-out origin-top',
                    leaveActiveClass: 'transition-all duration-200 ease-in origin-top',
                    leaveToClass: 'opacity-0 scale-y-0',
                },
            }"
        />
    </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue"
import { useConfirm } from "primevue/useconfirm"
import { FilterMatchMode } from "@primevue/core/api"
import { authState } from "@/services/auth"
import {
    createAdminUser,
    deleteAdminUser,
    fetchAdminClients,
    fetchAdminRoles,
    fetchAdminUsers,
    updateAdminUser,
} from "@/services/users"

const confirm = useConfirm()

const selectPT = {
    root: {
        class: "border border-secondary-muted rounded-lg px-3 py-2 text-dark bg-primary flex items-center justify-between outline-none cursor-pointer focus:border-accent",
    },
    label: { class: "text-dark" },
    dropdown: { class: "text-dark/70" },
    overlay: {
        class: "bg-primary border border-secondary-muted rounded-lg mt-1 shadow-lg z-50 overflow-hidden",
    },
    option: ({ context }) => ({
        class: [
            "px-4 py-2 cursor-pointer transition-colors",
            context.selected ? "bg-accent text-primary" : "text-dark hover:bg-secondary-muted",
        ],
    }),
    list: { class: "py-1" },
}

const columnPT = {
    headerCell: { class: "px-6 py-4 text-left text-primary" },
    bodyCell: {
        class: "px-6 py-5 bg-accent-muted text-secondary font-medium border-r",
    },
    columnheadercontent: { class: "flex items-center gap-3" },
}

const roleOptions = ref([])
const clientOptions = ref([])
const users = ref([])
const activeRoleTab = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const deletingUserId = ref(null)
const pageError = ref("")
const submitError = ref("")
const showUserModal = ref(false)
const isEditing = ref(false)
const selectedUserId = ref(null)

const userForm = reactive({
    name: "",
    surname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    roleId: null,
    clientId: null,
})

const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    surname: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    clientName: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const roleTabs = computed(() =>
    roleOptions.value.map((role) => ({
        label: role.label,
        value: role.key,
    })),
)

const selectedRoleOption = computed(() => {
    const roleId = Number(userForm.roleId)
    return roleOptions.value.find((role) => role.id === roleId) ?? null
})

const isClientRoleSelected = computed(() => selectedRoleOption.value?.key === "client")

const resolveDefaultRole = () =>
    roleOptions.value.find((role) => role.key === activeRoleTab.value) ??
    roleOptions.value[0] ??
    null

const usersByRole = (roleKey) => users.value.filter((user) => user.roleKey === roleKey)

const sortUsers = (items) => [...items].sort((left, right) => left.id - right.id)

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

const resetUserForm = () => {
    const defaultRole = resolveDefaultRole()

    userForm.name = ""
    userForm.surname = ""
    userForm.email = ""
    userForm.password = ""
    userForm.passwordConfirmation = ""
    userForm.roleId = defaultRole?.id ?? null
    userForm.clientId = null
    submitError.value = ""
}

const handleDialogHide = () => {
    submitError.value = ""
}

const openCreateModal = () => {
    isEditing.value = false
    selectedUserId.value = null
    resetUserForm()
    showUserModal.value = true
}

const openEditModal = (user) => {
    isEditing.value = true
    selectedUserId.value = user.id
    userForm.name = user.name
    userForm.surname = user.surname
    userForm.email = user.email
    userForm.password = ""
    userForm.passwordConfirmation = ""
    userForm.roleId = user.roleId
    userForm.clientId = user.clientId
    submitError.value = ""
    showUserModal.value = true
}

const upsertUser = (user) => {
    const existingIndex = users.value.findIndex((item) => item.id === user.id)

    if (existingIndex === -1) {
        users.value = sortUsers([...users.value, user])
        return
    }

    const nextUsers = [...users.value]
    nextUsers.splice(existingIndex, 1, user)
    users.value = sortUsers(nextUsers)
}

const validateUserForm = () => {
    if (!userForm.name.trim() || !userForm.email.trim() || !userForm.roleId) {
        return "Name, email, and role are required."
    }

    if (!isEditing.value && !userForm.password) {
        return "Password is required for new users."
    }

    if (userForm.password || userForm.passwordConfirmation) {
        if (userForm.password.length < 8) {
            return "Password must contain at least 8 characters."
        }

        if (userForm.password !== userForm.passwordConfirmation) {
            return "Passwords do not match."
        }
    }

    if (isClientRoleSelected.value && !userForm.clientId) {
        return "Client is required when the selected role is Clients."
    }

    return ""
}

const saveUser = async () => {
    submitError.value = validateUserForm()

    if (submitError.value) {
        return
    }

    isSubmitting.value = true

    try {
        const savedUser =
            isEditing.value && selectedUserId.value !== null
                ? await updateAdminUser(selectedUserId.value, userForm)
                : await createAdminUser(userForm)

        upsertUser(savedUser)
        activeRoleTab.value = savedUser.roleKey || activeRoleTab.value
        showUserModal.value = false
        handleDialogHide()
    } catch (error) {
        submitError.value = firstErrorMessage(error, "Unable to save user.")
    } finally {
        isSubmitting.value = false
    }
}

const isCurrentUser = (userId) => Number(authState.user?.id) === Number(userId)

const openDeleteConfirm = (event, user) => {
    if (isCurrentUser(user.id)) {
        return
    }

    confirm.require({
        target: event.currentTarget,
        message: "Are you sure you want to delete this user?",
        icon: "pi pi-exclamation-triangle",
        rejectLabel: "CANCEL",
        acceptLabel: "DELETE",
        reject: () => {
            deletingUserId.value = null
        },
        accept: async () => {
            deletingUserId.value = user.id
            pageError.value = ""

            try {
                await deleteAdminUser(user.id)
                users.value = users.value.filter((item) => item.id !== user.id)
            } catch (error) {
                pageError.value = firstErrorMessage(error, "Unable to delete user.")
            } finally {
                deletingUserId.value = null
            }
        },
    })
}

const loadUserPanel = async () => {
    isLoading.value = true
    pageError.value = ""

    try {
        const [loadedUsers, loadedRoles, loadedClients] = await Promise.all([
            fetchAdminUsers(),
            fetchAdminRoles(),
            fetchAdminClients(),
        ])

        users.value = loadedUsers
        roleOptions.value = loadedRoles
        clientOptions.value = loadedClients

        const availableRoleKeys = new Set(roleTabs.value.map((role) => role.value))

        activeRoleTab.value = availableRoleKeys.has(activeRoleTab.value)
            ? activeRoleTab.value
            : (roleTabs.value[0]?.value ?? null)
    } catch (error) {
        pageError.value = firstErrorMessage(error, "Unable to load users.")
    } finally {
        isLoading.value = false
    }
}

watch(
    () => userForm.roleId,
    () => {
        if (!isClientRoleSelected.value) {
            userForm.clientId = null
        }
    },
)

onMounted(loadUserPanel)
</script>
