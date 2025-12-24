const { S3Client } = require('@aws-sdk/client-s3')

module.exports = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY,
    secretAccessKey: process.env.CF_SECRET_KEY,
  },
})
