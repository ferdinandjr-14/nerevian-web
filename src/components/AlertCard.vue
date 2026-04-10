<template>
  <article class="alert-card">
    <p class="alert-title">{{ title }}</p>
    <p class="alert-text">{{ message }}</p>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true }
})
</script>

<style scoped>
.alert-card {
  border-left: 2px solid #ff3d49;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0 6px 6px 0;
  padding: 0.55rem 0.6rem;
  margin-bottom: 0.85rem;
}

.alert-card:last-child {
  margin-bottom: 0;
}

.alert-title {
  margin: 0 0 0.2rem;
  font-size: 0.64rem;
  color: #ffd1d1;
  font-weight: 700;
}

.alert-text {
  margin: 0;
  font-size: 0.6rem;
  color: #8fb1b6;
  line-height: 1.35;
}
</style>