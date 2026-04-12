import axios from "axios"
import { getStoredToken } from "./auth-storage"

const resolveApiBaseUrl = () => {
    return "http://127.0.0.1:8000/api"
}

const apiClient = axios.create({
    baseURL: resolveApiBaseUrl(),
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.request.use((config) => {
    const token = getStoredToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default apiClient
