require('dotenv').config();
const AWS = require('aws-sdk');

exports.uploadToS3 = async (data, filename) => {
  try {
    const s3bucket = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY,
      secretAccessKey: process.env.IAM_USER_SECRET,
    });

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log('failed to sed file to aws', err.code);
          reject(err.code);
        } else {
          console.log('data sent to aws successfully');
          resolve(s3response.Location);
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: 'fail', err: err });
  }
};
