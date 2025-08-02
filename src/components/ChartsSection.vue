<template>
  <div class="space-y-6">
    <MetricChart
      v-for="metric in availableMetrics"
      :key="metric"
      :metric-name="metric"
      :experiments="experiments"
      :selected-experiments="selectedExperiments"
      :colors="colors"
    />
  </div>
</template>

<script setup lang="ts">
import type { OptimizedExperiment } from '../types'
import MetricChart from './MetricChart.vue'

interface Props {
  experiments: OptimizedExperiment[]
  selectedExperiments: string[]
  availableMetrics: string[]
  colors: string[]
}

defineProps<Props>()
</script>