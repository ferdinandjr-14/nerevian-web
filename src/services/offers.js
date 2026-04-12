import apiClient from "./api"

export const TRANSPORT_TYPE = Object.freeze({
    MARITIME: 1,
    AIR: 3,
})

const getTodayValue = () => {
    const now = new Date()
    const offsetMs = now.getTimezoneOffset() * 60 * 1000
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10)
}

const normalizeOptionalNumber = (value) => {
    if (value === "" || value === null || value === undefined) return null
    return Number(value)
}

const getIncotermCode = (offer) => offer.incoterm?.tipus_incoterm?.codi?.trim() ?? ""

export const createEmptyOfferForm = () => ({
    tipus_transport_id: null,
    tipus_fluxe_id: null,
    tipus_carrega_id: null,
    incoterm_id: null,
    client_id: null,
    comentaris: "",
    transportista_id: null,
    pes_brut: "",
    volum: "",
    tipus_validacio_id: null,
    port_origen_id: null,
    port_desti_id: null,
    aeroport_origen_id: null,
    aeroport_desti_id: null,
    linia_transport_maritim_id: null,
    data_creacio: getTodayValue(),
    data_validessa_inicial: "",
    data_validessa_fina: "",
    tipus_contenidor_id: null,
})

export const assignOfferToForm = (form, offer) => {
    Object.assign(form, createEmptyOfferForm(), {
        tipus_transport_id: normalizeOptionalNumber(offer.tipus_transport_id),
        tipus_fluxe_id: normalizeOptionalNumber(offer.tipus_fluxe_id),
        tipus_carrega_id: normalizeOptionalNumber(offer.tipus_carrega_id),
        incoterm_id: normalizeOptionalNumber(offer.incoterm_id),
        client_id: normalizeOptionalNumber(offer.client_id),
        comentaris: offer.comentaris ?? "",
        transportista_id: normalizeOptionalNumber(offer.transportista_id),
        pes_brut: offer.pes_brut ?? "",
        volum: offer.volum ?? "",
        tipus_validacio_id: normalizeOptionalNumber(offer.tipus_validacio_id),
        port_origen_id: normalizeOptionalNumber(offer.port_origen_id),
        port_desti_id: normalizeOptionalNumber(offer.port_desti_id),
        aeroport_origen_id: normalizeOptionalNumber(offer.aeroport_origen_id),
        aeroport_desti_id: normalizeOptionalNumber(offer.aeroport_desti_id),
        linia_transport_maritim_id: normalizeOptionalNumber(offer.linia_transport_maritim_id),
        data_creacio: offer.data_creacio
            ? String(offer.data_creacio).slice(0, 10)
            : getTodayValue(),
        data_validessa_inicial: offer.data_validessa_inicial
            ? String(offer.data_validessa_inicial).slice(0, 10)
            : "",
        data_validessa_fina: offer.data_validessa_fina
            ? String(offer.data_validessa_fina).slice(0, 10)
            : "",
        tipus_contenidor_id: normalizeOptionalNumber(offer.tipus_contenidor_id),
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
    tipus_transport_id: normalizeOptionalNumber(form.tipus_transport_id),
    tipus_fluxe_id: normalizeOptionalNumber(form.tipus_fluxe_id),
    tipus_carrega_id: normalizeOptionalNumber(form.tipus_carrega_id),
    incoterm_id: normalizeOptionalNumber(form.incoterm_id),
    client_id: normalizeOptionalNumber(form.client_id),
    comentaris: form.comentaris?.trim() || null,
    transportista_id: normalizeOptionalNumber(form.transportista_id),
    pes_brut: form.pes_brut === "" ? null : Number(form.pes_brut),
    volum: form.volum === "" ? null : Number(form.volum),
    tipus_validacio_id: normalizeOptionalNumber(form.tipus_validacio_id),
    port_origen_id: normalizeOptionalNumber(form.port_origen_id),
    port_desti_id: normalizeOptionalNumber(form.port_desti_id),
    aeroport_origen_id: normalizeOptionalNumber(form.aeroport_origen_id),
    aeroport_desti_id: normalizeOptionalNumber(form.aeroport_desti_id),
    linia_transport_maritim_id: normalizeOptionalNumber(form.linia_transport_maritim_id),
    data_creacio: form.data_creacio || null,
    data_validessa_inicial: form.data_validessa_inicial || null,
    data_validessa_fina: form.data_validessa_fina || null,
    tipus_contenidor_id: normalizeOptionalNumber(form.tipus_contenidor_id),
})

export const mapLookupOption = (items, labelBuilder) =>
    items.map((item) => ({
        label: labelBuilder(item),
        value: item.id,
    }))

export const getOfferOriginLabel = (offer) =>
    offer.port_origen?.nom || offer.aeroport_origen?.nom || "-"

export const getOfferDestinationLabel = (offer) =>
    offer.port_desti?.nom || offer.aeroport_desti?.nom || "-"

export const mapOfferToListItem = (offer) => ({
    id: offer.id,
    estatOfertaId: normalizeOptionalNumber(offer.estat_oferta_id),
    clientName: offer.client?.nom ?? "-",
    incotermCode: getIncotermCode(offer),
    cargoTypeLabel: offer.tipus_carrega?.tipus ?? "-",
    shippingLineName: offer.linia_transport_maritim?.nom ?? offer.transportista?.nom ?? "-",
    originLabel: getOfferOriginLabel(offer),
    destinationLabel: getOfferDestinationLabel(offer),
})

export const fetchOffers = async (params = {}) => {
    const { data } = await apiClient.get("/offers", {
        params,
    })

    return {
        items: Array.isArray(data.data) ? data.data : [],
        meta: data,
    }
}

export const fetchOfferById = async (id) => {
    const { data } = await apiClient.get(`/offers/${id}`)
    return data.offer
}

export const fetchOfferLookups = async () => {
    const { data } = await apiClient.get("/lookups")
    return data
}
