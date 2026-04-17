import apiClient from "./api"

export const fetchOfferDocuments = async (offerId) => {
    if (!offerId) return []

    const { data } = await apiClient.get(`/offers/${offerId}/documents`)
    console.log(data)
    return Array.isArray(data?.documents) ? data.documents : []
}

export const uploadOfferDocuments = async (offerId, files = []) => {
    if (!offerId || !files.length) return []

    const formData = new FormData()
    files.forEach((file) => formData.append("documents[]", file))

    const { data } = await apiClient.post(`/offers/${offerId}/documents`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })

    return Array.isArray(data?.documents) ? data.documents : []
}
