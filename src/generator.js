import fs from 'fs/promises'
import { PDFDocument } from 'pdf-lib'
import { COLORS } from './utils/colors.js'
import { createLinePage } from './utils/notes.js'

// const pdfFilename = process.env.INPUT_FILE || './import.pdf'

// const bytes = await fs.readFile(pdfFilename)

// const pdfDoc = await PDFDocument.load(bytes)


// const pages = pdfDoc.getPages()
// await pages.forEach(async (page) => {
//   const height = page.getHeight()
//   const width = page.getWidth()
//   const rightWidth = width * 0.5
//   const newWidth = width + rightWidth

//   page.setWidth(newWidth)

//   const linePage = await createLinePage({
//     top: 100,
//     bottom: 20,
//     left: 40,
//     right: 40
//   }, rightWidth, height, 30, COLORS.lightGray)

//   const embedPage = await pdfDoc.embedPage(linePage)

//   page.drawPage(embedPage, {
//     x: width,
//     y: 0,
//     scale: 1
//   })
// })

// const pdfBytes = await pdfDoc.save()

// await fs.writeFile('./export.pdf', pdfBytes)


/**
 * 
 * @param {Buffer} file 
 * @param {"lines" | "dots" | "rect"} type
 * @param {number} size
 * @param {require("pdf-lib").Color} color
 * @returns {Promise<Buffer>}
 */
export async function modifyPDF(file, type, size, color) {
  const pdfDoc = await PDFDocument.load(file)

  const pages = pdfDoc.getPages()
  await pages.forEach(async (page) => {
    const height = page.getHeight()
    const width = page.getWidth()
    const rightWidth = width * size
    const newWidth = width + rightWidth

    page.setWidth(newWidth)

    switch(type) {
      case 'lines':
        const linePage = await createLinePage({
          top: 100,
          bottom: 20,
          left: 40,
          right: 40
        }, rightWidth, height, 30, color || COLORS.lightGray)
    
        const embedPage = await pdfDoc.embedPage(linePage)
    
        page.drawPage(embedPage, {
          x: width,
          y: 0,
          scale: 1
        })
        break
    }
  })

  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}