<template>
    <article class="relative flex min-h-44 flex-col gap-4 rounded-xl bg-accent p-5 shadow-sm">
        <div class="absolute top-4 right-4 flex gap-2">
            <Button
                icon="pi pi-pencil"
                text
                type="button"
                class="cursor-pointer text-secondary"
                aria-label="Edit client"
                @click="$emit('edit', client)"
            />
            <Button
                icon="pi pi-trash"
                text
                type="button"
                :disabled="isDeleting"
                :class="[
                    'cursor-pointer',
                    isDeleting ? 'cursor-not-allowed text-secondary/40' : 'text-red-400',
                ]"
                aria-label="Delete client"
                @click="$emit('delete', $event, client)"
            />
        </div>

        <div class="pr-18">
            <h2 class="text-xl font-bold text-secondary">{{ client.name || "-" }}</h2>
            <p class="text-lg text-secondary/85">{{ client.cif || "-" }}</p>
        </div>

        <div class="mt-auto rounded-lg bg-primary/80 px-4 py-3">
            <p class="text-sm font-medium uppercase tracking-wide text-secondary/70">Offers</p>
            <p class="text-3xl font-bold text-secondary">{{ client.offersCount }}</p>
        </div>
    </article>
</template>

<script setup>
defineProps({
    client: {
        type: Object,
        required: true,
    },
    isDeleting: {
        type: Boolean,
        default: false,
    },
})

defineEmits(["edit", "delete"])
</script>
