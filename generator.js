import fs from 'fs/promises'
import { PDFDocument } from 'pdf-lib'
import { COLORS } from './utils/colors.js'

const pdfFilename = process.env.INPUT_FILE || './import.pdf'

const bytes = await fs.readFile(pdfFilename)

const pdfDoc = await PDFDocument.load(bytes)

const pages = pdfDoc.getPages()
pages.forEach((page) => {
  const height = page.getHeight()
  const width = page.getWidth()
  const rightWidth = width * 0.5
  const newWidth = width + rightWidth

  const xPadding = 40
  const top = 100
  const bottom = 20


  const lineHeight = 30
  const heightForLines = page.getHeight() - top - bottom
  const amountLines = Math.floor(heightForLines / lineHeight)
  const lineLength = Math.floor((rightWidth - (xPadding*2)))

  page.setWidth(newWidth)

  for(let i = 0; i < amountLines; i++) {
    const y = height - (top + (i * lineHeight))
    const x = xPadding + width

    page.drawLine({
      start: { x, y },
      end: { x: x + lineLength, y },
      color: COLORS.lightGray,
      thickness: 1
    })
  }

  page.drawLine({
    start: { x: width, y: 0 },
    end: { x: newWidth, y: 0 },
  })
})

const pdfBytes = await pdfDoc.save()

await fs.writeFile('./export.pdf', pdfBytes)