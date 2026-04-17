import { embedDashboard } from "@superset-ui/embedded-sdk"
import apiClient from "./api"

const DEFAULT_SUPERSET_URL = "http://localhost:8088"

const resolveDashboardId = (dashboardId) =>
    dashboardId || import.meta.env.VITE_SUPERSET_DASHBOARD_ID || ""

const resolveSupersetUrl = (supersetUrl) =>
    supersetUrl || import.meta.env.VITE_SUPERSET_URL || DEFAULT_SUPERSET_URL

export const fetchSupersetGuestToken = async (dashboardId) => {
    const resolvedDashboardId = resolveDashboardId(dashboardId)
    const { data } = await apiClient.get("/superset/guest-token", {
        params: resolvedDashboardId
            ? {
                  dashboard_id: resolvedDashboardId,
              }
            : {},
    })

    if (!data?.token) {
        throw new Error("Superset guest token was not returned by the API.")
    }

    return {
        token: data.token,
        dashboardId: data.dashboard_id || resolvedDashboardId,
        supersetUrl: data.superset_url || resolveSupersetUrl(),
    }
}

export const mountSupersetDashboard = async ({
    dashboardId,
    mountPoint,
    dashboardUiConfig,
    iframeTitle = "Superset dashboard",
    supersetUrl,
    debug = false,
}) => {
    if (!(mountPoint instanceof HTMLElement)) {
        throw new Error("Superset mount point is not available.")
    }

    const resolvedDashboardId = resolveDashboardId(dashboardId)
    const dashboard = await fetchSupersetGuestToken(resolvedDashboardId)

    if (!dashboard.dashboardId) {
        throw new Error("Superset dashboard id is not configured.")
    }

    return embedDashboard({
        id: dashboard.dashboardId,
        supersetDomain: resolveSupersetUrl(supersetUrl || dashboard.supersetUrl),
        mountPoint,
        fetchGuestToken: async () => {
            const refreshedDashboard = await fetchSupersetGuestToken(resolvedDashboardId)

            if (!refreshedDashboard.dashboardId) {
                throw new Error("Superset dashboard id is not configured.")
            }

            return refreshedDashboard.token
        },
        dashboardUiConfig,
        iframeTitle,
        debug,
        referrerPolicy: "strict-origin-when-cross-origin",
    })
}
