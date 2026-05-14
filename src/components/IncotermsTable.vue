<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-dark">Incoterms</h2>
      <Button
        label="ADD INCOTERM"
        type="button"
        class="cursor-pointer rounded-lg border-0 bg-danger px-8 py-2 font-medium text-white"
        @click="$emit('create')"
      />
    </div>

    <div class="overflow-auto rounded-xl border border-secondary/20 bg-[#e4f0f3] shadow-sm">
      <table class="w-full table-auto">
        <thead class="bg-secondary text-left text-sm text-primary">
          <tr>
            <th class="px-6 py-4 font-bold">Code</th>
            <th class="px-6 py-4 font-bold">Name</th>
            <th class="px-6 py-4 font-bold">Tracking Steps</th>
            <th class="px-6 py-4 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-secondary/15">
          <IncotermRow
            v-for="inc in incoterms"
            :key="inc.id"
            :incoterm="inc"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import IncotermRow from "./IncotermRow.vue"
import Button from "primevue/button"

const props = defineProps({
  incoterms: { type: Array, default: () => [] },
})

const emits = defineEmits(["create", "edit", "delete"]) 
</script>
