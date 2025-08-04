<template>
  <div class="app-header">
    <div class="header-content">
      <div>
        <h1 class="header-title">
          <i class="pi pi-chart-line"></i>
          Experiment Tracker
        </h1>
        <p class="header-subtitle">
          Upload a CSV file with experiment logs for visualization and comparison of metrics.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

.app-header {
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  background-color: #3b82f6; 
  padding: 1.5rem;
  color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.header-title {
  font-size: 1.875rem; 
  line-height: 2.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-subtitle {
  margin-top: 0.5rem;
  color: #dbeafe; 
  max-width: 42rem; 
}
</style>