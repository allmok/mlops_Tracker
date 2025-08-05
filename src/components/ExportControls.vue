<template>
  <Card class="mb-6 shadow-sm">
    <template #title>
      <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
        Export Results
      </h2>
    </template>
    <template #content>
      <div class="flex items-center gap-4">
        <Button
          @click="handleExportToJson"
          label="Export to JSON"
          icon="pi pi-file"
          class="p-button-secondary"
          :loading="isExporting"
          style="margin-right: 1rem"
        />
        <Button
          @click="handleExportToPdf"
          label="Export to PDF"
          icon="pi pi-file-pdf"
          class="p-button-secondary"
          :loading="isExporting"
        />
        <div v-if="isExporting" class="flex items-center gap-2 text-gray-600">
          <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="8" />
          <span>Generating file...</span>
        </div>
      </div>
       <p class="text-sm text-gray-500 mt-2">
        Export data for the {{ props.selectedExperiments.length }} selected experiment(s).
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import type { OptimizedExperiment } from '../types';
import { useExporter } from '../composables/useExporter';

import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

interface Props {
  experiments: OptimizedExperiment[];
  selectedExperiments: string[];
}
const props = defineProps<Props>();

const { isExporting, exportToJson, exportToPdf } = useExporter();

const handleExportToJson = () => {
  if (props.selectedExperiments.length > 0) {
    exportToJson(props.experiments, props.selectedExperiments);
  }
};

const handleExportToPdf = () => {
  if (props.selectedExperiments.length > 0) {
    exportToPdf(props.selectedExperiments);
  }
};
</script>