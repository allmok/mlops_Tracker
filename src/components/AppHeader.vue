<template>
  <div class="mb-6 rounded-lg bg-blue-600 p-6 text-white shadow-md">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold flex items-center gap-3">
          Experiment Tracker
        </h1>
        <p class="mt-2 text-blue-100 max-w-2xl">
          Upload a CSV file with experiment logs for visualization and comparison of metrics.
        </p>
      </div>
            <a
        href="https://dfstudio-dev-bucket.fra1.digitaloceanspaces.com/logs_25k.csv"
        download="sample_experiments.csv"
        class="p-button p-component p-button-outlined p-button-secondary border-white text-white hover:bg-white hover:text-blue-600 transition-colors"
        style="--border-color: white; --hover-bg: white; --hover-text-color: #2563EB;"
      >
        <span class="pi pi-download p-button-icon p-button-icon-left"></span>
        <span class="p-button-label">Download example</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
          
