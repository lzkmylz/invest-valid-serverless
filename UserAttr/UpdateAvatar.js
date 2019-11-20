'use strict';
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
var s3 = new AWS.S3();

module.exports.update = async event => {
  let encodedImage =JSON.parse(event.body);
  let decodedImage = Buffer.from(encodedImage.file, 'base64');
  let format = encodedImage.format;
  const s3BucketName = process.env.AvatarS3Bucket;

  let imgSaveName = uuidv4() + '.' + format;
  let params = {
    Bucket: s3BucketName,
    Key: imgSaveName,
    Body: decodedImage
  };
  try {
    let result = await s3.putObject(params).promise();
      // success
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        data: imgSaveName
      }),
    };
  } catch(err) {
    console.log(err);
    return {
      statusCode: err.statusCode, 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ 
        error: err.name ? err.name : "Exception", 
        message: err.message ? err.message : "Unknown error" 
      }) 
    };
  }
};
