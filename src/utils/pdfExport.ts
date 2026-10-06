import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export {
  generateVectorCandidatePdf,
  generateVectorSolutionsPdf,
  generateVectorAnswerSheetPdf,
} from './vectorPdfExport';

/**
 * Checks if the browser is currently offline.
 */
export function isAppOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

/**
 * Ensures fonts are ready without stalling offline users.
 */
async function waitForFontsSafe(): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 350)),
      ]);
    } catch {
      // Continue with local system fallback fonts
    }
  }
}

/**
 * Quick offline diagnostics test: verifies client-side PDF synthesis runs locally
 */
export async function testOfflinePdfEngine(): Promise<boolean> {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.text('Goethe B1 Offline Engine Check', 20, 20);
    const blob = doc.output('blob');
    return blob.size > 500;
  } catch {
    return false;
  }
}

/**
 * Generates an A4 PDF from a DOM element.
 * Supports multiple pages via `[data-exam-page]` containers, and automatically
 * slices tall elements across multiple A4 pages to prevent squashed or cut-off content.
 */
export async function generatePdfFromHtmlElement(
  element: HTMLElement,
  filename: string,
  onProgress?: (percent: number) => void
): Promise<Blob> {
  onProgress?.(5);

  // Guarantee font readiness even when offline
  await waitForFontsSafe();

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = 210;
  const pdfHeight = 297;
  const a4AspectRatio = pdfHeight / pdfWidth; // ~1.4142857

  // Search for discrete page containers
  const pageElements = Array.from(element.querySelectorAll<HTMLElement>('[data-exam-page]'));
  const targets = pageElements.length > 0 ? pageElements : [element];

  let isFirstPdfPage = true;

  for (let i = 0; i < targets.length; i++) {
    const targetEl = targets[i];
    const baseProgress = 10 + Math.round((i / targets.length) * 80);
    onProgress?.(baseProgress);

    const canvas = await html2canvas(targetEl, {
      scale: 2, // High resolution crisp rasterization
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // Standard 96 DPI A4 width to ensure fixed print layout
    });

    // Check if the rendered element is taller than a single A4 page
    const pageHeightInCanvasPx = Math.floor(canvas.width * a4AspectRatio);
    const canvasHeight = canvas.height;

    if (canvasHeight <= pageHeightInCanvasPx * 1.05) {
      // Single A4 page
      if (!isFirstPdfPage) {
        pdf.addPage('a4', 'portrait');
      } else {
        isFirstPdfPage = false;
      }
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    } else {
      // Multi-page slicing to prevent squashing tall sections (e.g. detailed answer keys)
      const totalSlices = Math.ceil(canvasHeight / pageHeightInCanvasPx);
      for (let s = 0; s < totalSlices; s++) {
        if (!isFirstPdfPage) {
          pdf.addPage('a4', 'portrait');
        } else {
          isFirstPdfPage = false;
        }

        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = pageHeightInCanvasPx;
        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          const remainingHeight = canvasHeight - s * pageHeightInCanvasPx;
          const sliceHeight = Math.min(pageHeightInCanvasPx, remainingHeight);
          ctx.drawImage(
            canvas,
            0,
            s * pageHeightInCanvasPx,
            canvas.width,
            sliceHeight,
            0,
            0,
            canvas.width,
            sliceHeight
          );
        }

        const sliceImg = sliceCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(sliceImg, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      }
    }
  }

  onProgress?.(100);
  const blob = pdf.output('blob');
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
