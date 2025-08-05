import { ref } from 'vue';
import type { OptimizedExperiment } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function useExporter() {
  const isExporting = ref(false);

  /**
   * @param experiments
   * @param selectedIds
   */
  const exportToJson = (experiments: OptimizedExperiment[], selectedIds: string[]) => {
    isExporting.value = true;
    try {
      const dataToExport = experiments.filter(exp => selectedIds.includes(exp.id));
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `experiments_data_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export to JSON:", error);
    } finally {
      isExporting.value = false;
    }
  };

  /**
   * @param selectedIds 
   */
  const exportToPdf = async (selectedIds: string[]) => {
    isExporting.value = true;
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });

      doc.setFontSize(20);
      doc.text('Experiment Report', 105, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 26, { align: 'center' });

      doc.setFontSize(12);
      doc.text('Selected Experiments:', 15, 40);
      doc.setFontSize(10);
      doc.text(selectedIds.join(', '), 15, 46, { maxWidth: 180 });

      const chartElements = document.querySelectorAll<HTMLElement>('.metric-chart-card');
      let yPosition = 60;

      for (const chartEl of chartElements) {
        const canvas = await html2canvas(chartEl, { scale: 2 }); 
        const imageData = canvas.toDataURL('image/png');
        
        const imgProps = doc.getImageProperties(imageData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 30;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (yPosition + pdfHeight > doc.internal.pageSize.getHeight() - 15) {
          doc.addPage();
          yPosition = 15;
        }

        doc.addImage(imageData, 'PNG', 15, yPosition, pdfWidth, pdfHeight);
        yPosition += pdfHeight + 10;
      }
      
      doc.save(`experiment_report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Failed to export to PDF:", error);
    } finally {
      isExporting.value = false;
    }
  };

  return {
    isExporting,
    exportToJson,
    exportToPdf,
  };
}