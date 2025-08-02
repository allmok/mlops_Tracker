<template>
  <Card class="mb-6 shadow-sm">
    <template #title>
      <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <i class="pi pi-list text-blue-600"></i>
        Experiments ({{ experiments.length }})
        <span class="text-sm text-gray-500 ml-2">
          (Selected: {{ selectedExperiments.length }})
        </span>
      </h2>
    </template>

<template #header>
  <div class="flex justify-end p-5">
    <div class="flex items-center">
      <Button 
        @click="selectAll"
        label="Select All"
        icon="pi pi-check-square"
        class="p-button-outlined"
        style="margin-right: 1rem"
      />
      <Button 
        @click="clearAll"
        label="Clear All"
        icon="pi pi-times-circle"
        class="p-button-outlined p-button-danger"
      />
    </div>
  </div>
</template>

    <template #content>
      <div v-if="selectedExperiments.length > 10" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div class="flex items-center">
          <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
          <p class="text-yellow-800">
            Selected {{ selectedExperiments.length }} experiments. 
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ExperimentCard
          v-for="(experiment, index) in experiments"
          :key="experiment.id"
          :experiment="experiment"
          :color="colors[index % colors.length]"
          :is-selected="selectedExperiments.includes(experiment.id)"
          @toggle="toggleExperiment"
        ></ExperimentCard>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { OptimizedExperiment } from '../types';

import ExperimentCard from './ExperimentCard.vue';

import Card from 'primevue/card';
import Button from 'primevue/button';

interface Props {
  experiments: OptimizedExperiment[];
  colors: readonly string[]; 
  selectedExperiments: string[];
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:selectedExperiments', value: string[]): void;
}>();

const toggleExperiment = (experimentId: string) => {
  const newSelection = [...props.selectedExperiments]; 
  const index = newSelection.indexOf(experimentId);
  if (index > -1) {
    newSelection.splice(index, 1);
  } else {
    newSelection.push(experimentId);
  }
  emit('update:selectedExperiments', newSelection);
};

const selectAll = () => {
  const allIds = props.experiments.map(exp => exp.id);
  emit('update:selectedExperiments', allIds);
};

const clearAll = () => {
  emit('update:selectedExperiments', []);
};
</script>

<style scoped>
.grid {
  display: grid;
}
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }

@media (min-width: 768px) { .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1280px) { .xl\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
</style>