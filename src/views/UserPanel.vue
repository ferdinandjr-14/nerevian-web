<template>
    <section class="user-panel-page">
        <header class="user-panel-topbar">
            <Button icon="pi pi-arrow-left" text class="back-btn" type="button" @click="goBack" />
        </header>

        <div class="panel-toolbar">
            <Button label="ADD USER" type="button" class="add-user-btn" @click="openCreateModal" />
            <Button icon="pi pi-filter-slash" type="button" class="filter-btn" aria-label="Clear filters" @click="clearFilters" />
        </div>

        <Tabs v-model:value="activeRoleTab" class="role-tabs">
            <TabList>
                <Tab v-for="role in roleTabs" :key="role.value" :value="role.value">{{ role.label }}</Tab>
            </TabList>
            <TabPanels>
                <TabPanel v-for="role in roleTabs" :key="`${role.value}-panel`" :value="role.value">
                    <Card class="users-table-wrap">
                        <template #content>
                            <DataTable
                                v-model:filters="tableFilters"
                                :value="usersByRole(role.value)"
                                :globalFilterFields="['id', 'name', 'surname', 'email']"
                                class="users-table"
                                dataKey="id"
                                paginator
                                :rows="12"
                                :rowsPerPageOptions="[12, 24, 36]"
                                filterDisplay="row"
                                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first}-{last} of {totalRecords} users"
                            >
                                <template #header>
                                    <div class="table-head-tools">
                                        <IconField>
                                            <InputIcon class="pi pi-search" />
                                            <InputText
                                                v-model="tableFilters.global.value"
                                                placeholder="Search users"
                                            />
                                        </IconField>
                                    </div>
                                </template>

                                <Column field="id" header="ID" sortable :showFilterMenu="false">
                                    <template #filter="{ filterModel, filterCallback }">
                                        <InputText
                                            v-model="filterModel.value"
                                            placeholder="Search by ID"
                                            @input="filterCallback()"
                                        />
                                    </template>
                                </Column>
                                <Column field="name" header="NAME" sortable :showFilterMenu="false">
                                    <template #filter="{ filterModel, filterCallback }">
                                        <InputText
                                            v-model="filterModel.value"
                                            placeholder="Search by Name"
                                            @input="filterCallback()"
                                        />
                                    </template>
                                </Column>
                                <Column field="surname" header="SURNAME" sortable :showFilterMenu="false">
                                    <template #filter="{ filterModel, filterCallback }">
                                        <InputText
                                            v-model="filterModel.value"
                                            placeholder="Search by Surname"
                                            @input="filterCallback()"
                                        />
                                    </template>
                                </Column>
                                <Column field="email" header="EMAIL" sortable :showFilterMenu="false">
                                    <template #filter="{ filterModel, filterCallback }">
                                        <InputText
                                            v-model="filterModel.value"
                                            placeholder="Search by Email"
                                            @input="filterCallback()"
                                        />
                                    </template>
                                </Column>
                                <Column header="ACTION">
                                    <template #body="{ data }">
                                        <div class="action-cell">
                                            <Button
                                                icon="pi pi-pencil"
                                                text
                                                type="button"
                                                class="icon-btn"
                                                aria-label="Edit user"
                                                @click="openEditModal(data)"
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                text
                                                type="button"
                                                class="icon-btn"
                                                aria-label="Delete user"
                                                @click="openDeleteConfirm(data)"
                                            />
                                        </div>
                                    </template>
                                </Column>

                                <template #empty>
                                    <p class="empty-row">No users found.</p>
                                </template>
                            </DataTable>
                        </template>
                    </Card>
                </TabPanel>
            </TabPanels>
        </Tabs>

        <Dialog
            v-model:visible="showUserModal"
            modal
            :header="isEditing ? 'EDIT USER' : 'CREATE USER'"
            class="user-dialog"
            :draggable="false"
        >
            <div class="modal-body">
                <label>
                    <span>NAME</span>
                    <InputText v-model="userForm.name" type="text" />
                </label>
                <label>
                    <span>SURNAME</span>
                    <InputText v-model="userForm.surname" type="text" />
                </label>
                <label>
                    <span>EMAIL</span>
                    <InputText v-model="userForm.email" type="email" />
                </label>
                <label>
                    <span>PASSWORD</span>
                    <Password v-model="userForm.password" :feedback="false" toggleMask />
                </label>
                <label>
                    <span>ROLE</span>
                    <Select
                        v-model="userForm.role"
                        :options="roleTabs"
                        optionLabel="label"
                        optionValue="value"
                    />
                </label>
            </div>
            <template #footer>
                <Button label="CANCEL" type="button" class="modal-cancel" @click="closeUserModal" />
                <Button
                    :label="isEditing ? 'SAVE' : 'CREATE'"
                    type="button"
                    class="modal-submit"
                    @click="saveUser"
                />
            </template>
        </Dialog>

        <ConfirmDialog />
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
    { id: 11235424, name: "Carlos", surname: "Ruiz", email: "cruiz@nerevian.com", role: "commercial" },
    { id: 11235425, name: "Ana", surname: "Pardo", email: "apardo@nerevian.com", role: "client" },
    { id: 11235426, name: "Luis", surname: "Ibarra", email: "libarra@nerevian.com", role: "operator" },
    { id: 11235427, name: "Marta", surname: "Vega", email: "mvega@nerevian.com", role: "commercial" },
    { id: 11235428, name: "David", surname: "Soler", email: "dsoler@nerevian.com", role: "client" },
    { id: 11235429, name: "Irene", surname: "Nieto", email: "inieto@nerevian.com", role: "operator" },
    { id: 11235430, name: "Pablo", surname: "Mora", email: "pmora@nerevian.com", role: "commercial" },
    { id: 11235431, name: "Nora", surname: "Campos", email: "ncampos@nerevian.com", role: "client" },
    { id: 11235432, name: "Mario", surname: "Costa", email: "mcosta@nerevian.com", role: "operator" },
    { id: 11235433, name: "Julia", surname: "Lozano", email: "jlozano@nerevian.com", role: "commercial" },
    { id: 11235434, name: "Eric", surname: "Sanz", email: "esanz@nerevian.com", role: "client" },
    { id: 11235435, name: "Sofia", surname: "Ramos", email: "sramos@nerevian.com", role: "operator" },
    { id: 11235436, name: "Alvaro", surname: "Bellido", email: "abellido@nerevian.com", role: "commercial" },
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

