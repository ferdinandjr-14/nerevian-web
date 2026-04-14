import apiClient from "./api"

export const TRANSPORT_TYPE = {
    MARITIME: 1,
}

const getTodayValue = () => {
    const now = new Date()
    const offsetMs = now.getTimezoneOffset() * 60 * 1000
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

const toNumberOrNull = (value) => {
    if (value === null || value === undefined || value === "") {
        return null
    }

    const parsedValue = Number(value)
    return Number.isNaN(parsedValue) ? null : parsedValue
}

const formatDateForInput = (value, fallback = "") => {
    if (!value) {
        return fallback
    }

    return String(value).slice(0, 10)
}

const formatDateForDisplay = (value) => {
    if (!value) {
        return "-"
    }

    const [year, month, day] = String(value).slice(0, 10).split("-")

    if (!year || !month || !day) {
        return "-"
    }

    return `${day}/${month}/${year}`
}

const getIncotermCode = (offer) => offer.incoterm?.tipus_incoterm?.codi?.trim() || "-"

export const createEmptyOfferForm = () => ({
    tipus_transport_id: 1,
    tipus_fluxe_id: null,
    tipus_carrega_id: null,
    incoterm_id: null,
    client_id: null,
    agent_comercial_id: null,
    comentaris: "",
    preu: "",
    transportista_id: null,
    pes_brut: "",
    volum: "",
    tipus_validacio_id: null,
    port_origen_id: null,
    port_desti_id: null,
    linia_transport_maritim_id: null,
    data_creacio: getTodayValue(),
    data_validessa_inicial: "",
    data_validessa_fina: "",
    tipus_contenidor_id: null,
})

export const assignOfferToForm = (form, offer) => {
    Object.assign(form, createEmptyOfferForm(), {
        tipus_transport_id: 1,
        tipus_fluxe_id: toNumberOrNull(offer.tipus_fluxe_id),
        tipus_carrega_id: toNumberOrNull(offer.tipus_carrega_id),
        incoterm_id: toNumberOrNull(offer.incoterm_id),
        client_id: toNumberOrNull(offer.client_id),
        agent_comercial_id: toNumberOrNull(offer.agent_comercial_id),
        comentaris: offer.comentaris || "",
        preu: offer.preu || "",
        transportista_id: toNumberOrNull(offer.transportista_id),
        pes_brut: offer.pes_brut || "",
        volum: offer.volum || "",
        tipus_validacio_id: toNumberOrNull(offer.tipus_validacio_id),
        port_origen_id: toNumberOrNull(offer.port_origen_id),
        port_desti_id: toNumberOrNull(offer.port_desti_id),
        linia_transport_maritim_id: toNumberOrNull(offer.linia_transport_maritim_id),
        data_creacio: formatDateForInput(offer.data_creacio, getTodayValue()),
        data_validessa_inicial: formatDateForInput(offer.data_validessa_inicial),
        data_validessa_fina: formatDateForInput(offer.data_validessa_fina),
        tipus_contenidor_id: toNumberOrNull(offer.tipus_contenidor_id),
    })
}

export const clearTransportSpecificFields = (form) => {
    const isMaritime = Number(form.tipus_transport_id) === TRANSPORT_TYPE.MARITIME
    const isAir = Number(form.tipus_transport_id) === TRANSPORT_TYPE.AIR

    if (!isMaritime) {
        form.port_origen_id = null
        form.port_desti_id = null
        form.linia_transport_maritim_id = null
        form.tipus_contenidor_id = null
    }

    if (!isAir) {
        form.aeroport_origen_id = null
        form.aeroport_desti_id = null
    }
}

export const createOfferPayload = (form) => ({
    tipus_transport_id: toNumberOrNull(form.tipus_transport_id),
    tipus_fluxe_id: toNumberOrNull(form.tipus_fluxe_id),
    tipus_carrega_id: toNumberOrNull(form.tipus_carrega_id),
    incoterm_id: toNumberOrNull(form.incoterm_id),
    client_id: toNumberOrNull(form.client_id),
    agent_comercial_id: toNumberOrNull(form.agent_comercial_id),
    comentaris: form.comentaris?.trim() || null,
    preu: toNumberOrNull(form.preu),
    transportista_id: toNumberOrNull(form.transportista_id),
    pes_brut: toNumberOrNull(form.pes_brut),
    volum: toNumberOrNull(form.volum),
    tipus_validacio_id: toNumberOrNull(form.tipus_validacio_id),
    port_origen_id: toNumberOrNull(form.port_origen_id),
    port_desti_id: toNumberOrNull(form.port_desti_id),
    aeroport_origen_id: toNumberOrNull(form.aeroport_origen_id),
    aeroport_desti_id: toNumberOrNull(form.aeroport_desti_id),
    linia_transport_maritim_id: toNumberOrNull(form.linia_transport_maritim_id),
    data_creacio: form.data_creacio || null,
    data_validessa_inicial: form.data_validessa_inicial || null,
    data_validessa_fina: form.data_validessa_fina || null,
    tipus_contenidor_id: toNumberOrNull(form.tipus_contenidor_id),
})

export const mapLookupOption = (items = [], labelBuilder) =>
    items.map((item) => ({
        label: labelBuilder(item),
        value: item.id,
    }))

export const getOfferOriginLabel = (offer) =>
    offer.port_origen?.nom || offer.aeroport_origen?.nom || "-"

export const getOfferDestinationLabel = (offer) =>
    offer.port_desti?.nom || offer.aeroport_desti?.nom || "-"

export const mapOfferSummary = (offer) => ({
    id: offer.id,
    estatOfertaId: toNumberOrNull(offer.estat_oferta_id),
    statusLabel: offer.estat_oferta?.estat || "Unknown",
    clientName: offer.client?.nom || "-",
    incotermCode: getIncotermCode(offer),
    cargoTypeLabel: offer.tipus_carrega?.tipus || "-",
    shippingLineName: offer.linia_transport_maritim?.nom || "-",
    carrierName: offer.transportista?.nom || offer.linia_transport_maritim?.nom || "-",
    originLabel: getOfferOriginLabel(offer),
    destinationLabel: getOfferDestinationLabel(offer),
    eta: formatDateForDisplay(offer.data_validessa_fina),
    createdAt: formatDateForDisplay(offer.data_creacio),
    trackingStepOrder: toNumberOrNull(offer.incoterm?.tracking_step?.ordre),
})

export const fetchOffers = async (params = {}) => {
    const { data } = await apiClient.get("/offers", { params })

    if (Array.isArray(data)) {
        return data
    }

    if (Array.isArray(data?.data)) {
        return data.data
    }

    return []
}

export const fetchOfferById = async (id) => {
    const { data } = await apiClient.get(`/offers/${id}`)
    return data.offer || data
}

export const fetchOfferLookups = async () => {
    const { data } = await apiClient.get("/lookups")
    return data
}

export const createOffer = async (formData) => {
    const { data } = await apiClient.post("/offers", formData)
    return data.offer || data
}
