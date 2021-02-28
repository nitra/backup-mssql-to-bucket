const fs = require("fs");

module.exports = new Promise((resolve) => {
  let secret = {};
  if (fs.existsSync("./.secret.json")) {
    secret = require("./.secret.json");
  }

  resolve({
    development: {
      NODE_ENV: "development",
      GOOGLE_APPLICATION_CREDENTIALS: "./service-account.json",
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