const goBack = () => {
    router.push({ name: "dashboard" })
}

const clearFilters = () => {
    tableFilters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        id: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        surname: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    }
}

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

const closeUserModal = () => {
    showUserModal.value = false
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

const openDeleteConfirm = (user) => {
    selectedUserId.value = user.id
    confirm.require({
        message: "Are you sure you want to delete this user?",
        header: "Delete User",
        rejectLabel: "CANCEL",
        acceptLabel: "ACCEPT",
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

<style scoped>
.user-panel-page {
    min-height: 100vh;
    background: #e8e8dd;
    padding: 1.2rem 1.4rem 1.6rem;
}

.user-panel-topbar {
    margin-bottom: 0.65rem;
}

.panel-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.55rem;
}

.table-head-tools {
    display: flex;
    justify-content: flex-end;
}

.action-cell {
    display: flex;
    justify-content: center;
    gap: 0.42rem;
}

.empty-row {
    margin: 0;
    padding: 1rem;
    color: #225057;
}

.modal-body {
    padding: 0.7rem 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.modal-body label {
    display: flex;
    flex-direction: column;
    gap: 0.24rem;
}

.modal-body span {
    color: #213c41;
    font-weight: 600;
}

:deep(.back-btn.p-button) {
    border: none;
    background: transparent;
    color: #118c8c;
    font-weight: 900;
    line-height: 1;
    padding: 0;
}

:deep(.add-user-btn.p-button) {
    border: none;
    background: #ff6666;
    color: #fff;
    border-radius: 7px;
    padding: 0.62rem 1.95rem;
    font-weight: 600;
    letter-spacing: 0.25px;
}

:deep(.filter-btn.p-button) {
    border: none;
    background: #118c8c;
    color: #fff;
    border-radius: 7px;
    width: 34px;
    height: 34px;
    min-width: 34px;
    padding: 0;
}

:deep(.role-tabs .p-tablist-tab-list) {
    background: transparent;
    border: none;
    gap: 0.45rem;
    margin-bottom: 0.55rem;
}

:deep(.role-tabs .p-tab) {
    border-radius: 8px;
    border: 1px solid #118c8c;
    background: #abd2c7;
    color: #11444d;
}

:deep(.role-tabs .p-tab.p-tab-active) {
    background: #118c8c;
    color: #fff;
    border-color: #118c8c;
}

:deep(.role-tabs .p-tabpanels) {
    padding: 0;
    background: transparent;
}

:deep(.users-table-wrap.p-card) {
    background: #abd2c7;
    border-radius: 10px;
    overflow: hidden;
}

:deep(.users-table-wrap .p-card-body) {
    padding: 0;
}

:deep(.users-table .p-datatable-header) {
    background: transparent;
    border: none;
    padding: 0.75rem 0.75rem 0.45rem;
}

:deep(.users-table .p-datatable-header .p-inputtext) {
    min-width: 220px;
}

:deep(.users-table .p-datatable-thead > tr > th) {
    background: #118c8c;
    color: #ebf7f8;
    font-weight: 600;
    padding: 0.64rem 0.75rem;
    border-right: 1px solid rgba(17, 140, 140, 0.45);
}

:deep(.users-table .p-datatable-thead > tr > th:last-child) {
    border-right: none;
    text-align: center;
}

:deep(.users-table .p-datatable-tbody > tr) {
    background: #abd2c7;
}

:deep(.users-table .p-datatable-tbody > tr > td) {
    color: #1f4d53;
    border-bottom: 1px solid rgba(17, 140, 140, 0.4);
    border-right: 1px solid rgba(17, 140, 140, 0.45);
    padding: 0.6rem 0.75rem;
}

:deep(.users-table .p-datatable-tbody > tr > td:last-child) {
    border-right: none;
}

:deep(.users-table .p-datatable-filter-row > th) {
    background: #abd2c7;
    border-right: 1px solid rgba(17, 140, 140, 0.2);
}

:deep(.users-table .p-datatable-filter-row > th:last-child) {
    border-right: none;
}

:deep(.users-table .p-datatable-filter-row .p-inputtext) {
    width: 100%;
    border: none;
    border-radius: 4px;
    background: #eef0e8;
    color: #22565c;
    box-shadow: none;
}

:deep(.users-table .p-paginator) {
    background: #abd2c7;
    border: none;
    padding: 0.75rem;
}

:deep(.users-table .p-paginator-page.p-paginator-page-selected) {
    background: #118c8c;
    color: #fff;
}

:deep(.icon-btn.p-button) {
    border: none;
    background: transparent;
    color: #0a434a;
    padding: 0.1rem;
    min-width: auto;
}

:deep(.icon-btn.p-button:hover) {
    color: #082e34;
    background: transparent;
}

:deep(.user-dialog.p-dialog) {
    width: min(520px, 100%);
}

:deep(.user-dialog .p-dialog-header) {
    background: #083f49;
    color: #fff;
    font-weight: 700;
    justify-content: center;
}

:deep(.user-dialog .p-dialog-content),
:deep(.user-dialog .p-dialog-footer) {
    background: #ece9dd;
}

:deep(.modal-body .p-inputtext),
:deep(.modal-body .p-password-input),
:deep(.modal-body .p-select) {
    border: none;
    border-radius: 4px;
    background: #d8d8d8;
    box-shadow: none;
    color: #15373e;
}

:deep(.modal-body .p-password) {
    width: 100%;
}

:deep(.modal-cancel.p-button),
:deep(.modal-submit.p-button) {
    border: none;
    border-radius: 4px;
    padding: 0.32rem 0.8rem;
}

:deep(.modal-cancel.p-button) {
    background: #d9d9d9;
    color: #314f53;
}

:deep(.modal-submit.p-button) {
    background: #ff6666;
    color: #fff;
}

:deep(.p-confirmdialog .p-dialog-content) {
    background: #f8f8f6;
}

:deep(.p-confirmdialog .p-dialog-header) {
    background: #f8f8f6;
    color: #1f363a;
}

:deep(.p-confirmdialog .p-confirmdialog-message) {
    color: #1f363a;
}

:deep(.p-confirmdialog-reject.p-button) {
    background: #e4e4e4;
    color: #365257;
    border: none;
}

:deep(.p-confirmdialog-accept.p-button) {
    background: #ff6666;
    color: #fff;
    border: none;
}

@media (max-width: 1100px) {
    :deep(.users-table .p-datatable-table) {
        min-width: 860px;
    }

    :deep(.users-table .p-datatable-table-container) {
        overflow-x: auto;
    }
}

@media (max-width: 640px) {
    .user-panel-page {
        padding: 0.9rem 0.65rem 1.2rem;
    }

    .panel-toolbar {
        gap: 0.5rem;
    }

    :deep(.add-user-btn.p-button) {
        padding: 0.52rem 1rem;
    }
}
</style>
