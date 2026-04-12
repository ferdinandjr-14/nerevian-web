import { reactive } from "vue"
import apiClient from "./api"
import { clearStoredSession, getStoredToken, getStoredUser, persistSession } from "./auth-storage"

export const authState = reactive({
    token: getStoredToken(),
    user: getStoredUser(),
    restored: false,
})

let restorePromise = null

export const isAuthenticated = () => Boolean(authState.token && authState.user?.id)

export const setSession = ({ token, user }) => {
    authState.token = token
    authState.user = user
    authState.restored = true
    persistSession({ token, user })
}

export const clearSession = () => {
    authState.token = null
    authState.user = null
    authState.restored = true
    clearStoredSession()
}

export const login = async ({ correu, contrasenya }) => {
    const { data } = await apiClient.post("/auth/login", {
        correu,
        contrasenya,
    })

    setSession({
        token: data.token,
        user: data.user,
    })

    return data.user
}

export const restoreSession = async () => {
    if (restorePromise) {
        return restorePromise
    }

    const token = getStoredToken()

    if (!token) {
        clearSession()
        return null
    }

    restorePromise = apiClient
        .get("/auth/me")
        .then(({ data }) => {
            setSession({
                token,
                user: data.user,
            })

            return data.user
        })
        .catch((error) => {
            clearSession()
            throw error
        })
        .finally(() => {
            restorePromise = null
        })

    return restorePromise
}

export const logout = async () => {
    try {
        if (authState.token) {
            await apiClient.post("/auth/logout")
        }
    } finally {
        clearSession()
    }
}
