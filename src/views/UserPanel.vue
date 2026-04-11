<template>
    <section class="user-panel-page">
        <Tabs v-model:value="activeRoleTab">
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
                    >{{ role.label }}</Tab
                >
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
                        :globalFilterFields="['id', 'name', 'surname', 'email']"
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

                        <Column
                            field="id"
                            header="ID"
                            sortable
                            :pt="{
                                headerCell: { class: 'px-6 py-4 text-left text-primary' },
                                bodyCell: {
                                    class: 'px-6 py-5 bg-accent-muted text-secondary font-medium border-r',
                                },
                                columnheadercontent: { class: 'flex items-center gap-3' },
                            }"
                        >
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{ data.id }}</span>
                            </template>
                        </Column>
                        <Column
                            field="name"
                            header="NAME"
                            sortable
                            :pt="{
                                headerCell: { class: 'px-6 py-4 text-left text-primary' },
                                bodyCell: {
                                    class: 'px-6 py-5 bg-accent-muted text-secondary font-medium border-r',
                                },
                                columnheadercontent: { class: 'flex items-center gap-3' },
                            }"
                        >
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{ data.name }}</span>
                            </template>
                        </Column>
                        <Column
                            field="surname"
                            header="SURNAME"
                            sortable
                            :pt="{
                                headerCell: { class: 'px-6 py-4 text-left text-primary' },
                                bodyCell: {
                                    class: 'px-6 py-5 bg-accent-muted text-secondary font-medium border-r',
                                },
                                columnheadercontent: { class: 'flex items-center gap-3' },
                            }"
                        >
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{ data.surname }}</span>
                            </template>
                        </Column>
                        <Column
                            field="email"
                            header="EMAIL"
                            sortable
                            :pt="{
                                headerCell: { class: 'px-6 py-4 text-left text-primary' },
                                bodyCell: {
                                    class: 'px-6 py-5 bg-accent-muted text-secondary font-medium border-r',
                                },
                                columnheadercontent: { class: 'flex items-center gap-3' },
                            }"
                        >
                            <template #body="{ data }">
                                <span class="text-secondary text-lg">{{ data.email }}</span>
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
                                        class="cursor-pointer text-red-400"
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
        >
            <div class="flex flex-col gap-4">
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
                    <span class="text-dark font-medium text-sm">PASSWORD</span>
                    <Password
                        v-model="userForm.password"
                        :feedback="false"
                        toggleMask
                        inputClass="w-full border-0 outline-0 ring-0"
                        class="flex w-full border border-secondary px-3 py-2 rounded-lg items-center"
                    />
                </label>
                <label class="flex flex-col gap-1.5">
                    <span class="text-dark font-medium text-sm">ROLE</span>
                    <Select
                        v-model="userForm.role"
                        :options="roleTabs"
                        optionLabel="label"
                        optionValue="value"
                        :pt="{
                            root: {
                                class: 'border border-secondary-muted rounded-lg px-3 py-2 text-dark bg-primary flex items-center justify-between outline-none cursor-pointer focus:border-accent',
                            },
                            label: { class: 'text-dark' },
                            dropdown: { class: 'text-dark/70' },
                            overlay: {
                                class: 'bg-primary border border-secondary-muted rounded-lg mt-1 shadow-lg z-50 overflow-hidden',
                            },
                            option: ({ context }) => ({
                                class: [
                                    'px-4 py-2 cursor-pointer transition-colors',
                                    context.selected
                                        ? 'bg-accent text-primary'
                                        : 'text-dark hover:bg-secondary-muted',
                                ],
                            }),
                            list: { class: 'py-1' },
                        }"
                    />
                </label>
            </div>
            <template #footer>
                <Button
                    :label="isEditing ? 'SAVE' : 'CREATE'"
                    type="button"
                    class="bg-danger text-primary px-6 py-2 rounded-lg cursor-pointer font-medium hover:opacity-90 transition-opacity outline-none border-0"
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
import { reactive, ref } from "vue"
import { useRouter } from "vue-router"
import { useConfirm } from "primevue/useconfirm"
import { FilterMatchMode } from "@primevue/core/api"

