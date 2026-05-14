import apiClient from "./api"

const mapIncoterm = (incoterm) => {
    const source = incoterm || {}

    return {
        id: Number(source.id ?? 0),
        codi: source.codi || "",
        nom: source.nom || "",
        tracking_steps: Array.isArray(source.tracking_steps)
            ? source.tracking_steps
            : Array.isArray(source.trackingSteps)
              ? source.trackingSteps
              : [],
        raw: source,
    }
}

const extractIncotermFromResponse = (data) => data?.incoterm ?? data?.data ?? data ?? null

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
    return mapIncoterm(extractIncotermFromResponse(data))
}

export const updateIncoterm = async (incotermId, form) => {
    const { data } = await apiClient.put(`/admin/incoterms/${incotermId}`, buildIncotermPayload(form))
    return mapIncoterm(extractIncotermFromResponse(data))
}

export const deleteIncoterm = async (incotermId) => {
    await apiClient.delete(`/admin/incoterms/${incotermId}`)
}
