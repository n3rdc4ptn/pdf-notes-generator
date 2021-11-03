import express from 'express'
import fileUpload from 'express-fileupload'
import cors from 'cors'
import { modifyPDF } from './src/generator.js'
import { COLORS } from './src/utils/colors.js'

const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
  uriDecodeFileNames: true,
  safeFileNames: true,
  preserveExtension: true,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1
  }
}))

app.post('/generate', (req, res) => {

  if (!req.files || !req.files.file) {
    return res.status(400).send('No files were uploaded.')
  }

  const { file } = req.files

  const type = req.body.type || 'lines'
  const width = parseFloat(req.body.width)|| 0.5
  const boxSize = parseInt(req.body.boxSize) || 20
  const thickness = parseFloat(req.body.thickness) || 0.5
  const color = COLORS.lightGray

  modifyPDF(file.data, type, width, color, boxSize, thickness)
    .then(data => {
      res.contentType('application/pdf')
      res.send(Buffer.from(data))
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`)
})