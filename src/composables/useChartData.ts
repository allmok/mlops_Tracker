import { ref, computed, type Ref } from 'vue'
import type { OptimizedExperiment } from '../types'

export function useChartData(experiments: Ref<OptimizedExperiment[]>, colors: string[]) {
  const chartDataCache = ref<Record<string, any>>({})

  const clearCache = () => {
    chartDataCache.value = {}
  }

  const getMetricInfo = (metricName: string, selectedExperimentIds: string[]): string => {
    const selectedExps = experiments.value.filter(exp =>
      selectedExperimentIds.includes(exp.id) && exp.metrics[metricName]
    )
    
    if (selectedExps.length === 0) return 'No data'

    const allValues = selectedExps.flatMap(exp => exp.metrics[metricName].values)
    const min = Math.min(...allValues)
    const max = Math.max(...allValues)

    return `${selectedExps.length} experiments, range: ${min.toFixed(4)} - ${max.toFixed(4)}`
  }

  const getChartData = (metricName: string, selectedExperimentIds: string[]) => {
    const cacheKey = `${metricName}_${selectedExperimentIds.join(',')}`
    
    if (chartDataCache.value[cacheKey]) {
      return chartDataCache.value[cacheKey]
    }

    const selectedExps = experiments.value.filter(exp =>
      selectedExperimentIds.includes(exp.id) && exp.metrics[metricName]
    )

    if (selectedExps.length === 0) {
      return { labels: [], datasets: [] }
    }

    const allSteps = new Set<number>()
    selectedExps.forEach(exp => {
      exp.metrics[metricName].steps.forEach(step => allSteps.add(step))
    })

    const sortedSteps = Array.from(allSteps).sort((a, b) => a - b)

    const maxPoints = 1000
    const sampleRate = Math.max(1, Math.ceil(sortedSteps.length / maxPoints))
    const sampledSteps = sortedSteps.filter((_, index) => index % sampleRate === 0)

    const datasets = selectedExps.map((exp, index) => {
      const expIndex = experiments.value.findIndex(e => e.id === exp.id)
      const metricData = exp.metrics[metricName]

      const stepValueMap = new Map<number, number>()
      metricData.steps.forEach((step, i) => {
        stepValueMap.set(step, metricData.values[i])
      })

      const data = sampledSteps.map(step => ({
        x: step,
        y: stepValueMap.get(step) ?? null
      }))

      return {
        label: exp.id,
        data,
        borderColor: colors[expIndex % colors.length],
        backgroundColor: colors[expIndex % colors.length] + '20',
        tension: 0.1,
        spanGaps: true,
        pointRadius: data.length > 100 ? 0 : 1,
        pointHoverRadius: 4
      }
    })

    const chartData = {
      datasets
    }

    chartDataCache.value[cacheKey] = chartData
    return chartData
  }

  return {
    getChartData,
    getMetricInfo,
    clearCache
  }
}
