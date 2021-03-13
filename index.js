#!/usr/bin/env node

import fs from 'fs'
import zlib from 'zlib'
import { exec } from 'child_process'
import checkEnvLib from '@47ng/check-env'
import { Storage } from '@google-cloud/storage'

checkEnvLib.default({
  required: ['DB_HOST', 'DB_NAME', 'DUMP_PATH', 'BUCKET']
})

const {
  DB_HOST: dbHost,
  DB_NAME: dbName,
  DB_USER: dbUser,
  DB_PASS: dbPass,
  DUMP_PATH: dumpPath,
  BUCKET: bucket
} = process.env

// Imports the Google Cloud client library
const storage = new Storage()

;(async () => {
  try {
    const file = `${dumpPath}${dbName}-${new Date()
      .toISOString()
      .replace(/\D/g, '-')
      .slice(0, -5)}.bak`
    console.log('file: ', file)

    const result = await execPromise(
      `sqlcmd -S ${dbHost} ${dbUser ? '-U ' + dbUser : ''} ${
        dbPass ? '-P ' + dbPass : ''
      }  -Q "BACKUP DATABASE ${dbName} TO DISK='${file}'"`
    )
    console.log('stdout: ', result)

    await gzip(file)
    console.log('gziped')

    await storage.bucket(bucket).upload(`${file}.gz`, {})
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
        console.error(stderr)
        return reject(error)
      }

      resolve(stdout.trim())
    })
  })
}
