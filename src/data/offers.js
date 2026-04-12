export const OFFER_STATUS_IDS = {
    PENDING: 1,
    ACCEPTED: 2,
    REJECTED: 3,
    SHIPPED: 4,
    DELAYED: 5,
    FINALIZED: 6,
    IN_TRANSIT: 7,
    OUT_FOR_DELIVERY: 8,
}

export const OFFER_STATUSES = [
    { id: OFFER_STATUS_IDS.PENDING, label: "Pending" },
    { id: OFFER_STATUS_IDS.ACCEPTED, label: "Accepted" },
    { id: OFFER_STATUS_IDS.REJECTED, label: "Rejected" },
    { id: OFFER_STATUS_IDS.SHIPPED, label: "Shipped" },
    { id: OFFER_STATUS_IDS.DELAYED, label: "Delayed" },
    { id: OFFER_STATUS_IDS.FINALIZED, label: "Finalized" },
    { id: OFFER_STATUS_IDS.IN_TRANSIT, label: "In Transit" },
    { id: OFFER_STATUS_IDS.OUT_FOR_DELIVERY, label: "Out for Delivery" },
]

export const ACTIVE_OFFER_STATUS_IDS = [
    OFFER_STATUS_IDS.ACCEPTED,
    OFFER_STATUS_IDS.SHIPPED,
    OFFER_STATUS_IDS.DELAYED,
    OFFER_STATUS_IDS.IN_TRANSIT,
    OFFER_STATUS_IDS.OUT_FOR_DELIVERY,
]

export const TRACKING_OFFER_STATUS_IDS = [
    OFFER_STATUS_IDS.ACCEPTED,
    OFFER_STATUS_IDS.SHIPPED,
    OFFER_STATUS_IDS.IN_TRANSIT,
]
