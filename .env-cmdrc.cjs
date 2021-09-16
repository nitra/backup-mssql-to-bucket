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
      DB_PASS: 'cPassword1',
      DB_HOST_DEST: 'uat',
      DB_NAME_DEST: 'b2b',
      DB_USER_DEST: 'sa',
      DB_PASS_DEST: 'cPassword1',
      DUMP_PATH_DEST: '/var/opt/mssql/'



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
