// Imports the Google Cloud client library
const { Storage } = require("@google-cloud/storage");

// Creates a client
const storage = new Storage();

storage
  .bucket(process.env.BUCKET)
  .upload(process.env.TEMPOFILE, {})
  .then(() => {
    console.log(`copied to bucket`);
  })
  .catch((err) => {
    console.error(err);
  });
