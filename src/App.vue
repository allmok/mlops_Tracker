<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">

      <AppHeader></AppHeader>

      <FileUpload 
        :experiments-count="experiments.length"
        :total-records="totalRecords"
        @experiments-loaded="handleExperimentsLoaded"
      ></FileUpload>

      <template v-if="experiments.length > 0">
        <ExperimentSelector
          :experiments="experiments"
          :colors="colors"
          v-model:selected-experiments="selectedExperiments"
        ></ExperimentSelector>

        <ExportControls
          v-if="selectedExperiments.length > 0"
          :experiments="experiments"
          :selected-experiments="selectedExperiments"
        ></ExportControls>

        <ChartsSection
          v-if="selectedExperiments.length > 0 && selectedExperiments.length <= 20"
          :experiments="experiments"
          :selected-experiments="selectedExperiments"
          :available-metrics="availableMetrics"
          :colors="colors"
        ></ChartsSection>

        <TooManyExperimentsWarning
          v-else-if="selectedExperiments.length > 20"
          :selected-count="selectedExperiments.length"
          @select-first-ten="selectFirstTen"
        ></TooManyExperimentsWarning>
        
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { OptimizedExperiment, FileProcessingResult } from './types';
import { COLORS } from './types';

import AppHeader from './components/AppHeader.vue';
import FileUpload from './components/FileUpload.vue';
import ExperimentSelector from './components/ExperimentSelector.vue';
import ChartsSection from './components/ChartsSection.vue';
import TooManyExperimentsWarning from './components/TooManyExperimentsWarning.vue';
import ExportControls from './components/ExportControls.vue'; 

const experiments = ref<OptimizedExperiment[]>([]);
const selectedExperiments = ref<string[]>([]);
const availableMetrics = ref<string[]>([]);
const totalRecords = ref(0);
const colors = ref([...COLORS]);

const handleExperimentsLoaded = (result: FileProcessingResult) => {
  if (!result || !result.experiments) return;
  
  experiments.value = result.experiments;
  availableMetrics.value = result.metrics;
  totalRecords.value = result.totalRecords;
  selectedExperiments.value = result.experiments
    .slice(0, Math.min(5, result.experiments.length))
    .map(exp => exp.id);
};

const selectFirstTen = () => {
  selectedExperiments.value = experiments.value.slice(0, 10).map(exp => exp.id);
};
</script>