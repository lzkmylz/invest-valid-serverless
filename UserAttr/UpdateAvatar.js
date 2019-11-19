'use strict';
const multipart = require('aws-lambda-multipart-parser');

module.exports.update = async event => {
  const parsedData = multipart.parse(event, true);
  let filename = parsedData.file.filename;
  let data = parsedData.file.content;
  let dataType = parsedData.file.contentType;
  const s3BucketName = process.env.AvatarS3Bucket;
  
  console.log(filename, dataType, data, s3BucketName);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(
      {
        message: 'Go Serverless v2.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
