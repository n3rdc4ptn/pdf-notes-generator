import fs from 'fs/promises'
import { PDFDocument } from 'pdf-lib'

const pdfFilename = process.env.INPUT_FILE || './import.pdf'

const pdfDoc = await PDFDocument.load(pdfFilename)

const pages = pdfDoc.getPages()
pages[0].setWidth(pages[0].getWidth() * 2)

const pdfBytes = await pdfDoc.save()

await fs.writeFile('./export.pdf', pdfBytes)