require('dotenv').config()
const fs = require('fs')
var cors = require('cors')
const express = require('express')
const path = require('path')
const upload = require('express-fileupload')
const bodyParser = require('body-parser')
const { createIpfsHash } = require('./PinataService.js')

const port = 4000
const app = express()

const jsonPath = path.resolve(`./uploads/nft-data.json`)
const filePath = path.resolve(`./uploads/image.png`)

const uploadToIPFS = async (req, res) => {
  try {
    if (req.files) {
      const files = req.files

      for (let file in files) {
        files[file].mv(`${filePath}`, err => {
          if (err) {
            return res.status(500).json({
              ok: false,
              err
            })
          }
        })
      }
      const imageHash = await createIpfsHash('image')

      res.json({ data: imageHash.IpfsHash })
      fs.rmdir(filePath)
      fs.rmdir(jsonPath)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    return error
  }
}

const uploadJson = async (req, res) => {
  try {
    const data = req.body
    fs.writeFileSync(
      jsonPath,
      `{
            "name": "${data.nftName}",
            "description": "${data.descript}", 
            "url": "${data.imgHash}"
        }`
    )

    const hash = await createIpfsHash(data.nftName)
    return res.json({ data: hash.IpfsHash })
  } catch (error) {
    return error
  }
}

app.use(upload())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('Welcome to NFT Collection')
})

app.post('/api/uploadImage', uploadToIPFS)
app.post('/api/createJson', uploadJson)

app.listen(process.env.PORT || port, () => {
  console.log(`Server started on port : ${process.env.PORT || port}`)
})
