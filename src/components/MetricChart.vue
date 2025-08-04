<template>
  <Card class="shadow-sm">
    <template #title>
      <span>Metric: {{ metricName }}</span>
    </template>
    
    <template #subtitle>
      {{ metricInfo }}
    </template>

    <template #content>
      <div v-if="isLoading" class="flex justify-center items-center h-80">
        <ProgressSpinner />
      </div>

      <div v-else>
        <Chart 
          ref="chartRef"
          type="line"
          :data="chartData"
          :options="chartOptions"
          style="height: 400px;"
        ></Chart>
        
        <div 
          class="reset-button-container"
          :class="{ 'visible': isZoomed }"
        >
          <Button 
            @click="resetZoom" 
            label="Reset" 
            icon="pi pi-refresh" 
            class="p-button-outlined p-button-sm"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { OptimizedExperiment } from '../types'
import { useChartData } from '../composables/useChartData'
import Chart from 'primevue/chart';
import Button from 'primevue/button';

interface Props {
  metricName: string
  experiments: OptimizedExperiment[]
  selectedExperiments: string[]
  colors: string[]
}

const props = defineProps<Props>()
const isLoading = ref(false)
const isZoomed = ref(false)
const chartRef = ref<{ chart: any }>();

const { getChartData, getMetricInfo } = useChartData(
  computed(() => props.experiments),
  props.colors
)

const chartData = computed(() => 
  getChartData(props.metricName, props.selectedExperiments)
)

const metricInfo = computed(() => 
  getMetricInfo(props.metricName, props.selectedExperiments)
)

const resetZoom = () => {
  const chart = chartRef.value?.chart;
  if (!chart) return;

  chart.options.scales.x.min = undefined;
  chart.options.scales.x.max = undefined;
  chart.options.scales.y.min = undefined;
  chart.options.scales.y.max = undefined;

  chart.update('none');

  isZoomed.value = false;
}

const handleZoomOrPan = () => {
  if (chartRef.value?.chart) {
    isZoomed.value = chartRef.value.chart.isZoomedOrPanned();
  }
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top' as const,
      maxHeight: 100,
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x' as const,
        onPanComplete: handleZoomOrPan
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        drag: {
          enabled: true,
        },
        mode: 'x' as const,
        onZoomComplete: handleZoomOrPan
      }
    }
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: 'Step'
      },
      type: 'linear' as const
    },
    y: {
      display: true,
      title: {
        display: true,
        text: 'Value'
      }
    }
  },
  elements: {
    point: {
      radius: 1,
      hoverRadius: 4
    },
    line: {
      borderWidth: 2
    }
  },
  animation: {
    duration: 0
  }
}
</script>

<style scoped>
.reset-button-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.reset-button-container.visible {
  opacity: 1;
  pointer-events: auto;
}
</style>