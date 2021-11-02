import { PDFDocument, } from 'pdf-lib'

/**
 * 
 * @param {{top: number, right: number, bottom: number, left: number}} padding
 * @param {number} width
 * @param {number} height
 * @param {number} lineHeight
 * @param {import('pdf-lib').Color} color
 * @return {import('pdf-lib').PDFPage}
 */
export async function createLinePage(padding, width, height, lineHeight, color) {
  const doc = await PDFDocument.create()
  const page = doc.addPage()
  page.setSize(width, height)

  const effectiveHeight = height - padding.top - padding.bottom
  const effectiveWidth = width - padding.left - padding.right

  const lineLength = effectiveWidth

  const lineCount = Math.floor(effectiveHeight / lineHeight)

  for(let i = 0; i < lineCount; i++) {
    const y = height - (padding.top + (i * lineHeight))
    const x = padding.left

    page.drawLine({
      start: { x, y },
      end: { x: x + lineLength, y },
      color,
      thickness: 1
    })
  }

  return page
}


/**
 * 
 * @param {{top: number, right: number, bottom: number, left: number}} padding
 * @param {number} width
 * @param {number} height
 * @param {number} boxSize
 * @param {import('pdf-lib').Color} color
 * @return {import('pdf-lib').PDFPage}
 */
 export async function createBoxesPage(padding, width, height, boxSize, color) {
  const doc = await PDFDocument.create()
  const page = doc.addPage()
  page.setSize(width, height)

  const effectiveHeight = height - padding.top - padding.bottom - 32
  const effectiveWidth = width - padding.left - padding.right

  const lineWidth = effectiveWidth

  const lineHCount = Math.floor(effectiveHeight / boxSize)

  for(let i = 0; i < lineHCount; i++) {
    const y = height - (padding.top + (i * boxSize))
    const x = padding.left

    page.drawLine({
      start: { x, y },
      end: { x: x + lineWidth, y },
      color,
      thickness: 1
    })
  }

  const lineHeight = effectiveHeight
  const lineVCount = Math.floor(effectiveWidth / boxSize)


  for(let i = 0; i < lineVCount; i++) {
    const y = height - (padding.top)
    const x = padding.left + (i * boxSize)

    page.drawLine({
      start: { x, y },
      end: { x, y: y - lineHeight },
      color,
      thickness: 1
    })
  }

  return page
}