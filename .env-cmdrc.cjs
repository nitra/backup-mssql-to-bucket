const fs = require('fs')

module.exports = new Promise(resolve => {
  let secret = {}
  if (fs.existsSync('./.secret.json')) {
    secret = require('./.secret.json')
  }

  resolve({
    development: {
      NODE_ENV: 'development',
      BUCKET: 'tmp-30',
      DB_HOST: 'mssql',
      DB_NAME: 'b2b',
      DB_USER: 'sa',
      DB_PASS: 'cPassword1'
    },
    test: { NODE_ENV: 'test' },
    production: {
      ...secret,
      ...{
        NODE_ENV: 'production'
      }
    }
  })
})
