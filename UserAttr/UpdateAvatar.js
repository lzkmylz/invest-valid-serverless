'use strict';
const multipart = require('aws-lambda-multipart-parser');
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
var s3 = new AWS.S3();

module.exports.update = async event => {
  const parsedData = multipart.parse(event, true);
  let data = parsedData.file.content;
  let dataType = parsedData.file.contentType.split('/');
  let imgFormat = dataType[1];
  const s3BucketName = process.env.AvatarS3Bucket;

  if(dataType[0] != 'image') {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
          message: 'Upload file is not image file!',
      }),
    }
  }

  let imgSaveName = uuidv4() + '.' + imgFormat;
  let params = {
    Bucket: s3BucketName,
    Key: imgSaveName,
    Body: data
  };
  s3.putObject(params, (err, data) => {
    if(err) {
      return {
        statusCode: err.statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ 
          error: err.name ? err.name : "Exception", 
          message: err.message ? err.message : "Unknown error" 
        }),
      }
    }
    // success
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
          fileKey: imgSaveName,
      }),
    };
  });
};
