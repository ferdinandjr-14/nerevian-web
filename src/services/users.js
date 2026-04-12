import apiClient from "./api"

const USERS_PER_PAGE = 100

const ROLE_LABELS = {
    admin: "Admins",
    operator: "Operators",
    commercial: "Commercials",
    client: "Clients",
}

const normalizeRoleKey = (roleName) =>
    String(roleName || "")
        .trim()
        .toLowerCase()

export const formatRoleLabel = (roleName) => {
    const normalizedRole = normalizeRoleKey(roleName)

    if (!normalizedRole) {
        return "Unknown"
    }

    return (
        ROLE_LABELS[normalizedRole] ||
        normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)
    )
}

export const mapRoleOption = (role) => ({
    id: Number(role.id),
    value: Number(role.id),
    key: normalizeRoleKey(role.rol),
    label: formatRoleLabel(role.rol),
    raw: role,
})

export const mapClientOption = (client) => ({
    id: Number(client.id),
    value: Number(client.id),
    name: client.nom || "",
    cif: client.cif || "",
    label: client.cif ? `${client.nom} (${client.cif})` : client.nom || "",
    raw: client,
})

export const mapAdminUser = (user) => {
    const roleName = user.rol?.rol || ""

    return {
        id: Number(user.id),
        name: user.nom || "",
        surname: user.cognoms || "",
        email: user.correu || "",
        roleId: user.rol_id !== null && user.rol_id !== undefined ? Number(user.rol_id) : null,
        roleKey: normalizeRoleKey(roleName),
        roleLabel: formatRoleLabel(roleName),
        clientId:
            user.client_id !== null && user.client_id !== undefined ? Number(user.client_id) : null,
        clientName: user.client?.nom || "",
        clientCif: user.client?.cif || "",
        raw: user,
    }
}

const buildUserPayload = (form, { includePassword } = { includePassword: false }) => {
    const payload = {
        nom: form.name.trim(),
        cognoms: form.surname.trim() || null,
        correu: form.email.trim(),
        rol_id: Number(form.roleId),
        client_id: form.clientId ? Number(form.clientId) : null,
    }

    if (includePassword || form.password.trim()) {
        payload.contrasenya = form.password
        payload.contrasenya_confirmation = form.passwordConfirmation
    }

    return payload
}

const sortUsers = (users) => [...users].sort((left, right) => left.id - right.id)

export const fetchAdminRoles = async () => {
    const { data } = await apiClient.get("/admin/rols")
    return (data.roles ?? []).map(mapRoleOption)
}

export const fetchAdminClients = async () => {
    const { data } = await apiClient.get("/admin/clients/options")
    return (data.clients ?? []).map(mapClientOption)
}

export const fetchAdminUsers = async () => {
    const users = []
    let page = 1
    let lastPage = 1

    do {
        const { data } = await apiClient.get("/admin/users", {
            params: {
                page,
                per_page: USERS_PER_PAGE,
            },
        })

        users.push(...(data.data ?? []))
        lastPage = Number(data.last_page || 1)
        page += 1
    } while (page <= lastPage)

    return sortUsers(users.map(mapAdminUser))
}

export const createAdminUser = async (form) => {
    const payload = buildUserPayload(form, { includePassword: true })
    const { data } = await apiClient.post("/admin/users", payload)

    return mapAdminUser(data.user)
}

export const updateAdminUser = async (userId, form) => {
    const payload = buildUserPayload(form)
    const { data } = await apiClient.put(`/admin/users/${userId}`, payload)

    return mapAdminUser(data.user)
}

export const deleteAdminUser = async (userId) => {
    await apiClient.delete(`/admin/users/${userId}`)
}
