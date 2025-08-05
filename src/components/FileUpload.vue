<template>
  <Card class="mb-6">
    <template #content>
      <div v-if="error" class="mb-4">
        <Message severity="error" :closable="false">{{ error }}</Message>
      </div>
      
      <div v-if="processingProgress > 0 && processingProgress < 100" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">{{ loadingMessage }}</span>
          <span class="text-sm text-gray-600">{{ processingProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            :style="{ width: processingProgress + '%' }"
          ></div>
        </div>
      </div>

      <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          ref="fileInput"
          type="file"
          accept=".csv"
          @change="handleFileChange"
          style="display: none !important; position: absolute !important; left: -9999px !important;"
        />
        
        <div v-if="isLoading" class="text-blue-600">
          <ProgressSpinner class="mb-4" />
          <p>{{ loadingMessage }}</p>
        </div>
        
        <div v-else>
          <div v-if="experimentsCount > 0" class="text-green-600 mb-4">
            <p class="text-xl font-medium">File loaded successfully!</p>
            <p class="text-gray-500 mt-2">
              {{ totalRecords }} records processed, {{ experimentsCount }} experiments found.
            </p>
          </div>
          
          <div v-else>
            <p class="text-xl font-medium text-gray-900 mb-2">
              Upload CSV file with experiments
            </p>
            <p class="text-gray-500 mb-4">
              The file must contain the following columns: experiment_id, metric_name, step, value
            </p>
          </div>

          <Button
            @click="triggerFileInput"
            icon="pi pi-upload"
            label="Select file"
            class="p-button bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
          ></Button>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFileProcessor } from '../composables/useFileProcessor';
import type { FileProcessingResult } from '../types';

import Card from 'primevue/card';
import Message from 'primevue/message';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';

interface Props {
  experimentsCount: number;
  totalRecords: number;
}
defineProps<Props>();

interface Emits {
  (e: 'experiments-loaded', result: FileProcessingResult): void;
}
const emit = defineEmits<Emits>();

const { isLoading, error, processingProgress, loadingMessage, processFile } = useFileProcessor();
const fileInput = ref<HTMLInputElement>();

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const result = await processFile(file);
    emit('experiments-loaded', result);
  } catch (err) {
    console.error("File processing failed at component level:", err);
  } finally {
    if (target) target.value = '';
  }
};
</script>