const router = useRouter()
const confirm = useConfirm()
const nextIdSeed = ref(11235423)

const roleTabs = [
    { label: "Operator", value: "operator" },
    { label: "Commercial", value: "commercial" },
    { label: "Clients", value: "client" },
]

const activeRoleTab = ref("operator")

const users = ref([
    { id: 11235423, name: "Jane", surname: "Doe", email: "janedoe@nerevian.com", role: "operator" },
    {
        id: 11235424,
        name: "Carlos",
        surname: "Ruiz",
        email: "cruiz@nerevian.com",
        role: "commercial",
    },
    { id: 11235425, name: "Ana", surname: "Pardo", email: "apardo@nerevian.com", role: "client" },
    {
        id: 11235426,
        name: "Luis",
        surname: "Ibarra",
        email: "libarra@nerevian.com",
        role: "operator",
    },
    {
        id: 11235427,
        name: "Marta",
        surname: "Vega",
        email: "mvega@nerevian.com",
        role: "commercial",
    },
    { id: 11235428, name: "David", surname: "Soler", email: "dsoler@nerevian.com", role: "client" },
    {
        id: 11235429,
        name: "Irene",
        surname: "Nieto",
        email: "inieto@nerevian.com",
        role: "operator",
    },
    {
        id: 11235430,
        name: "Pablo",
        surname: "Mora",
        email: "pmora@nerevian.com",
        role: "commercial",
    },
    {
        id: 11235431,
        name: "Nora",
        surname: "Campos",
        email: "ncampos@nerevian.com",
        role: "client",
    },
    {
        id: 11235432,
        name: "Mario",
        surname: "Costa",
        email: "mcosta@nerevian.com",
        role: "operator",
    },
    {
        id: 11235433,
        name: "Julia",
        surname: "Lozano",
        email: "jlozano@nerevian.com",
        role: "commercial",
    },
    { id: 11235434, name: "Eric", surname: "Sanz", email: "esanz@nerevian.com", role: "client" },
    {
        id: 11235435,
        name: "Sofia",
        surname: "Ramos",
        email: "sramos@nerevian.com",
        role: "operator",
    },
    {
        id: 11235436,
        name: "Alvaro",
        surname: "Bellido",
        email: "abellido@nerevian.com",
        role: "commercial",
    },
])

const showUserModal = ref(false)
const isEditing = ref(false)
const selectedUserId = ref(null)

const userForm = reactive({
    name: "",
    surname: "",
    email: "",
    password: "",
    role: "operator",
})

const tableFilters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    surname: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const usersByRole = (role) => users.value.filter((user) => user.role === role)

const resetUserForm = () => {
    userForm.name = ""
    userForm.surname = ""
    userForm.email = ""
    userForm.password = ""
    userForm.role = activeRoleTab.value
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
    userForm.role = user.role
    showUserModal.value = true
}

const saveUser = () => {
    if (!userForm.name || !userForm.surname || !userForm.email || !userForm.role) return

    if (isEditing.value && selectedUserId.value !== null) {
        const target = users.value.find((user) => user.id === selectedUserId.value)
        if (!target) return
        target.name = userForm.name
        target.surname = userForm.surname
        target.email = userForm.email
        target.role = userForm.role
        showUserModal.value = false
        return
    }

    nextIdSeed.value += 1
    users.value.unshift({
        id: nextIdSeed.value,
        name: userForm.name,
        surname: userForm.surname,
        email: userForm.email,
        role: userForm.role,
    })
    showUserModal.value = false
}

const openDeleteConfirm = (event, user) => {
    selectedUserId.value = user.id
    confirm.require({
        target: event.currentTarget,
        message: "Are you sure you want to delete this user?",
        icon: "pi pi-exclamation-triangle",
        rejectLabel: "CANCEL",
        acceptLabel: "DELETE",
        reject: () => {
            selectedUserId.value = null
        },
        accept: () => {
            users.value = users.value.filter((item) => item.id !== selectedUserId.value)
            selectedUserId.value = null
        },
    })
}
</script>
