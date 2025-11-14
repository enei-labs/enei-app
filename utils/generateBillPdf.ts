import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface GeneratePdfResult {
  base64: string;
  fileName: string;
}

/**
 * Generate PDF from React component ref
 * @param componentRef - React ref pointing to the component to convert to PDF
 * @param fileName - Custom file name for the PDF (without extension)
 * @returns Promise that resolves to base64 string and file name
 */
export const generateBillPdf = async (
  componentRef: React.RefObject<HTMLElement>,
  fileName?: string
): Promise<GeneratePdfResult> => {
  if (!componentRef.current) {
    throw new Error("Component ref is not available");
  }

  // Convert HTML element to canvas
  const canvas = await html2canvas(componentRef.current, {
    scale: 1.5, // Reduced from 2 to balance quality and file size
    useCORS: true, // Enable CORS for external images
    logging: false, // Disable console logs
    backgroundColor: "#ffffff", // Set white background
  });

  // Calculate PDF dimensions based on canvas
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Create PDF with compression enabled
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true, // Enable PDF-level compression
  });

  // Convert canvas to WebP with quality compression
  // WebP provides 25-35% better compression than JPEG while maintaining quality
  // Supported by all modern browsers (Chrome, Firefox, Safari 14+, Edge)
  const imgData = canvas.toDataURL("image/webp", 0.80); // 80% quality

  // Add image to PDF with MEDIUM compression
  // Compression modes: "NONE" | "FAST" | "MEDIUM" | "SLOW"
  // MEDIUM provides better compression than FAST while maintaining reasonable speed
  pdf.addImage(imgData, "WEBP", 0, 0, imgWidth, imgHeight, undefined, "MEDIUM");

  // Get PDF as base64
  const pdfBase64 = pdf.output("datauristring");
  // Remove the data:application/pdf;filename=generated.pdf;base64, prefix
  const base64 = pdfBase64.split(",")[1];

  // Generate file name with timestamp if not provided
  const generatedFileName =
    fileName || `bill_${new Date().getTime()}.pdf`;

  return {
    base64,
    fileName: generatedFileName,
  };
};
