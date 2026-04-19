import apiClient from "./api"

const normalizeClientName = (value) => String(value || "").trim()

const sortClients = (clients) =>
    [...clients].sort((left, right) =>
        normalizeClientName(left.name).localeCompare(normalizeClientName(right.name)),
    )

export const mapAdminClient = (client, fallback = {}) => ({
    id: Number(client.id),
    name: client.nom || "",
    cif: client.cif || "",
    offersCount: Number(client.ofertes_count ?? fallback.offersCount ?? 0),
    usersCount: Number(client.usuaris_count ?? fallback.usersCount ?? 0),
    raw: client,
})

const buildClientPayload = (form) => ({
    nom: form.name.trim(),
    cif: form.cif.trim(),
})

export const fetchAdminClients = async () => {
    const { data } = await apiClient.get("/admin/clients")
    const clients = Array.isArray(data) ? data : (data.clients ?? [])

    return sortClients(clients.map((client) => mapAdminClient(client)))
}

export const createAdminClient = async (form) => {
    const { data } = await apiClient.post("/admin/clients", buildClientPayload(form))

    return mapAdminClient(data.client)
}

export const updateAdminClient = async (clientId, form, currentClient = null) => {
    const { data } = await apiClient.put(`/admin/clients/${clientId}`, buildClientPayload(form))

    return mapAdminClient(data.client, {
        offersCount: currentClient?.offersCount,
        usersCount: currentClient?.usersCount,
    })
}

export const deleteAdminClient = async (clientId) => {
    await apiClient.delete(`/admin/clients/${clientId}`)
}
