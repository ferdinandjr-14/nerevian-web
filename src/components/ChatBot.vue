<template>
    <section
        class="flex h-full min-h-[78vh] flex-col overflow-hidden rounded-[2rem] border border-secondary-muted bg-secondary text-primary shadow-[0_20px_60px_rgba(10,58,64,0.22)]"
    >
        <header class="border-b border-secondary-muted bg-linear-to-br from-secondary to-secondary-muted p-5">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-accent-muted">
                Analytics Copilot
            </p>
            <div class="mt-3 flex items-start justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-semibold">Nerevian Assistant</h2>
                    <p class="mt-1 text-sm text-primary/70">
                        Ask your n8n workflow about trade data, bottlenecks and dashboard trends.
                    </p>
                </div>
                <span
                    class="rounded-full border border-accent/30 bg-accent/15 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent-muted"
                >
                    n8n + Ollama
                </span>
            </div>
        </header>

        <div class="border-b border-secondary-muted px-5 py-4">
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="prompt in suggestedPrompts"
                    :key="prompt"
                    type="button"
                    class="cursor-pointer rounded-full border border-accent/30 bg-primary/6 px-3 py-2 text-xs font-medium text-primary/85 transition hover:border-accent hover:bg-accent/12 hover:text-primary"
                    :disabled="isLoading"
                    @click="sendPrompt(prompt)"
                >
                    {{ prompt }}
                </button>
            </div>
        </div>

        <div
            ref="messagesRef"
            class="flex-1 space-y-4 overflow-y-auto bg-linear-to-b from-secondary to-[#072b31] px-5 py-5"
        >
            <article
                v-for="message in messages"
                :key="message.id"
                :class="message.role === 'user' ? 'ml-auto max-w-[88%]' : 'mr-auto max-w-[92%]'"
            >
                <div
                    :class="
                        message.role === 'user'
                            ? 'rounded-[1.5rem] rounded-br-md bg-accent px-4 py-3 text-sm leading-6 text-primary shadow-lg'
                            : 'rounded-[1.5rem] rounded-bl-md border border-primary/10 bg-primary/8 px-4 py-3 text-sm leading-6 text-primary/92 backdrop-blur-sm'
                    "
                >
                    {{ message.content }}
                </div>
            </article>

            <article v-if="isLoading" class="mr-auto max-w-[92%]">
                <div
                    class="flex items-center gap-2 rounded-[1.5rem] rounded-bl-md border border-primary/10 bg-primary/8 px-4 py-3 text-sm text-primary/75"
                >
                    <LoadingSpinner />
                    <span>Thinking through the workflow...</span>
                </div>
            </article>
        </div>

        <footer class="border-t border-secondary-muted bg-secondary p-4">
            <form class="flex items-end gap-3" @submit.prevent="send">
                <label class="flex-1">
                    <span class="sr-only">Message the assistant</span>
                    <textarea
                        v-model="draft"
                        rows="3"
                        class="min-h-28 w-full resize-none rounded-[1.5rem] border border-secondary-muted bg-primary px-4 py-3 text-sm text-dark outline-none transition placeholder:text-dark/40 focus:border-accent"
                        :disabled="isLoading"
                        placeholder="Ask about imports, route risk, year-over-year changes, or what the dashboard is showing..."
                        @keydown.enter.exact.prevent="send"
                    />
                </label>

                <button
                    type="submit"
                    class="flex h-12 min-w-12 cursor-pointer items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-primary transition hover:bg-[#0e7a7a] disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="isLoading || !canSend"
                >
                    <i class="pi pi-send text-sm" />
                </button>
            </form>
        </footer>
    </section>
</template>

<script setup>
import { computed, nextTick, ref } from "vue"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { sendChatMessage } from "@/services/chat"

const suggestedPrompts = [
    "Summarize what stands out on this dashboard",
    "Which lanes look riskier this week?",
    "Explain the key trade trend in plain English",
]

const draft = ref("")
const isLoading = ref(false)
const messagesRef = ref(null)
const messages = ref([
    {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
            "I’m connected to the logistics workflow. Ask for trends, anomalies, or a short explanation of what you see in the Superset dashboard.",
    },
])

const canSend = computed(() => draft.value.trim().length > 0)

const scrollToBottom = async () => {
    await nextTick()

    if (messagesRef.value) {
        messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
}

const pushMessage = (role, content) => {
    messages.value.push({
        id: crypto.randomUUID(),
        role,
        content,
    })
}

const sendPrompt = async (prompt) => {
    draft.value = prompt
    await send()
}

const send = async () => {
    const message = draft.value.trim()

    if (!message || isLoading.value) {
        return
    }

    pushMessage("user", message)
    draft.value = ""
    isLoading.value = true
    await scrollToBottom()

    try {
        const reply = await sendChatMessage(message)
        pushMessage("assistant", reply)
    } catch (error) {
        pushMessage(
            "assistant",
            error?.response?.data?.message ||
                error?.message ||
                "I couldn't reach the analytics assistant right now.",
        )
    } finally {
        isLoading.value = false
        await scrollToBottom()
    }
}
</script>
