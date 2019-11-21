'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
var s3 = new AWS.S3();

module.exports.get = async event => {
  let avatarKey = event.pathParameters.avatarName;
  const s3BucketName = process.env.AvatarS3Bucket;
  console.log(avatarKey, s3BucketName)
  let params = {
    Bucket: s3BucketName,
    Key: avatarKey,
  };
  console.log(params);
  s3.getObject(params, (err, data) => {
    if(err) {
      console.log(err);
    }
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: data
    };
  });  
};
