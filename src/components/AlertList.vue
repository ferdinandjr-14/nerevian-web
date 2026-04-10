<template>
  <aside class="panel alerts-panel">
    <div class="alerts-title-wrap">
      <h3>{{ title }}</h3>
    </div>

    <div class="alerts-list">
      <AlertCard
        v-for="alert in alerts"
        :key="alert.id"
        :title="alert.title"
        :message="alert.message"
      />
    </div>
  </aside>
</template>

<script setup>
import AlertCard from './AlertCard.vue'

defineProps({
  title: { type: String, default: 'Alerts' },
  alerts: { type: Array, required: true }
})
</script>

<style scoped>
.panel {
  background: #073d45;
  border: 1px solid #0f5660;
  border-radius: 8px;
  overflow: hidden;
}

.alerts-panel {
  display: flex;
  flex-direction: column;
}

.alerts-title-wrap {
  display: flex;
  justify-content: center;
  padding: 0.75rem 0.75rem 0.2rem;
}

.alerts-title-wrap h3 {
  margin: 0;
  background: #ff4b4b;
  color: #fff;
  border-radius: 8px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 0.35rem 1rem;
}

.alerts-list {
  padding: 0.7rem;
  overflow: auto;
}

@media (max-width: 1100px) {
  .alerts-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(180px, 1fr));
    gap: 0.5rem;
  }
}

@media (max-width: 760px) {
  .alerts-list {
    grid-template-columns: 1fr;
  }
}
</style>