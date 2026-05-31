<template>
  <tr class="text-secondary transition-colors hover:bg-secondary/8">
    <td class="px-6 py-4 align-top">
      <div class="text-sm font-semibold tracking-wide">{{ incoterm.codi }}</div>
    </td>
    <td class="px-6 py-4 align-top text-sm font-medium">{{ incoterm.nom }}</td>
    <td class="px-6 py-4 align-top">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="s in incoterm.tracking_steps"
          :key="s.id"
          class="rounded-full bg-secondary/15 px-2.5 py-1 text-xs font-semibold text-secondary"
          >{{ s.nom }}</span
        >
        <span v-if="!incoterm.tracking_steps?.length" class="text-sm text-secondary/60">-</span>
      </div>
    </td>
    <td class="px-6 py-4 align-top">
      <div class="flex gap-2">
        <Button icon="pi pi-pencil" severity="warning" text rounded @click="$emit('edit', incoterm)" />
        <Button icon="pi pi-trash" severity="danger" text rounded @click="$emit('delete', incoterm)" />
      </div>
    </td>
  </tr>
</template>

<script setup>
import Button from "primevue/button"

const props = defineProps({ incoterm: { type: Object, required: true } })
const emits = defineEmits(['edit', 'delete'])
</script>
