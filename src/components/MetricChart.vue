<template>
  <Card class="shadow-sm">
    <template #title>
      Metric: {{ metricName }}
    </template>
    
    <template #subtitle>
      {{ metricInfo }}
    </template>

    <template #content>
      <div v-if="isLoading" class="flex justify-center items-center h-80">
        <ProgressSpinner />
      </div>
      <Chart 
        v-else
        type="line"
        :data="chartData"
        :options="chartOptions"
        style="height: 400px;"
      ></Chart>
    </template>
    
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { OptimizedExperiment } from '../types'
import { useChartData } from '../composables/useChartData'

interface Props {
  metricName: string
  experiments: OptimizedExperiment[]
  selectedExperiments: string[]
  colors: string[]
}

const props = defineProps<Props>()
const isLoading = ref(false)

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