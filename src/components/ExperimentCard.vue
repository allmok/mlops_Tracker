<template>
  <div
    class="experiment-card"
    :class="{ selected: isSelected }"
    @click="$emit('toggle', experiment.id)"
  >
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-medium text-gray-900">{{ experiment.id }}</h3>
        <p class="text-sm text-gray-500">
          {{ Object.keys(experiment.metrics).length }} metrics, 
          {{ getExperimentStepsCount(experiment) }} steps
        </p>
      </div>
      <div class="flex items-center">
        <div 
          class="w-4 h-4 rounded-full mr-2"
          :style="{ backgroundColor: color }"
        ></div>
        <Checkbox
          :model-value="isSelected"
          :binary="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OptimizedExperiment } from '../types';
import Checkbox from 'primevue/checkbox';

interface Props {
  experiment: OptimizedExperiment;
  color: string;
  isSelected: boolean;
}
defineProps<Props>();

defineEmits<{
  (e: 'toggle', experimentId: string): void
}>();

const getExperimentStepsCount = (experiment: OptimizedExperiment): number => {
  let maxSteps = 0;
  Object.values(experiment.metrics).forEach(metric => {
    maxSteps = Math.max(maxSteps, metric.steps.length);
  });
  return maxSteps;
};
</script>

<style scoped>
.experiment-card {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.experiment-card:hover {
  border-color: #9ca3af;
}

.experiment-card.selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}
</style>