import { ref, nextTick } from 'vue';
import type { ExperimentRecord, OptimizedExperiment, OptimizedMetricData, FileProcessingResult } from '../types';

const parseCSVChunked = async (
  csvContent: string, 
  progressCallback: (progress: number) => void,
  messageCallback: (message: string) => void
): Promise<ExperimentRecord[]> => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  if (!headers.includes('experiment_id') || 
      !headers.includes('metric_name') || 
      !headers.includes('step') || 
      !headers.includes('value')) {
    throw new Error('The CSV file must contain the following columns: experiment_id, metric_name, step, value');
  }

  const records: ExperimentRecord[] = [];
  const chunkSize = 1000;
  const totalLines = lines.length - 1;

  messageCallback('Parsing CSV file...');

  for (let i = 1; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, Math.min(i + chunkSize, lines.length));
    
    for (const line of chunk) {
      const values = line.split(',').map(v => v.trim());
      if (values.length !== headers.length) continue;

      const record: ExperimentRecord = {
        experiment_id: values[headers.indexOf('experiment_id')],
        metric_name: values[headers.indexOf('metric_name')],
        step: parseInt(values[headers.indexOf('step')]),
        value: parseFloat(values[headers.indexOf('value')])
      };

      if (!isNaN(record.step) && !isNaN(record.value)) {
        records.push(record);
      }
    }

    progressCallback(Math.round((i / totalLines) * 50));
    await nextTick();
  }
  return records;
};

const optimizeExperiments = async (
  records: ExperimentRecord[],
  progressCallback: (progress: number) => void,
  messageCallback: (message: string) => void
): Promise<OptimizedExperiment[]> => {
  const experimentMap = new Map<string, Map<string, Array<{ step: number; value: number }>>>();
  messageCallback('Grouping experiments...');

  const chunkSize = 5000;
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, Math.min(i + chunkSize, records.length));
    
    chunk.forEach(record => {
      if (!experimentMap.has(record.experiment_id)) {
        experimentMap.set(record.experiment_id, new Map());
      }
      const expMap = experimentMap.get(record.experiment_id)!;
      if (!expMap.has(record.metric_name)) {
        expMap.set(record.metric_name, []);
      }
      expMap.get(record.metric_name)!.push({ step: record.step, value: record.value });
    });

    progressCallback(50 + Math.round((i / records.length) * 30));
    await nextTick();
  }

  messageCallback('Data optimization...');
  const optimizedExperiments: OptimizedExperiment[] = [];
  let processedCount = 0;
  const totalExperiments = experimentMap.size;

  for (const [expId, metricsMap] of experimentMap) {
    const optimizedMetrics: Record<string, OptimizedMetricData> = {};
    for (const [metricName, dataPoints] of metricsMap) {
      dataPoints.sort((a, b) => a.step - b.step);
      const steps = dataPoints.map(p => p.step);
      const values = dataPoints.map(p => p.value);
      
      optimizedMetrics[metricName] = {
        steps,
        values,
        minValue: Math.min(...values),
        maxValue: Math.max(...values),
        avgValue: values.reduce((sum, val) => sum + val, 0) / values.length
      };
    }
    optimizedExperiments.push({ id: expId, metrics: optimizedMetrics });

    processedCount++;
    progressCallback(80 + Math.round((processedCount / totalExperiments) * 20));
    await nextTick();
  }

  return optimizedExperiments.sort((a, b) => a.id.localeCompare(b.id));
};

export function useFileProcessor() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const processingProgress = ref(0);
  const loadingMessage = ref('');

  const processFile = async (file: File): Promise<FileProcessingResult> => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      throw new Error('Only CSV files are supported');
    }
    if (file.size > 100 * 1024 * 1024) { 
      throw new Error('File too large (maximum 100MB)');
    }

    isLoading.value = true;
    error.value = null;
    processingProgress.value = 0;

    try {
      const content = await file.text();

      const progressCallback = (p: number) => { processingProgress.value = p; };
      const messageCallback = (m: string) => { loadingMessage.value = m; };

      const records = await parseCSVChunked(content, progressCallback, messageCallback);
      const experiments = await optimizeExperiments(records, progressCallback, messageCallback);
      const metrics = Array.from(new Set(experiments.flatMap(exp => Object.keys(exp.metrics)))).sort();
      
      processingProgress.value = 100;
      
      return {
        experiments,
        metrics,
        totalRecords: records.length,
      };
    } catch (err: any) {
      error.value = err.message || 'Unknown error';
      throw err; 
    } finally {
      isLoading.value = false;
      processingProgress.value = 0;
    }
  };

  return {
    isLoading,
    error,
    processingProgress,
    loadingMessage,
    processFile,
  };
}