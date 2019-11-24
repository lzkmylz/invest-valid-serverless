'use strict';
const AWS = require('aws-sdk');
const moment = require('moment');
AWS.config.update({ region: 'ap-southeast-1' });

var lagmat = function(
  x,
  maxlag,
  trim = "forward",
  original = "ex",
) {
  /*
  x: Array, data series
  maxlag: int
    * all lags from zero to maxlag are included
  trim: string, 'forward'/'backward'/'both'/undefined
    * 'forward' : trim invalid observations in front
    * 'backward' : trim invalid initial observations
    * 'both' : trim invalid observations on both sides
    * undefined : no trimming of observations
  original : string, 'ex'/'sep'/'in'
    * 'ex' : drops the original array returning only the lagged values.
    * 'in' : returns the original array and the lagged values as a single
      array.
    * 'sep' : returns a tuple (original array, lagged values). The original
              array is truncated to have the same number of rows as
              the returned lagmat.
  */
}

var adfuller = function(
  x,
  maxlag = null,
  regression = "c",
  autolag = "AIC",
  store = false,
  regresults = false
) {
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

  if(regresults) store = true;

  trendDict = {
    undefined: 'nc',
    0: 'c',
    1: 'ct',
    2: 'ctt'
  };
  if(regression == undefined || Number.isInteger(regression)) {
    regression = trendDict[regression]
  }
  regression = regression.toLowerCase();
  if(!(regression in ["c", "nc", "ct", "ctt"])) {
    throw `regression option ${regression} not understood`;
  }
  if(!(arr instanceof Array)) {
    throw "input variable x must be Array";
  }
  let nobs = x.length;
  let ntrend = regression != 'nc' ? length(regression) : 0;
  if(!maxlag) {
    maxlag = Math.ceil(12 * Math.pow(nobs / 100, 1 / 4));
    maxlag = Math.min(Math.ceil(nobs / 2) - ntrend - 1, maxlag);
    if(maxlag < 0) {
      throw "sample size is too short to use selected regression component";
    }
  } else if (maxlag > Math.ceil(nobs / 2) - ntrend - 1) {
    throw "maxlag must be less than (nobs/2 - 1 - ntrend) where n trend is the number of included deterministic regressors";
  }

  let xdiff = [];
  for(let i = 1; i < x.length; i++) {
    xdiff.push(x[i] - x[i - 1]);
  }

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
