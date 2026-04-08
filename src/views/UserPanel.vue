<template>
	<section class="user-panel-page">
		<header class="user-panel-topbar">
			<button class="back-btn" type="button" @click="goBack">←</button>
		</header>

		<div class="panel-toolbar">
			<button class="add-user-btn" type="button" @click="openCreateModal">ADD USER</button>
			<button class="filter-btn" type="button" aria-label="Filter users">
				<span class="filter-glyph" aria-hidden="true"></span>
			</button>
		</div>

		<section class="users-table-wrap">
			<div class="table-head">
				<span>ID ↓↑</span>
				<span>NAME ↓↑</span>
				<span>SURNAME ↓↑</span>
				<span>EMAIL ↓↑</span>
				<span>DNI ↓↑</span>
				<span class="center-cell">ACTION</span>
			</div>

			<div class="table-filters">
				<input v-model="filters.id" type="text" placeholder="Search by ID" />
				<input v-model="filters.name" type="text" placeholder="Search by Name" />
				<input v-model="filters.surname" type="text" placeholder="Search by Surname" />
				<input v-model="filters.email" type="text" placeholder="Search by Full Name" />
				<input v-model="filters.dni" type="text" placeholder="Search by DNI" />
				<div></div>
			</div>

			<div class="table-body">
				<div v-for="user in pagedUsers" :key="user.id" class="table-row">
					<span>{{ user.id }}</span>
					<span>{{ user.name }}</span>
					<span>{{ user.surname }}</span>
					<span>{{ user.email }}</span>
					<span>{{ user.dni }}</span>
					<div class="action-cell">
						<button type="button" class="icon-btn" aria-label="Edit user" @click="openEditModal(user)">
							✎
						</button>
						<button type="button" class="icon-btn" aria-label="Delete user" @click="openDeleteConfirm(user)">
							🗑
						</button>
					</div>
				</div>

				<p v-if="!pagedUsers.length" class="empty-row">No users found.</p>
			</div>

			<footer class="table-footer">
				<button type="button" :disabled="currentPage === 1" @click="goToPage(1)">«</button>
				<button type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">‹</button>
				<button
					v-for="page in visiblePages"
					:key="page"
					type="button"
					:class="{ active: page === currentPage }"
					@click="goToPage(page)"
				>
					{{ page }}
				</button>
				<button type="button" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">›</button>
				<button type="button" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">»</button>
			</footer>
		</section>

		<div v-if="showUserModal" class="overlay" @click.self="closeUserModal">
			<div class="modal-card user-modal">
				<header class="modal-head">{{ isEditing ? 'EDIT USER' : 'CREATE USER' }}</header>
				<div class="modal-body">
					<label>
						<span>NAME</span>
						<input v-model="userForm.name" type="text" />
					</label>
					<label>
						<span>SURNAME</span>
						<input v-model="userForm.surname" type="text" />
					</label>
					<label>
						<span>EMAIL</span>
						<input v-model="userForm.email" type="email" />
					</label>
					<label>
						<span>PASSWORD</span>
						<input v-model="userForm.password" type="password" />
					</label>
					<label>
						<span>DNI</span>
						<input v-model="userForm.dni" type="text" />
					</label>
				</div>
				<footer class="modal-foot">
					<button type="button" class="modal-cancel" @click="closeUserModal">CANCEL</button>
					<button type="button" class="modal-submit" @click="saveUser">{{ isEditing ? 'SAVE' : 'CREATE' }}</button>
				</footer>
			</div>
		</div>

		<div v-if="showDeleteConfirm" class="confirm-box">
			<p>¿Are you sure you want to delete this user?</p>
			<div class="confirm-actions">
				<button type="button" class="confirm-cancel" @click="closeDeleteConfirm">CANCEL</button>
				<button type="button" class="confirm-accept" @click="deleteUser">ACCEPT</button>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const nextIdSeed = ref(11235423)

