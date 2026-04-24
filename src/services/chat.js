import apiClient from "./api"

export const sendChatMessage = async (message) => {
    const { data } = await apiClient.post("/chat", { message })

    if (!data?.reply) {
        throw new Error("There was an unexpected error. Please try again.")
    }

    return data.reply
}
