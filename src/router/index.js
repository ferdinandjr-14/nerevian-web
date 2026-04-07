import { createRouter, createWebHistory } from "vue-router"

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
                { path: "dashboard", name: "dashboard", component: () => import("../views/Dashboard.vue") },
                { path: "offers", name: "offers", component: () => import("../views/Offers.vue") },
                {
                    path: "offers/:id",
                    name: "offer-detail",
                    component: () => import("../views/Offers.vue"),
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

export default router