const users = ref([
	{ id: 11235423, name: 'Jane', surname: 'Doe', email: 'janedoe@nerevian.com', dni: '53258673X' },
	{ id: 11235424, name: 'Carlos', surname: 'Ruiz', email: 'cruiz@nerevian.com', dni: '45122780M' },
	{ id: 11235425, name: 'Ana', surname: 'Pardo', email: 'apardo@nerevian.com', dni: '92846652K' },
	{ id: 11235426, name: 'Luis', surname: 'Ibarra', email: 'libarra@nerevian.com', dni: '33124489J' },
	{ id: 11235427, name: 'Marta', surname: 'Vega', email: 'mvega@nerevian.com', dni: '78341290H' },
	{ id: 11235428, name: 'David', surname: 'Soler', email: 'dsoler@nerevian.com', dni: '50229844B' },
	{ id: 11235429, name: 'Irene', surname: 'Nieto', email: 'inieto@nerevian.com', dni: '63547821Q' },
	{ id: 11235430, name: 'Pablo', surname: 'Mora', email: 'pmora@nerevian.com', dni: '71652093L' },
	{ id: 11235431, name: 'Nora', surname: 'Campos', email: 'ncampos@nerevian.com', dni: '46882157T' },
	{ id: 11235432, name: 'Mario', surname: 'Costa', email: 'mcosta@nerevian.com', dni: '60999321Z' },
	{ id: 11235433, name: 'Julia', surname: 'Lozano', email: 'jlozano@nerevian.com', dni: '79923415N' },
	{ id: 11235434, name: 'Eric', surname: 'Sanz', email: 'esanz@nerevian.com', dni: '58700123D' },
	{ id: 11235435, name: 'Sofia', surname: 'Ramos', email: 'sramos@nerevian.com', dni: '31004475C' },
	{ id: 11235436, name: 'Alvaro', surname: 'Bellido', email: 'abellido@nerevian.com', dni: '94431028P' }
])

const filters = reactive({
	id: '',
	name: '',
	surname: '',
	email: '',
	dni: ''
})

const itemsPerPage = 12
const currentPage = ref(1)

const showUserModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const selectedUserId = ref(null)

const userForm = reactive({
	name: '',
	surname: '',
	email: '',
	password: '',
	dni: ''
})

const filteredUsers = computed(() => {
	const normalize = (value) => String(value).toLowerCase().trim()

	return users.value.filter((user) => {
		if (filters.id && !String(user.id).includes(filters.id.trim())) return false
		if (filters.name && !normalize(user.name).includes(normalize(filters.name))) return false
		if (filters.surname && !normalize(user.surname).includes(normalize(filters.surname))) return false
		if (filters.email && !normalize(user.email).includes(normalize(filters.email))) return false
		if (filters.dni && !normalize(user.dni).includes(normalize(filters.dni))) return false
		return true
	})
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage)))

const pagedUsers = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage
	return filteredUsers.value.slice(start, start + itemsPerPage)
})

const visiblePages = computed(() => {
	const pages = []
	for (let i = 1; i <= totalPages.value; i += 1) pages.push(i)
	return pages
})

