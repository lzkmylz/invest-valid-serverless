const axios = require('axios');

module.exports.get = async event => {
  let url = "http://api.waditu.com";
  let token = process.env.TUSHARE_TOKEN
  let data =JSON.parse(event.body);
  let reqBody = {
    api_name: "daily",
    token: token,
    params: data,
    fields: ""
  }
  let resdata = await axios.post(url, reqBody);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(resdata.data)
  };
}