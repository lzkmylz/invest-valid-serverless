'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
var s3 = new AWS.S3();

module.exports.get = async event => {
  let avatarKey = event.pathParameters.avatarName;
  const s3BucketName = process.env.AvatarS3Bucket;
  let params = {
    Bucket: s3BucketName,
    Key: avatarKey,
  };
  let result = await s3.getObject(params).promise();
  let data = result.Body.toString('base64');
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      data: data
    })
  };
};