watch(filteredUsers, () => {
	if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

const goBack = () => {
	router.push({ name: 'dashboard' })
}

const goToPage = (page) => {
	if (page < 1 || page > totalPages.value) return
	currentPage.value = page
}

const resetUserForm = () => {
	userForm.name = ''
	userForm.surname = ''
	userForm.email = ''
	userForm.password = ''
	userForm.dni = ''
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
	userForm.password = ''
	userForm.dni = user.dni
	showUserModal.value = true
}

const closeUserModal = () => {
	showUserModal.value = false
}

const saveUser = () => {
	if (!userForm.name || !userForm.surname || !userForm.email || !userForm.dni) return

	if (isEditing.value && selectedUserId.value !== null) {
		const target = users.value.find((user) => user.id === selectedUserId.value)
		if (!target) return
		target.name = userForm.name
		target.surname = userForm.surname
		target.email = userForm.email
		target.dni = userForm.dni
		showUserModal.value = false
		return
	}

	nextIdSeed.value += 1
	users.value.unshift({
		id: nextIdSeed.value,
		name: userForm.name,
		surname: userForm.surname,
		email: userForm.email,
		dni: userForm.dni
	})
	showUserModal.value = false
	currentPage.value = 1
}

const openDeleteConfirm = (user) => {
	selectedUserId.value = user.id
	showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
	showDeleteConfirm.value = false
	selectedUserId.value = null
}

const deleteUser = () => {
	users.value = users.value.filter((user) => user.id !== selectedUserId.value)
	showDeleteConfirm.value = false
	selectedUserId.value = null
}
</script>

<style scoped>
.user-panel-page {
	min-height: 100vh;
	background: #e8e8dd;
	padding: 1.2rem 1.4rem 1.6rem;
	position: relative;
}

.user-panel-topbar {
	margin-bottom: 0.65rem;
}

.back-btn {
	border: none;
	background: transparent;
	color: #118c8c;
	font-size: 2rem;
	font-weight: 900;
	line-height: 1;
	cursor: pointer;
	padding: 0;
}

.panel-toolbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.55rem;
}

.add-user-btn {
	border: none;
	background: #ff6666;
	color: #fff;
	border-radius: 7px;
	padding: 0.62rem 1.95rem;
	font-size: 0.9rem;
	font-weight: 600;
	letter-spacing: 0.25px;
	cursor: pointer;
}

.filter-btn {
	border: none;
	background: #118c8c;
	color: #fff;
	border-radius: 7px;
	width: 34px;
	height: 34px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.filter-glyph {
	position: relative;
	width: 14px;
	height: 14px;
	display: inline-block;
}

.filter-glyph::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	width: 14px;
	height: 9px;
	border: 2px solid #ffffff;
	border-bottom: none;
	border-radius: 2px 2px 0 0;
	clip-path: polygon(0 0, 100% 0, 66% 100%, 34% 100%);
}

.filter-glyph::after {
	content: '';
	position: absolute;
	left: 6px;
	top: 8px;
	width: 2px;
	height: 6px;
	background: #ffffff;
	border-radius: 1px;
}

.users-table-wrap {
	background: #abd2c7;
	border-radius: 10px;
	overflow: hidden;
}

.table-head,
.table-filters,
.table-row {
	display: grid;
	grid-template-columns: 0.9fr 1fr 1fr 1.6fr 1.3fr 1fr;
	align-items: center;
}

.table-head {
	background: #118c8c;
	color: #ebf7f8;
	font-size: 0.92rem;
	font-weight: 600;
	padding: 0.64rem 0;
}

.table-head span,
.table-filters input,
.table-row > span,
.action-cell {
	padding: 0 0.75rem;
	border-right: 1px solid rgba(17, 140, 140, 0.45);
	min-height: 100%;
	display: flex;
	align-items: center;
}

.table-head span:last-child,
.table-filters :last-child,
.table-row > span:last-child,
.action-cell:last-child {
	border-right: none;
}

.table-filters {
	background: #abd2c7;
	padding: 0.45rem 0;
	border-bottom: 1px solid rgba(17, 140, 140, 0.35);
}

.table-filters input {
	min-height: 26px;
	border: none;
	border-radius: 4px;
	background: #eef0e8;
	font-size: 0.66rem;
	color: #22565c;
	outline: none;
	padding-left: 0.45rem;
	padding-right: 0.45rem;
	margin: 0 0.3rem;
}

.table-body {
	background: #abd2c7;
}

.table-row {
	font-size: 1.72rem;
	color: #1f4d53;
	min-height: 44px;
	border-bottom: 1px solid rgba(17, 140, 140, 0.4);
}

.table-row > span {
	font-size: 1.72rem;
	line-height: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.action-cell {
	justify-content: center;
	gap: 0.42rem;
	padding-right: 0;
}

.icon-btn {
	border: none;
	background: transparent;
	color: #0a434a;
	font-size: 1rem;
	cursor: pointer;
	line-height: 1;
	padding: 0.1rem;
}

.icon-btn:hover {
	color: #082e34;
}

.empty-row {
	margin: 0;
	padding: 1rem;
	font-size: 0.86rem;
	color: #225057;
}

.center-cell {
	justify-content: center;
}

.table-footer {
	display: flex;
	justify-content: center;
	gap: 0.3rem;
	padding: 0.9rem 0.8rem;
	background: #abd2c7;
}

.table-footer button {
	border: none;
	background: transparent;
	color: #118c8c;
	font-size: 1.1rem;
	cursor: pointer;
	padding: 0;
	min-width: 16px;
}

.table-footer button:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

.table-footer .active {
	font-weight: 800;
	color: #0b6262;
}

.overlay {
	position: fixed;
	inset: 0;
	background: rgba(10, 45, 49, 0.5);
	display: grid;
	place-items: center;
	padding: 1rem;
	z-index: 15;
}

.modal-card {
	width: min(520px, 100%);
	background: #ece9dd;
	border-radius: 5px;
	overflow: hidden;
	box-shadow: 0 12px 22px rgba(0, 0, 0, 0.22);
}

.modal-head {
	background: #083f49;
	color: #fff;
	font-size: 0.92rem;
	text-align: center;
	padding: 0.5rem;
	font-weight: 700;
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
	font-size: 0.72rem;
	color: #213c41;
	font-weight: 600;
}

.modal-body input {
	border: none;
	border-radius: 4px;
	background: #d8d8d8;
	height: 31px;
	padding: 0 0.5rem;
	font-size: 0.78rem;
	outline: none;
	color: #15373e;
}

.modal-foot {
	display: flex;
	justify-content: flex-end;
	gap: 0.45rem;
	padding: 0 0.9rem 0.75rem;
}

.modal-cancel,
.modal-submit {
	border: none;
	border-radius: 4px;
	padding: 0.32rem 0.8rem;
	font-size: 0.68rem;
	cursor: pointer;
}

.modal-cancel {
	background: #d9d9d9;
	color: #314f53;
}

.modal-submit {
	background: #ff6666;
	color: #fff;
}

.confirm-box {
	position: absolute;
	right: 2.3rem;
	top: 9.2rem;
	background: #f8f8f6;
	border-radius: 6px;
	padding: 0.72rem 0.85rem;
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
	z-index: 12;
	width: min(380px, calc(100% - 2rem));
}

.confirm-box p {
	margin: 0;
	font-size: 0.78rem;
	color: #1f363a;
	text-align: center;
}

.confirm-actions {
	margin-top: 0.55rem;
	display: flex;
	justify-content: flex-end;
	gap: 0.45rem;
}

.confirm-cancel,
.confirm-accept {
	border: none;
	border-radius: 4px;
	font-size: 0.65rem;
	padding: 0.26rem 0.9rem;
	cursor: pointer;
}

.confirm-cancel {
	background: #e4e4e4;
	color: #365257;
}

.confirm-accept {
	background: #ff6666;
	color: #fff;
}

@media (max-width: 1100px) {
	.users-table-wrap {
		overflow-x: auto;
	}

	.table-head,
	.table-filters,
	.table-row {
		min-width: 880px;
	}
}

@media (max-width: 640px) {
	.user-panel-page {
		padding: 0.9rem 0.65rem 1.2rem;
	}

	.panel-toolbar {
		gap: 0.5rem;
	}

	.add-user-btn {
		padding: 0.52rem 1rem;
		font-size: 0.74rem;
	}

	.confirm-box {
		right: 0.65rem;
		top: 7.4rem;
	}
}
</style>