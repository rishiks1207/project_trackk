import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function inspectPDF() {
  const pdfBytes = fs.readFileSync('public/assets/aistudio/repo_ffc1a9db.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  console.log('Page count:', pdfDoc.getPageCount());
  
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const { width, height } = page.getSize();
    console.log(`Page ${i + 1}: ${width} x ${height}`);
  }
}

inspectPDF().catch(console.error);
