import apiClient from "./api"

export const sendChatMessage = async (message) => {
    const { data } = await apiClient.post("/chat", { message })

    if (!data?.reply) {
        throw new Error("The chatbot returned an empty response.")
    }

    return data.reply
}
