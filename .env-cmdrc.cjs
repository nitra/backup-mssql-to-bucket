const fs = require("fs");

module.exports = new Promise((resolve) => {
  let secret = {};
  if (fs.existsSync("./.secret.json")) {
    secret = require("./.secret.json");
  }

  resolve({
    development: {
      NODE_ENV: "development",
      BUCKET: "tmp-30",
      TEMPOFILE: 'index.js'
    },
    test: { NODE_ENV: "test" },
    production: {
      ...secret,
      ...{
        NODE_ENV: "production",
      },
    },
  });
});
