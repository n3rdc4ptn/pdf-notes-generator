import fs from 'fs/promises'
import { PDFDocument } from 'pdf-lib'
import { COLORS } from './utils/colors.js'
import { createBoxesPage, createLinePage } from './utils/notes.js'

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
 * @param {"lines" | "dots" | "boxes"} type
 * @param {number} size
 * @param {require("pdf-lib").Color} color
 * @param {number} boxSize
 * @returns {Promise<Buffer>}
 */
export async function modifyPDF(file, type, size, color, boxSize) {
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
      case 'boxes':
        const boxesPage = await createBoxesPage({
          top: 60,
          bottom: 20,
          left: 20,
          right: 20
        }, rightWidth, height, boxSize || 20, color || COLORS.lightGray)
    
        const embedBoxPage = await pdfDoc.embedPage(boxesPage)
    
        page.drawPage(embedBoxPage, {
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