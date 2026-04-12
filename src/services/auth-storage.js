const AUTH_TOKEN_KEY = "nerevian.auth.token"
const AUTH_USER_KEY = "nerevian.auth.user"

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined"

const parseStoredUser = (value) => {
    if (!value) return null

    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}

export const getStoredToken = () => {
    if (!canUseStorage()) return null
    return window.localStorage.getItem(AUTH_TOKEN_KEY)
}

export const getStoredUser = () => {
    if (!canUseStorage()) return null
    return parseStoredUser(window.localStorage.getItem(AUTH_USER_KEY))
}

export const persistSession = ({ token, user }) => {
    if (!canUseStorage()) return

    window.localStorage.setItem(AUTH_TOKEN_KEY, token)
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

export const clearStoredSession = () => {
    if (!canUseStorage()) return

    window.localStorage.removeItem(AUTH_TOKEN_KEY)
    window.localStorage.removeItem(AUTH_USER_KEY)
}
