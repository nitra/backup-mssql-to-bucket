import fs from 'fs'
import zlib from 'zlib'
import { exec } from 'child_process'
import checkEnvLib from '@47ng/check-env'
import { Storage } from '@google-cloud/storage'

checkEnvLib.default({ required: ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'] })

// Imports the Google Cloud client library
const storage = new Storage()

;(async () => {
  try {
    const file = `${process.env.DB_NAME}-${new Date()
      .toISOString()
      .replace(/\D/g, '-')
      .slice(0, -5)}.bak`
    console.log('file: ', file)

    const result = await execPromise(
      `sqlcmd -S ${process.env.DB_HOST} -U ${process.env.DB_USER} -P ${process.env.DB_PASS} -Q "BACKUP DATABASE ${process.env.DB_NAME} TO DISK='./${file}'"`
    )
    console.log('stdout: ', result)

    await gzip(file)
    console.log('gziped')

    await storage.bucket(process.env.BUCKET).upload(`${file}.gz`, {})

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
        if (err) {
          return reject(err)
        }
        resolve()
      })
  })
}

async function execPromise(command) {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }

      resolve(stdout.trim())
    })
  })
}
