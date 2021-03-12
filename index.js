// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import zlib from 'zlib'

// Creates a client
const storage = new Storage()

;(async () => {
  try {
    // await gzip(process.env.TEMPOFILE)
    // await storage.bucket(process.env.BUCKET).upload(process.env.TEMPOFILE, {})

    console.log(`copied to bucket`)
  } catch (e) {
    console.error(e)
  }
})()

async function gzip(file) {
  return new Promise((resolve, reject) => {
    const fileContents = fs.createReadStream(file)
    const writeStream = fs.createWriteStream(`${file}.gz`)
    const zip = zlib.createGzip()
    fileContents
      .pipe(zip)
      .pipe(writeStream)
      .on('finish', err => {
        if (err) return reject(err)
        else resolve()
      })
  })
}
