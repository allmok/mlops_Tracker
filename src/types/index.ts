// data processing

export interface ExperimentRecord {
  experiment_id: string
  metric_name: string
  step: number
  value: number
}

export interface OptimizedMetricData {
  steps: number[]
  values: number[]
  minValue: number
  maxValue: number
  avgValue: number
}

export interface OptimizedExperiment {
  id: string
  metrics: Record<string, OptimizedMetricData>
}

export interface FileProcessingResult {
  experiments: OptimizedExperiment[]
  metrics: string[]
  totalRecords: number
}

// for graphs

export interface ChartDataset {
  label: string
  data: Array<{ x: number; y: number | null }>
  borderColor: string
  backgroundColor: string
  tension: number
  spanGaps: boolean
  pointRadius: number
  pointHoverRadius: number
}

export interface ChartData {
  datasets: ChartDataset[]
}

// global const

export const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#F87171', '#34D399', '#FBBF24', '#A78BFA', '#FB7185'
] as const

export const MAX_FILE_SIZE = 100 * 1024 * 1024 
export const CHUNK_SIZE = 1000
export const MAX_CHART_POINTS = 1000
export const MAX_EXPERIMENTS_FOR_DISPLAY = 20