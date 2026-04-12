import { createRouter, createWebHistory } from "vue-router"
import { isAuthenticated, restoreSession } from "@/services/auth"

const ProtectedLayout = () => import("../layouts/ProtectedLayout.vue")

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("../views/Login.vue"),
        },
        {
            path: "/",
            component: ProtectedLayout,
            meta: { requiresAuth: true },
            children: [
                { path: "", redirect: { name: "dashboard" } },
                {
                    path: "dashboard",
                    name: "dashboard",
                    component: () => import("../views/Dashboard.vue"),
                },
                { path: "offers", name: "offers", component: () => import("../views/Offers.vue") },
                {
                    path: "offers/:id",
                    name: "offer-detail",
                    component: () => import("../views/OfferDetails.vue"),
                    props: true,
                },
                {
                    path: "tracking",
                    name: "tracking",
                    component: () => import("../views/Tracking.vue"),
                },
                {
                    path: "tracking/:id",
                    name: "tracking-detail",
                    component: () => import("../views/TrackingDetails.vue"),
                    props: true,
                },
                {
                    path: "create-offer",
                    name: "create-offer",
                    component: () => import("../views/CreateOffer.vue"),
                },
                {
                    path: "data-panel",
                    name: "data-panel",
                    component: () => import("../views/DataPanel.vue"),
                },
                {
                    path: "user-panel",
                    name: "user-panel",
                    component: () => import("../views/UserPanel.vue"),
                },
                {
                    path: "Userpanel",
                    redirect: { name: "user-panel" },
                },
                {
                    path: "userpanel",
                    redirect: { name: "user-panel" },
                },
            ],
        },
    ],
})

router.beforeEach(async (to) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

    if (requiresAuth && !isAuthenticated()) {
        try {
            await restoreSession()
        } catch {
            return {
                name: "login",
                query: { redirect: to.fullPath },
            }
        }
    }

    if (requiresAuth && !isAuthenticated()) {
        return {
            name: "login",
            query: { redirect: to.fullPath },
        }
    }

    if (to.name === "login" && isAuthenticated()) {
        const redirect = typeof to.query.redirect === "string" ? to.query.redirect : ""
        return redirect || { name: "dashboard" }
    }

    return true
})

export default router
