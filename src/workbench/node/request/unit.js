const { resolve } = require('path');

(function () {
  'use strict';
  var url = require('url'),
    querystring = require('querystring'),
    _LibsCommon = require('./libs/common'),
    _LibsApiUtil = require('./libs/apiUtil'),
    _Formdata = require('form-data'),
    parse = {},
    privateFun = {},
    _ContentDisposition = require('content-disposition'),
    _RedirectClass = require('./libs/redirect'),
    _HttpPackageClass = new (require('./libs/http.package').core)(),
    _GetFileClass = new (require('./libs/getFile.package').core)(),
    _LibsMineType = require('./libs/mineType.package');

  let CONFIG = require('./config.json');

  const _EO_LANG_OBJ = require('./lang.json');
  var iconv = require('iconv-lite');
  global.eoLang = _EO_LANG_OBJ['en'];
  global.eoTestGlobals = {};
  /**
   * 解析uri信息
   * @param  {number} protocol 请求协议
   * @param  {string} uri 原始数据
   * @return uri
   */
  parse.uri = function (protocol, uri) {
    if (!/((http:\/\/)|(https:\/\/))/.test(uri)) {
      uri = (protocol == '1' ? 'https://' : 'http://') + uri;
    }
    return uri;
  };

  /**
   * 渲染请求数据
   * @param  {object} inputTestData 请求数据信息
   * @param  {array} response 返回信息体列表
   * @return {object}      request信息
   */
  privateFun.parseTestData = function (inputTestData, env) {
    return new Promise(async (resolve) => {
      var template = {
          pathObject: null,
          uri: '',
          options: {
            uri: '',
            method: inputTestData.method,
            headers: {},
          },
          beforeObject: null,
          body: null,
          formToJsonBody: [],
          label: {
            muti: false,
          },
          jwt: '',
        },
        tmpHeaderObj = {},
        tmpBinaryFileName,
        tmpRequestType = inputTestData.requestType.toString();
      global.eoTestGlobals = inputTestData.globals;
      try {
        inputTestData.headers.map(function (val, key) {
          tmpHeaderObj[val.headerName] = val.headerValue;
        });
        switch (inputTestData.auth.status) {
          case '1': {
            if (inputTestData.auth.basicAuth) {
              tmpHeaderObj['Authorization'] =
                'Basic ' +
                Buffer.from(
                  (inputTestData.auth.basicAuth.username || '') + ':' + (inputTestData.auth.basicAuth.password || '')
                ).toString('base64');
            }
            break;
          }
          case '2': {
            template.jwt = _LibsCommon.jwt(
              {
                alg: inputTestData.auth.jwtAuth.alg,
                typ: 'JWT',
              },
              inputTestData.auth.jwtAuth.payload,
              inputTestData.auth.jwtAuth.secretSalt
            );
            switch (template.jwt) {
              case 'jwtError': {
                resolve({
                  status: 'preCode error',
                  content: global.eoLang['213d3b0f-b267-4d5c-9512-0a06e2a5a522'],
                });
                return;
              }
            }
            if (inputTestData.auth.jwtAuth.isBearer) {
              template.jwt = `Bearer ${template.jwt}`;
            }
            switch (inputTestData.auth.jwtAuth.position) {
              case 'header': {
                tmpHeaderObj[inputTestData.auth.jwtAuth.tokenName || 'tokenName'] = template.jwt;
                break;
              }
              case 'query': {
                if (inputTestData.URL.indexOf('?') > -1) {
                  inputTestData.URL +=
                    (inputTestData.URL.replace(/(((?!\?).)*)\?/, '') ? '&' : '') +
                    (inputTestData.auth.jwtAuth.tokenName || 'tokenName') +
                    '=' +
                    template.jwt;
                } else {
                  inputTestData.URL += '?' + (inputTestData.auth.jwtAuth.tokenName || 'tokenName') + '=' + template.jwt;
                }
                break;
              }
            }

            break;
          }
        }
        let tmpNewUri =
          inputTestData.URL.indexOf('?') === -1 ? '' : inputTestData.URL.replace(/(((?!\?).)*)\?/, '') || '';
        switch (tmpRequestType) {
          case '0': {
            let tmpParamObj = {};
            inputTestData.params.map(function (val, key) {
              if ((val.paramType || 0).toString() == '1') {
                switch (Object.prototype.toString.call(tmpParamObj[val.paramKey])) {
                  case '[object Array]': {
                    break;
                  }
                  default: {
                    tmpParamObj[val.paramKey] = [];
                    break;
                  }
                }
                let tmpFileNameArr = (val.paramInfo || '').split(','),
                  tmpFileArr = val.files || [];
                tmpFileArr.map((tmpFileVal, tmpFileKey) => {
                  if (typeof tmpFileVal === 'object') {
                    tmpParamObj[val.paramKey].push(tmpFileVal);
                  } else {
                    tmpParamObj[val.paramKey].push({
                      name: tmpFileNameArr[tmpFileKey] || '',
                      dataUrl: tmpFileVal,
                    });
                  }
                });
                template.label.muti = true;
              } else {
                switch (Object.prototype.toString.call(tmpParamObj[val.paramKey])) {
                  case '[object Array]': {
                    tmpParamObj[val.paramKey].push(val.paramInfo || '');
                    break;
                  }
                  default: {
                    if (tmpParamObj[val.paramKey]) {
                      tmpParamObj[val.paramKey] = [tmpParamObj[val.paramKey], val.paramInfo || ''];
                    } else {
                      tmpParamObj[val.paramKey] = val.paramInfo || '';
                    }
                    break;
                  }
                }
              }
            });
            await _LibsApiUtil
              .requestPreReduceByPromise(
                {
                  requestType: inputTestData.requestType,
                  url: inputTestData.URL,
                  headers: tmpHeaderObj,
                  params: tmpParamObj,
                  raw: '',
                  query: querystring.parse(tmpNewUri),
                  env: env,
                  apiRequestType: inputTestData.methodType,
                },
                inputTestData.beforeInject,
                {
                  functionCode: inputTestData.functionCode,
                  globalHeader: inputTestData.globalHeader,
                }
              )
              .then((tmpInputDataObj) => {
                template.beforeObject = tmpInputDataObj;
              });
            break;
          }
          case '2':
          case '3': {
            template.formToJsonBody = _LibsCommon.bodyQueryToJson(inputTestData.params, {
              apiRequestParamJsonType:
                inputTestData.requestType.toString() == '2' ? inputTestData.apiRequestParamJsonType || '0' : '0',
              isXml: tmpRequestType === '3',
            });
            let tmpWantToExecuteData = {
              requestType: inputTestData.requestType,
              url: inputTestData.URL,
              headers: tmpHeaderObj,
              params: {},
              raw: '',
              query: querystring.parse(tmpNewUri),
              env: env,
              apiRequestType: inputTestData.methodType,
            };
            if (tmpRequestType === '3') {
              tmpWantToExecuteData.raw = template.formToJsonBody.value;
              tmpWantToExecuteData.xmlAttrObj = template.formToJsonBody.attr;
            } else {
              tmpWantToExecuteData.raw = template.formToJsonBody;
            }
            await _LibsApiUtil
              .requestPreReduceByPromise(tmpWantToExecuteData, inputTestData.beforeInject, {
                functionCode: inputTestData.functionCode,
                globalHeader: inputTestData.globalHeader,
              })
              .then((tmpInputDataObj) => {
                template.beforeObject = tmpInputDataObj;
              });
            break;
          }
          case '4': {
            await _LibsApiUtil
              .requestPreReduceByPromise(
                {
                  requestType: '4',
                  url: inputTestData.URL,
                  headers: tmpHeaderObj,
                  query: querystring.parse(tmpNewUri),
                  env: env,
                  binary: inputTestData.params.dataUrl,
                  apiRequestType: inputTestData.methodType,
                },
                inputTestData.beforeInject,
                {
                  functionCode: inputTestData.functionCode,
                  globalHeader: inputTestData.globalHeader,
                }
              )
              .then((tmpInputDataObj) => {
                template.beforeObject = tmpInputDataObj;
              });
            template.body = Buffer.from(
              (inputTestData.params.dataUrl || '').replace(/^data:(.*);base64,/gi, ''),
              'base64'
            );
            tmpBinaryFileName = `[binary]${inputTestData.params.name}`;
            break;
          }
          case '1': {
            await _LibsApiUtil
              .requestPreReduceByPromise(
                {
                  requestType: '1',
                  url: inputTestData.URL,
                  headers: tmpHeaderObj,
                  raw: inputTestData.params,
                  query: querystring.parse(tmpNewUri),
                  env: env,
                  apiRequestType: inputTestData.methodType,
                },
                inputTestData.beforeInject,
                {
                  functionCode: inputTestData.functionCode,
                  globalHeader: inputTestData.globalHeader,
                }
              )
              .then((tmpInputDataObj) => {
                template.beforeObject = tmpInputDataObj;
              });
            break;
          }
        }

        switch (template.beforeObject.status) {
          case 'beforeCodeError':
          case 'info':
          case 'terminateRequest': {
            resolve({
              status: 'preCode error',
              content: template.beforeObject.content,
              reportList: template.beforeObject.reportList,
            });
            return;
          }
        }
        template.options.headers = template.beforeObject.headers;
        if (tmpRequestType !== '4') {
          if (
            !template.label.muti &&
            /"content-type":"multipart\/form-data/i.test(JSON.stringify(template.options.headers))
          ) {
            template.label.muti = true;
          }
          if (template.label.muti) {
            template.body = template.beforeObject.params;
          } else {
            template.body =
              typeof template.beforeObject.params == 'string'
                ? template.beforeObject.params
                : querystring.stringify(template.beforeObject.params || {});
          }
        }
        template.uri = parse.uri(inputTestData.httpHeader, template.beforeObject.url);
        template.pathObject = url.parse(template.uri);
        template.options.path = template.pathObject.path;
        template.options.hostname = template.pathObject.hostname;
        template.options.port = template.pathObject.port;
        template.options.protocol = template.pathObject.protocol;
        template.options.auth = template.pathObject.auth;
      } catch (e) {
        console.error(new Date() + '：unit/common.js 227', e);
      }
      resolve({
        options: template.options,
        body: template.body,
        afterInject: inputTestData.afterInject,
        isMuti: template.label.muti,
        functionCode: inputTestData.functionCode,
        env: template.beforeObject.env,
        advancedSetting: Object.assign(
          {},
          {
            requestRedirect: 1,
            sendNocacheToken: 0,
            checkSSL: 0,
            sendEoToken: 1,
          },
          inputTestData.advancedSetting || {}
        ),
        history: {
          body: template.beforeObject.params,
          headers: template.options.headers,
          uri: template.uri,
        },
        requestBody: {
          body: template.beforeObject.params,
        },
        requestType: tmpRequestType,
        queryParams: template.beforeObject.queryParams,
        reportList: template.beforeObject.reportList,
        binaryFileName: tmpBinaryFileName,
      });
    });
  };
  class unitCommon {
    constructor() {
      this.xhr = null;
      this.areadyAbortXhr = false;
    }
    ajax(inputTestData, inputOptions, callback) {
      this.areadyAbortXhr = false;
      return new Promise(function (resolve, reject) {
        let tmpReportData = {
            response: {
              headers: [],
              body: '',
              httpCode: 0,
              testDeny: '',
              responseLength: 0,
              responseType: 'text',
            },
            request: {
              headers: [],
            },
            reportList: inputTestData.reportList,
            general: {
              redirectTimes: 0,
              downloadSize: 0,
              downloadRate: 0,
            },
          },
          tmpMultiForm = {},
          tmpAjaxXhr;
        for (let key in inputTestData.options.headers) {
          tmpReportData.request.headers.push({
            key: key,
            value: inputTestData.options.headers[key],
          });
        }
        try {
          let tmpFunCheckIsIllegalUrl = (inputHostName, tmpInputTotalTime) => {
            if (!inputHostName || new RegExp(_LibsCommon.LOCAL_REGEXP_CONST).test(inputHostName)) {
              tmpReportData.response.body = inputHostName
                ? global.eoLang['63be68fa-31fc-498c-b49c-d3b6db10a95b']
                : global.eoLang['d6fa1d73-6a43-477f-a6df-6752661c9df3'];
              tmpReportData.response.testDeny = tmpInputTotalTime.toFixed(2);
              tmpReportData.general.time = tmpInputTotalTime.toFixed(2) + 'ms';
              if (callback) callback(tmpReportData);
              reject('illegal');
              return true;
            }
          };
          if (tmpFunCheckIsIllegalUrl(inputTestData.options.hostname, 0)) return;
          let tmpFunOprAjaxErr = (tmpInputErr, tmpInputTotalTime) => {
              tmpReportData.response.testDeny = tmpInputTotalTime;
              tmpReportData.response.body = tmpInputErr.name + '：' + tmpInputErr.message;
              tmpReportData.general.time = tmpInputTotalTime.toFixed(2) + 'ms';
              if (callback) callback(tmpReportData);
              reject('request error');
            },
            tmpFunReduceAjaxResEnd = (inputRes, tmpInputResponseObj) => {
              tmpReportData.general.time = tmpInputResponseObj.totalTime.toFixed(2) + 'ms';
              tmpReportData.general.downloadSize = tmpInputResponseObj.chunk.length;
              tmpReportData.general.downloadRate = (
                (tmpInputResponseObj.chunk.length / tmpInputResponseObj.contentDeliveryTiming / 1024) *
                1000
              ).toFixed(2);
              tmpReportData.response.body = tmpInputResponseObj.str;
              tmpReportData.response.httpCode = inputRes.statusCode;
              tmpReportData.response.responseLength = tmpInputResponseObj.chunk.length;
              let tmpDetected = {},
                tmpSuffix = _LibsMineType.getSuffix(inputRes.headers['content-type']),
                tmpFileBinary;
              if (!inputRes.headers['content-type']) {
                tmpDetected =
                  _GetFileClass.byContent(
                    Buffer.concat(tmpInputResponseObj.chunk.array, tmpInputResponseObj.chunk.length) ||
                      tmpReportData.response.body
                  ) || {};
              }
              if (
                /^(text\/(.*))|(application(.*)((\/)|(\+))json)|(application(.*)((\/)|(\+))xml)/gi.test(
                  inputRes.headers['content-type']
                ) ||
                (!(inputRes.headers['content-type'] && tmpSuffix) && !(tmpDetected && tmpDetected.mime))
              ) {
                tmpReportData.response.contentType = inputRes.headers['content-type'];
                if (tmpReportData.response.responseLength >= 300 * 1024) {
                  tmpFileBinary = Buffer.concat(
                    tmpInputResponseObj.chunk.array,
                    tmpInputResponseObj.chunk.length
                  ).toString('base64');
                  tmpReportData.response.responseType = 'longText';
                  let tmpPathUrl = inputTestData.options.path;
                  tmpReportData.blobFileName = tmpPathUrl.substring(
                    tmpPathUrl.lastIndexOf('/') + 1,
                    tmpPathUrl.lastIndexOf('?') === -1 ? tmpPathUrl.length : tmpPathUrl.lastIndexOf('?')
                  );
                }
              } else {
                tmpFileBinary = Buffer.concat(
                  tmpInputResponseObj.chunk.array,
                  tmpInputResponseObj.chunk.length
                ).toString('base64');
                tmpReportData.response.responseType = 'stream';
                tmpReportData.response.contentType = inputRes.headers['content-type'] || tmpDetected.mime;
                let tmpPathUrl = inputTestData.options.path;
                try {
                  tmpReportData.blobFileName = _ContentDisposition.parse(
                    inputRes.headers['content-disposition'] || 'undefined'
                  ).parameters.filename;
                } catch (PARSE_CONTENT_DISPOSITION_ERR) {
                  try {
                    tmpReportData.blobFileName = _ContentDisposition.parse(
                      encodeURI(inputRes.headers['content-disposition'] || 'undefined').replace(/\?/g, '')
                    ).parameters.filename;
                  } catch (URL_ENCODE_PARSE_CONTENT_DISPOSITION_ERR) {}
                }
                if (!tmpReportData.blobFileName && tmpDetected && tmpDetected.ext) {
                  tmpReportData.blobFileName = `response.${tmpDetected.ext}`;
                } else if (!tmpReportData.blobFileName) {
                  tmpReportData.blobFileName = tmpPathUrl.substring(
                    tmpPathUrl.lastIndexOf('/') + 1,
                    tmpPathUrl.lastIndexOf('?') === -1 ? tmpPathUrl.length : tmpPathUrl.lastIndexOf('?')
                  );
                }
              }
              _LibsApiUtil
                .responsePreReduceByPromise(
                  tmpReportData.response.body,
                  inputTestData.afterInject,
                  inputTestData.env || {},
                  {
                    globalHeader: inputOptions.globalHeader,
                    functionCode: inputTestData.functionCode,
                    responseHeaders: inputRes.headers,
                    params: inputOptions.requestData.requestBody,
                    headers: tmpAjaxXhr.getHeaders(),
                    query: inputOptions.requestData.queryParams,
                    raw: inputOptions.requestData.raw,
                  }
                )
                .then((tmpInputDataObj) => {
                  let tmpAfterCodeObj = tmpInputDataObj;
                  tmpReportData.reportList = tmpReportData.reportList.concat(tmpAfterCodeObj.reportList);
                  if (tmpAfterCodeObj.status === 'finish') {
                    if (tmpFileBinary) {
                      tmpReportData.response.body = tmpFileBinary;
                    } else {
                      tmpReportData.response.body = tmpAfterCodeObj.content;
                      tmpReportData.response.body =
                        typeof tmpReportData.response.body == 'string'
                          ? tmpReportData.response.body
                          : JSON.stringify(tmpReportData.response.body);
                    }
                  } else {
                    tmpReportData.response.errorReason = tmpAfterCodeObj.errorReason;
                    // delete tmpReportData.response.responseType;
                    // delete tmpReportData.blobFileName;
                    // delete tmpReportData.response.contentType;
                  }
                  for (let key in inputRes.headers) {
                    tmpReportData.response.headers.push({
                      key: key,
                      value: inputRes.headers[key],
                    });
                  }
                  tmpReportData.response.testDeny = tmpInputResponseObj.totalTime.toFixed(2);
                  if (callback) callback(tmpReportData);
                  resolve('success');
                });
            };
          inputOptions.timeoutLimit = CONFIG.MAX_TIME_LIMIT;
          inputOptions.timeoutLimitType = 'totalTime';
          if (inputTestData.isMuti) {
            tmpMultiForm = _Formdata();
            for (let key in inputTestData.body) {
              let val = inputTestData.body[key];
              switch (typeof val) {
                case 'string': {
                  switch (inputOptions.messageEncoding) {
                    case 'gbk': {
                      val = iconv.encode(Buffer.from(val), 'gbk');
                      break;
                    }
                  }
                  tmpMultiForm.append(key, val);
                  break;
                }
                case 'object': {
                  if (val.length > 0) {
                    for (let childKey in val) {
                      let childVal = val[childKey];
                      switch (typeof childVal) {
                        case 'object': {
                          tmpMultiForm.append(
                            key,
                            Buffer.from((childVal.dataUrl || '').replace(/^data:(.*);base64,/gi, ''), 'base64'),
                            {
                              filename: childVal.name,
                            }
                          );
                          val[childKey] = '[file] ' + childVal.name;
                          break;
                        }
                        default: {
                          tmpMultiForm.append(key, childVal);
                          break;
                        }
                      }
                    }
                  } else {
                    tmpMultiForm.append(key, '');
                  }
                  break;
                }
              }
            }
            inputTestData.options.headers = Object.assign({}, inputTestData.options.headers, tmpMultiForm.getHeaders());
          } else {
            if (!/"content-length":/i.test(JSON.stringify(inputTestData.options.headers))) {
              inputTestData.options.headers['Content-Length'] = Buffer.byteLength(inputTestData.body);
            }
          }
          inputTestData.options.headers = _HttpPackageClass.setCookieToHeaders(
            inputTestData.options.headers,
            inputTestData.options.hostname,
            inputOptions.globalHeader || {}
          );
          _HttpPackageClass.socketReduce(
            {
              postData: inputTestData.isMuti ? tmpMultiForm : inputTestData.body,
              isMuti: inputTestData.isMuti,
              options: inputTestData.options,
              timeoutLimit: inputOptions.timeoutLimit,
              timeoutLimitType: inputOptions.timeoutLimitType,
              advancedSetting: inputTestData.advancedSetting,
              globalHeader: inputOptions.globalHeader,
              pckSplitByHeader: inputOptions.pckSplitByHeader,
              messageEncoding: inputOptions.messageEncoding,
            },
            (tmpInputAjaxStatus, tmpInputDataObj, tmpInputXhr) => {
              tmpAjaxXhr = tmpInputXhr;
              tmpReportData.request.headers = [];
              tmpReportData.general.timingSummary = [_LibsApiUtil.getHttpTiming(tmpInputDataObj.summaryObj)];
              let headers = {};
              if (tmpAjaxXhr.getHeaders) {
                headers = tmpAjaxXhr.getHeaders();
                for (let key in headers) {
                  tmpReportData.request.headers.push({
                    key: key,
                    value: headers[key],
                  });
                }
              }
              let tmpHttpTotalTime = _LibsApiUtil.getMicrosToMs(
                tmpInputDataObj.summaryObj.startAt,
                tmpInputDataObj.summaryObj.endAt
              );
              switch (tmpInputAjaxStatus) {
                case 'ajax_end': {
                  if (inputTestData.advancedSetting.requestRedirect == 1) {
                    tmpReportData.general.redirectTimes++;
                    let tmpRedirectClass = new _RedirectClass.core();
                    let tmpRedirectObject = tmpRedirectClass.structureAjaxFun(
                      inputTestData.options,
                      inputTestData.isMuti ? tmpMultiForm : inputTestData.body,
                      tmpInputDataObj.res
                    );
                    if (tmpRedirectObject) {
                      if (tmpFunCheckIsIllegalUrl(tmpRedirectObject.options.hostname, tmpHttpTotalTime)) return;
                      _HttpPackageClass.socketReduce(
                        {
                          postData: tmpRedirectObject.postData,
                          isMuti: inputTestData.isMuti,
                          options: tmpRedirectObject.options,
                          timeoutLimit: inputOptions.timeoutLimit - tmpHttpTotalTime,
                          timeoutLimitType: inputOptions.timeoutLimitType,
                          advancedSetting: inputOptions.advancedSetting,
                          pckSplitByHeader: inputOptions.pckSplitByHeader,
                          messageEncoding: inputOptions.messageEncoding,
                        },
                        (tmpInputRedirectAjaxStatus, tmpInputRedirectDataObj) => {
                          tmpReportData.general.timingSummary.push(
                            _LibsApiUtil.getHttpTiming(tmpInputRedirectDataObj.summaryObj)
                          );
                          let tmpRedirectHttpTotalTime = _LibsApiUtil.getMicrosToMs(
                            tmpInputRedirectDataObj.summaryObj.startAt,
                            tmpInputRedirectDataObj.summaryObj.endAt
                          );
                          switch (tmpInputRedirectAjaxStatus) {
                            case 'ajax_end': {
                              tmpFunReduceAjaxResEnd(tmpInputRedirectDataObj.res, {
                                chunk: tmpInputRedirectDataObj.chunk,
                                str: tmpInputRedirectDataObj.responseStr,
                                totalTime: tmpHttpTotalTime + tmpRedirectHttpTotalTime,
                                contentDeliveryTiming: _LibsApiUtil.getMicrosToMs(
                                  tmpInputRedirectDataObj.summaryObj.firstByteTiming,
                                  tmpInputRedirectDataObj.summaryObj.endAt
                                ),
                              });
                              break;
                            }
                            case 'ajaxErr': {
                              tmpFunOprAjaxErr(
                                tmpInputRedirectDataObj.errObj,
                                tmpHttpTotalTime + tmpRedirectHttpTotalTime
                              );
                              break;
                            }
                          }
                        }
                      );
                      return;
                    }
                  }
                  tmpFunReduceAjaxResEnd(tmpInputDataObj.res, {
                    chunk: tmpInputDataObj.chunk,
                    str: tmpInputDataObj.responseStr,
                    totalTime: tmpHttpTotalTime,
                    contentDeliveryTiming: _LibsApiUtil.getMicrosToMs(
                      tmpInputDataObj.summaryObj.firstByteTiming,
                      tmpInputDataObj.summaryObj.endAt
                    ),
                  });
                  break;
                }
                case 'ajaxErr': {
                  tmpFunOprAjaxErr(tmpInputDataObj.errObj, tmpHttpTotalTime);
                  break;
                }
              }
            }
          );
        } catch (e) {
          tmpReportData.response.testDeny = 0;
          tmpReportData.general.time = tmpReportData.general.time || '0ms';
          tmpReportData.response.body = e.name + '：' + e.message;
          if (callback) callback(tmpReportData);
          reject(e);
        }
      });
    }
    main(inputTestData) {
      global.eoLang = _EO_LANG_OBJ[inputTestData.lang || 'en'];
      let unitCommonClass = this;
      return new Promise((resolve, reject) => {
        async function main() {
          let template = {
              ajax: {},
              status: 'finish',
            },
            tmpDecorateObj,
            tmpReportData = {
              afterInject: inputTestData.afterInject,
              beforeInject: inputTestData.beforeInject,
            };
          try {
            inputTestData.globalHeader = inputTestData.globalHeader || {};
            await privateFun.parseTestData(inputTestData, inputTestData.env || {}).then((tmpInputData) => {
              tmpDecorateObj = tmpInputData;
            });
            switch (tmpDecorateObj.status) {
              case 'preCode error': {
                template.ajax = {
                  status: 'error',
                  errorReason: tmpDecorateObj.content,
                  reportList: tmpDecorateObj.reportList,
                  general: {
                    time: '0.00ms',
                  },
                };
                break;
              }
              default: {
                tmpReportData.requestInfo = {
                  messageSeparatorSetting: inputTestData.messageSeparatorSetting,
                  params: [],
                  apiProtocol: '0',
                  URL: tmpDecorateObj.history.uri,
                  headers: [],
                  methodType: inputTestData.methodType,
                  method: inputTestData.method,
                };
                if (tmpDecorateObj.requestType === '4') {
                  tmpReportData.requestInfo.requestType = '4';
                  delete tmpReportData.requestInfo.params;
                } else {
                  switch (typeof tmpDecorateObj.history.body) {
                    case 'object': {
                      tmpReportData.requestInfo.requestType = '0';
                      for (let key in tmpDecorateObj.history.body) {
                        switch (typeof tmpDecorateObj.history.body[key]) {
                          case 'object': {
                            for (let childKey in tmpDecorateObj.history.body[key]) {
                              tmpReportData.requestInfo.params.push({
                                key: key,
                                value:
                                  typeof tmpDecorateObj.history.body[key][childKey] == 'string'
                                    ? tmpDecorateObj.history.body[key][childKey]
                                    : '[file]',
                              });
                              if (typeof tmpDecorateObj.history.body[key][childKey] != 'string') break;
                            }
                            break;
                          }
                          default: {
                            tmpReportData.requestInfo.params.push({
                              key: key,
                              value: tmpDecorateObj.history.body[key],
                            });
                            break;
                          }
                        }
                      }
                      break;
                    }
                    default: {
                      tmpReportData.requestInfo.requestType = '1';
                      tmpReportData.requestInfo.params = tmpDecorateObj.history.body;
                      break;
                    }
                  }
                }
                for (let key in tmpDecorateObj.history.headers) {
                  tmpReportData.requestInfo.headers.push({
                    name: key,
                    value: tmpDecorateObj.history.headers[key],
                  });
                }
                let tmpIsOversized,
                  tmpRequestBodyStr =
                    typeof tmpReportData.requestInfo.params === 'object'
                      ? JSON.stringify(tmpReportData.requestInfo.params)
                      : tmpReportData.requestInfo.params;
                if ((tmpRequestBodyStr || '').length > CONFIG.REQUEST_BODY_LIMIT_STORAGE_LENGTH) {
                  tmpReportData.requestInfo.requestType = 'oversized';
                  tmpReportData.requestInfo.params = '';
                  tmpIsOversized = true;
                }
                tmpReportData.requestInfo = JSON.stringify(tmpReportData.requestInfo);
                await unitCommonClass.ajax(
                  tmpDecorateObj,
                  {
                    requestData: _LibsCommon.parseRequestDataToObj(tmpDecorateObj),
                    globalHeader: inputTestData.globalHeader,
                    pckSplitByHeader: inputTestData.messageSeparatorSetting === 'spliceLength',
                    messageEncoding: inputTestData.messageEncoding,
                  },
                  function (res) {
                    template.ajax = res;
                    if (res.status != 'abort') {
                      let tmpHistoryResponse = Object.assign({}, res.response);
                      tmpHistoryResponse.reportList = res.reportList;
                      // if (tmpHistoryResponse.responseType !== 'text') delete tmpHistoryResponse.body;
                      tmpReportData.general = JSON.stringify(res.general);
                      tmpReportData.resultInfo = JSON.stringify(tmpHistoryResponse);
                      template.ajax.request.body = tmpDecorateObj.binaryFileName || tmpDecorateObj.requestBody.body;
                      if (tmpIsOversized) {
                        template.ajax.request.requestType = 'oversized';
                      } else {
                        template.ajax.request.requestType =
                          tmpDecorateObj.requestType === '4'
                            ? '1'
                            : typeof tmpDecorateObj.requestBody.body == 'object'
                            ? '0'
                            : '1';
                      }
                    }
                  }
                );
                break;
              }
            }
            resolve({
              report: template.ajax,
              history: tmpReportData,
              globals: global.eoTestGlobals,
            });
          } catch (e) {
            resolve({
              report: template.ajax,
              history: tmpReportData,
              globals: global.eoTestGlobals,
            });
            console.error(new Date() + '：unit/common.js 336：', e);
          }
        }
        main();
      });
    }
    abort() {
      this.areadyAbortXhr = true;
      if (this.xhr) this.xhr.abort();
    }
  }
  exports.core = unitCommon;
})();
