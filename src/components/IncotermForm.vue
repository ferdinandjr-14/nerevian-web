<template>
  <Dialog
    v-model:visible="visibleLocal"
    modal
    :header="isEditing ? 'EDIT INCOTERM' : 'CREATE INCOTERM'"
    :draggable="false"
    :pt="dialogPT"
    @hide="handleHide"
  >
    <div class="flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-1">
      <p v-if="visibleError" class="text-sm text-red-600">{{ visibleError }}</p>

      <label class="flex flex-col gap-1.5">
        <span class="text-sm font-semibold text-dark">CODE</span>
        <InputText
          v-model="form.codi"
          class="rounded-lg border border-secondary-muted bg-primary px-3 py-2 text-dark outline-none focus:border-accent"
        />
      </label>

      <label class="flex flex-col gap-1.5">
        <span class="text-sm font-semibold text-dark">NAME</span>
        <InputText
          v-model="form.nom"
          class="rounded-lg border border-secondary-muted bg-primary px-3 py-2 text-dark outline-none focus:border-accent"
        />
      </label>

      <label class="flex flex-col gap-1.5">
        <span class="text-sm font-semibold text-dark">TRACKING STEPS</span>
        <div class="grid grid-cols-1 gap-2 rounded-lg border border-secondary-muted bg-primary p-3 sm:grid-cols-2">
          <label
            v-for="step in trackingSteps"
            :key="step.id"
            class="flex cursor-pointer items-center gap-2 rounded-md border border-secondary/15 bg-[#e4f0f3] px-2.5 py-2 text-dark"
          >
            <Checkbox
              :modelValue="form.tracking_step_ids.includes(step.id)"
              :binary="true"
              @update:modelValue="(val) => updateSelection(step.id, val)"
            />
            <span class="text-sm leading-tight">{{ step.nom }}</span>
          </label>
          <p v-if="!trackingSteps.length" class="col-span-full text-sm text-secondary/70">
            No tracking steps available.
          </p>
        </div>
      </label>
    </div>

    <template #footer>
      <Button
        label="CANCEL"
        type="button"
        severity="secondary"
        class="cursor-pointer rounded-lg border-0 px-6 py-2"
        @click="close(false)"
      />
      <Button
        :label="saving ? (isEditing ? 'SAVING...' : 'CREATING...') : (isEditing ? 'SAVE' : 'CREATE')"
        :disabled="saving"
        class="cursor-pointer rounded-lg border-0 bg-danger px-6 py-2 font-medium text-white outline-none transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        @click="submit"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { computed, watch, ref } from "vue"
import Dialog from "primevue/dialog"
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import Checkbox from "primevue/checkbox"

const props = defineProps({
  visible: { type: Boolean, default: false },
  incoterm: { type: Object, default: null },
  trackingSteps: { type: Array, default: () => [] },
  isEditing: { type: Boolean, default: false },
  saving: { type: Boolean, default: false },
  serverError: { type: String, default: "" },
})

const emits = defineEmits(["update:visible", "save", "close"])

const visibleLocal = ref(props.visible)
const form = ref({ codi: "", nom: "", tracking_step_ids: [] })
const error = ref("")
const visibleError = computed(() => error.value || props.serverError)

const dialogPT = {
  mask: {
    class: "fixed inset-0 z-50 flex items-center justify-center bg-secondary/60 backdrop-blur-[1px]",
  },
  root: {
    class: "m-4 flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-primary shadow-2xl",
  },
  header: {
    class: "flex items-center justify-between bg-secondary px-6 py-4 text-lg font-bold text-primary",
  },
  title: { class: "text-primary" },
  closeButton: {
    class: "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 text-primary outline-0 transition-colors hover:text-accent",
  },
  content: { class: "bg-primary px-6 py-5" },
  footer: { class: "flex justify-end gap-3 border-t border-secondary-muted bg-primary px-6 py-4" },
}

watch(() => props.visible, (v) => (visibleLocal.value = v))

watch(visibleLocal, (v) => {
  emits("update:visible", v)
})

watch(
  () => props.incoterm,
  (val) => {
    if (val) {
      form.value = {
        codi: val.codi || "",
        nom: val.nom || "",
        tracking_step_ids: (val.tracking_steps || []).map((s) => s.id),
      }
    } else {
      form.value = { codi: "", nom: "", tracking_step_ids: [] }
    }
  },
  { immediate: true },
)

const updateSelection = (id, checked) => {
  if (checked) {
    if (!form.value.tracking_step_ids.includes(id)) form.value.tracking_step_ids.push(id)
  } else {
    const i = form.value.tracking_step_ids.indexOf(id)
    if (i > -1) form.value.tracking_step_ids.splice(i, 1)
  }
}

const submit = () => {
  error.value = ""
  if (!form.value.codi.trim()) return (error.value = "Code is required")
  if (!form.value.nom.trim()) return (error.value = "Name is required")
  emits("save", { ...form.value })
}

const close = (bySave = false) => {
  emits("update:visible", false)
  emits("close", bySave)
}

const handleHide = () => {
  emits("update:visible", false)
}
</script>
