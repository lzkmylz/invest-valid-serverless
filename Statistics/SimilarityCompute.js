'use strict';
const AWS = require('aws-sdk');
const moment = require('moment');
AWS.config.update({ region: 'ap-southeast-1' });

var adfuller = function(x, maxlag, regression, autolag, store, regresults) {
  /*
  x: Array, data series
  maxlag: int, Maximum lag which is included in test, default 12*(nobs/100)^{1/4}
  regression: can be "c"/"ct"/"ctt"/"nc" Constant and trend order to include in regression
    * 'c' : constant only (default)
    * 'ct' : constant and trend
    * 'ctt' : constant, and linear and quadratic trend
    * 'nc' : no constant, no trend
  autolag : 'AIC'/'BIC'/'t-stat'/null
    * if null, then maxlag lags are used
    * if 'AIC' (default) or 'BIC', then the number of lags is chosen
      to minimize the corresponding information criterion
    * 't-stat' based choice of maxlag.  Starts with maxlag and drops a
      lag until the t-statistic on the last lag length is significant
      using a 5%-sized test
  store: bool, If True, then a result instance is returned additionally to
    the adf statistic. Default is False
  regresults : bool, optional
    If True, the full regression results are returned. Default is False
  */
}

module.exports.post = async event => {
  let tushareToken = process.env.TUSHARE_TOKEN;
  let requestData = JSON.parse(event.body);
  let stock1 = requestData.stock1;
  let stock2 = requestData.stock2;
  let timeRange = requestData.timeRange;
  let timeRangeMapping = {
    10: 20,
    20: 40,
    60: 90
  };
  let url = 'http://api.tushare.pro';

  // ts_code 上证SH 深证SZ 创业板CYB 中小板ZXB
  let stock1Body = {
    api_name: 'daily',
    token: tushareToken,
    params: {
      start_date: moment().subtract(timeRangeMapping[timeRange], 'days').format("YYYYMMDD"),
      end_date: moment().format("YYYYMMDD"),
      ts_code: stock1,
    },
    fields: "ts_code,trade_date,open,close"
  };
  let stock2Body = {
    api_name: 'daily',
    token: tushareToken,
    params: {
      start_date: moment().subtract(timeRangeMapping[timeRange], 'days').format("YYYYMMDD"),
      end_date: moment().format("YYYYMMDD"),
      ts_code: stock2,
    },
    fields: "ts_code,trade_date,open,close"
  };

  let stock1Data = await fetch(url, {
    method: "POST",
    body: JSON.stringify(stock1Body)
  }).then(res => res.json());
  let stock2Data = await fetch(url, {
    method: "POST",
    body: JSON.stringify(stock2Body)
  }).then(res => res.json);
  console.log(stock1Data);
};
