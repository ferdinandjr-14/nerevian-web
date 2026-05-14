import apiClient from "./api"

const mapIncoterm = (incoterm) => ({
    id: Number(incoterm.id),
    codi: incoterm.codi || "",
    nom: incoterm.nom || "",
    tracking_steps: Array.isArray(incoterm.tracking_steps) ? incoterm.tracking_steps : [],
    raw: incoterm,
})

const buildIncotermPayload = (form) => ({
    codi: form.codi.trim(),
    nom: form.nom.trim(),
    tracking_step_ids: form.tracking_step_ids || [],
})

export const fetchIncoterms = async () => {
    const { data } = await apiClient.get("/admin/incoterms")
    const incoterms = Array.isArray(data) ? data : (data.incoterms ?? [])
    return incoterms.map((incoterm) => mapIncoterm(incoterm))
}

export const fetchTrackingSteps = async () => {
    const { data } = await apiClient.get("/admin/tracking-steps")
    return Array.isArray(data) ? data : (data.tracking_steps ?? [])
}

export const createIncoterm = async (form) => {
    const { data } = await apiClient.post("/admin/incoterms", buildIncotermPayload(form))
    return mapIncoterm(data.incoterm)
}

export const updateIncoterm = async (incotermId, form) => {
    const { data } = await apiClient.put(`/admin/incoterms/${incotermId}`, buildIncotermPayload(form))
    return mapIncoterm(data.incoterm)
}

export const deleteIncoterm = async (incotermId) => {
    await apiClient.delete(`/admin/incoterms/${incotermId}`)
}
