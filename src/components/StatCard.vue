<template>
  <article class="stat-card">
    <p class="stat-label">{{ label }}</p>
    <p class="stat-value">{{ value }}</p>
  </article>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true }
})
</script>

<style scoped>
.stat-card {
  background: #073d45;
  border-radius: 8px;
  padding: 0.6rem;
  border: 1px solid #0f5660;
}

.stat-label {
  text-transform: uppercase;
  font-size: 0.72rem;
  text-align: center;
  margin: 0;
  color: #d4e6e8;
  letter-spacing: 0.4px;
  background: #084953;
  border-radius: 6px;
  padding: 0.6rem 0.4rem;
}

.stat-value {
  margin: 0.85rem 0 0.55rem;
  text-align: center;
  font-size: 2.15rem;
  font-weight: 300;
  color: #eef7f7;
}
</style>
