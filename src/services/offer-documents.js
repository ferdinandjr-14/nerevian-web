const OFFER_DOCUMENTS_KEY = "nerevian.offer.documents"

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined"

const readStore = () => {
    if (!canUseStorage()) return {}

    try {
        return JSON.parse(window.localStorage.getItem(OFFER_DOCUMENTS_KEY) || "{}")
    } catch {
        return {}
    }
}

const writeStore = (store) => {
    if (!canUseStorage()) return
    window.localStorage.setItem(OFFER_DOCUMENTS_KEY, JSON.stringify(store))
}

export const saveOfferDocuments = (offerId, documents = []) => {
    if (!offerId) return

    const store = readStore()
    store[String(offerId)] = documents.map((document) => ({
        name: document.name,
        isPreset: true,
    }))
    writeStore(store)
}

export const getOfferDocuments = (offerId) => {
    if (!offerId) return []

    const store = readStore()
    return Array.isArray(store[String(offerId)]) ? store[String(offerId)] : []
}
