// PDF text extraction using pdf.js from CDN
// This module handles PDF parsing without requiring pdf.js to be bundled

/**
 * Extract text from a PDF file using Mozilla's PDF.js library
 * @param {ArrayBuffer} arrayBuffer - The PDF file as ArrayBuffer
 * @returns {Promise<string>} - Extracted text from all pages
 */
async function extractTextFromPDF(arrayBuffer) {
  try {
    // Load pdf.js from CDN (we'll use the build version)
    if (!window.pdfjsLib) {
      console.log('Loading PDF.js from CDN...');
      await loadPdfJs();
    }

    const pdfjsLib = window.pdfjsLib;

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    console.log(`PDF loaded: ${pdf.numPages} pages`);

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = textContent.items;

      // Better text concatenation - add newlines where Y position changes
      let pageText = '';
      let lastY = null;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const currentY = item.transform[5]; // Y position

        // Add newline if Y position changed significantly (new line)
        if (lastY !== null && Math.abs(currentY - lastY) > 2) {
          pageText += '\n';
        }

        // Add space if on same line but not at start
        if (lastY === currentY && pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }

        pageText += item.str;
        lastY = currentY;
      }

      fullText += pageText + '\n\n';
    }

    return fullText.trim();

  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract PDF text: ${error.message}`);
  }
}

/**
 * Load PDF.js library from CDN
 * @returns {Promise<void>}
 */
function loadPdfJs() {
  return new Promise((resolve, reject) => {
    // Use Mozilla's official CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;

    script.onload = () => {
      // Set worker source
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        console.log('PDF.js loaded successfully');
        resolve();
      } else {
        reject(new Error('PDF.js failed to load'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load PDF.js from CDN'));
    };

    document.head.appendChild(script);
  });
}

// Export for use in popup.js
window.extractTextFromPDF = extractTextFromPDF;
