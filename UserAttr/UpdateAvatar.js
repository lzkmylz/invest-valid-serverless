'use strict';
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
var s3 = new AWS.S3();

module.exports.update = async event => {
  try {
    let data =JSON.parse(event.body);
    let encodedImage = data.file.split(';base64,')[1];
    let filetype = data.filetype;
    let decodedImage = Buffer.from(encodedImage, 'base64');
    let format = filetype.split('/')[1];
    const s3BucketName = process.env.AvatarS3Bucket;

    let imgSaveName = `${uuidv4()}.${format}`;
    let params = {
      Bucket: s3BucketName,
      Key: imgSaveName,
      Body: decodedImage,
      ContentEncoding: filetype
    };
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
