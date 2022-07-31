import { Injectable } from '@angular/core';
import { ApiTestHeaders, ApiTestQuery, ContentTypeByAbridge } from '../../../shared/services/api-test/api-test.model';
import { ApiBodyType, ApiTestHistory } from '../../../shared/services/storage/index.model';
import { uiData2Json, text2UiData, json2XML } from '../../../utils/data-transfer/data-transfer.utils';

@Injectable()
export class ApiTestService {
  globalStorageKey = 'EO_TEST_VAR_GLOBALS';
  constructor() {}
  initListConf(opts) {
    opts.title = opts.title || $localize`Param`;
    opts.nameTitle = opts.nameTitle || $localize`${opts.title} Name`;
    opts.valueTitle = opts.valueTitle || $localize`${opts.title} Value`;
    return {
      setting: {
        // draggable: true,
        // dragCacheVar: opts.dragCacheVar || 'DRAG_VAR_API_PARAM',
      },
      baseFun: {
        watchCheckboxChange: opts.watchFormLastChange,
      },
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          thKey: '',
          type: 'checkbox',
          modelKey: 'required',
          mark: 'require',
        },
        {
          thKey: opts.nameTitle,
          type: 'input',
          modelKey: 'name',
          placeholder: opts.nameTitle,
          // width: 300,
          // mark: 'name',
        },
        {
          thKey: opts.valueTitle,
          type: 'input',
          modelKey: 'value',
          placeholder: opts.valueTitle,
          // width: 200,
          // hide: 1,
          // mark: 'value',
        },
        {
          type: 'btn',
          class: 'w_250',
          btnList: [
            {
              key: $localize`:@@Delete:Delete`,
              operateName: 'delete',
            },
          ],
        },
      ],
    };
  }
  initBodyListConf(opts) {
    const reduceItemWhenIsOprDepth = (inputItem) => {
      switch (inputItem.type) {
        case 'json':
        case 'array':
        case 'object': {
          break;
        }
        default: {
          inputItem.type = 'object';
        }
      }
      return true;
    };
    return {
      setting: {
        draggableWithSelect: true,
        draggable: true,
        dragCacheVar: 'DRAG_VAR_API_TEST_BODY',
      },
      baseFun: {
        reduceItemWhenAddChildItem: reduceItemWhenIsOprDepth,
        watchCheckboxChange: opts.watchFormLastChange,
        importFile: opts.importFile,
      },
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          thKey: '',
          type: 'checkbox',
          modelKey: 'required',
          mark: 'require',
        },
        {
          thKey: $localize`Param Name`,
          type: 'depthInput',
          modelKey: 'name',
          placeholder: $localize`Param Name`,
          width: 300,
          mark: 'name',
        },
        {
          thKey: $localize`Type`,
          type: 'select',
          key: 'key',
          value: 'value',
          class: 'drag_select_conatiner',
          initialData: 'item.type',
          selectQuery: [],
          modelKey: 'type',
          mark: 'type',
          width: 100,
        },

        {
          thKey: $localize`Value`,
          type: 'autoCompleteAndFile',
          modelKey: 'value',
          switchVar: 'type',
          swicthFile: 'file',
          placeholder: $localize`Value`,
          width: 300,
          mark: 'value',
        },
        {
          type: 'btn',
          class: 'w_250',
          btnList: [
            {
              key: $localize`Add Child`,
              operateName: 'addChild',
              itemExpression: `eo-attr-tip-placeholder="add_child_btn" ng-if="$ctrl.mainObject.setting.isLevel"`,
            },
            {
              key: $localize`:@@Delete:Delete`,
              operateName: 'delete',
              itemExpression: 'ng-if="!($ctrl.mainObject.setting.munalHideOperateColumn&&$first)"',
            },
          ],
        },
      ],
    };
  }
  /**
   * URL and Query transfer each other
   *
   * @description Add query to URL and read query form url
   * @param url - whole url include query
   * @param query - ui query param
   * @param opts.base - based on which,url or query,delete no exist and replace same
   * @param opts.replaceType - replace means only keep replace array,merge means union
   * @returns - {url:"",query:[]}
   */
  transferUrlAndQuery(
    url,
    query,
    opts: { base: string; replaceType: string } = {
      base: 'url',
      replaceType: 'replace',
    }
  ) {
    const urlQuery = [];
    const uiQuery = query;
    //Get url query
    new URLSearchParams(url.split('?').slice(1).join('?')).forEach((val, name) => {
      const item: ApiTestQuery = {
        name,
        required: true,
        value: val,
      };
      urlQuery.push(item);
    });
    //Get replace result
    const origin = opts.base === 'url' ? uiQuery : urlQuery;
    const replace = opts.base === 'url' ? urlQuery : uiQuery;
    if (opts.replaceType === 'replace') {
      origin.forEach((val) => (val.required = false));
    }
    const result = [...replace, ...origin];
    for (let i = 0; i < result.length; ++i) {
      for (let j = i + 1; j < result.length; ++j) {
        if (result[i].name === result[j].name) {
          result.splice(j--, 1);
        }
      }
    }
    //Joint query
    let search = '';
    result.forEach((val) => {
      if (!val.name || !val.required) {
        return;
      }
      search += `${val.name}=${val.value === undefined ? val.example : val.value}&`;
    });
    search = search ? `?${search.slice(0, -1)}` : '';
    url = `${url.split('?')[0]}${search}`;
    return {
      url,
      query: result,
    };
  }
  getHTTPStatus(statusCode) {
    const HTTP_CODE_STATUS = [
      {
        status: 'info',
        cap: 199,
        class: 'code_blue',
        fontClass: 'cb',
      },
      {
        status: 'success',
        cap: 299,
        class: 'code_green',
        fontClass: 'cg',
      },
      {
        status: 'redirect',
        cap: 399,
        class: 'code_yellow',
        fontClass: 'cy',
      },
      {
        status: 'clientError',
        cap: 499,
        class: 'code_red',
        fontClass: 'cr',
      },
      {
        status: 'serverError',
        cap: 599,
        class: 'code_red',
        fontClass: 'cr',
      },
    ];
    return HTTP_CODE_STATUS.find((val) => statusCode <= val.cap);
  }
  getTestDataFromHistory(inData: ApiTestHistory) {
    console.log(inData);
    const result = {
      testData: {
        uuid: inData.apiDataID,
        queryParams: [],
        restParams: [],
        requestBody: [ApiBodyType.Raw, ApiBodyType.Binary].includes(inData.request.requestBodyType as ApiBodyType)
          ? inData.request.requestBody
          : inData.request.requestBody.map((val) => (val.required = true)),
        requestHeaders: inData.response.headers,
        ...inData.request,
      },
      response: JSON.parse(JSON.stringify(inData)),
    };
    return result;
  }
  /**
   * Transfer test data/test history to api data
   *
   * @param inData.history
   * @param inData.testData - test request info
   * @returns
   */
  getApiFromTestData(inData) {
    const testToEditParams = (arr) => {
      const result = [];
      arr.forEach((val) => {
        if (!val.name) {
          return;
        }
        const item = { ...val, example: val.value };
        delete item.value;
        result.push(item);
      });
      return result;
    };
    const result = {
      ...inData.testData,
      responseHeaders: inData.history.response.headers || [],
      responseBodyType: 'json',
      responseBodyJsonType: 'object',
      responseBody: [],
    };
    delete result.uuid;
    ['requestHeaders', 'requestBody', 'restParams', 'queryParams'].forEach((keyName) => {
      if (!result[keyName] || typeof result[keyName] !== 'object') {
        return;
      }
      result[keyName] = testToEditParams(result[keyName]);
    });
    if (inData.history.response.responseType === 'text') {
      const bodyInfo = text2UiData(inData.history.response.body);
      result.responseBody = bodyInfo.data;
      result.responseBodyType = bodyInfo.textType;
      result.responseBodyJsonType = bodyInfo.rootType;
    }
    return result;
  }
  getTestDataFromApi(inData) {
    const editToTestParams = (arr) => {
      arr = arr || [];
      arr.forEach((val) => {
        val.value = val.example;
        delete val.example;
      });
    };
    ['queryParams', 'restParams', 'requestHeaders'].forEach((keyName) => {
      editToTestParams(inData[keyName]);
    });
    //handle query and url
    const tmpResult = this.transferUrlAndQuery(inData.uri, inData.queryParams, {
      base: 'url',
      replaceType: 'merge',
    });
    inData.uri = tmpResult.url;
    inData.queryParams = tmpResult.query;
    //parse body
    switch (inData.requestBodyType) {
      case ApiBodyType.JSON: {
        inData.requestBody = JSON.stringify(
          uiData2Json(inData.requestBody, {
            defaultValueKey: 'example',
          })
        );
        break;
      }
      case ApiBodyType.XML: {
        inData.requestBody = json2XML(
          uiData2Json(inData.requestBody, {
            defaultValueKey: 'example',
          })
        );
        break;
      }
      case ApiBodyType['Form-data']: {
        inData.requestBody.forEach((val) => {
          val.value = val.example;
          val.type = val.type === 'file' ? 'file' : 'string';
          delete val.example;
        });
        break;
      }
      case ApiBodyType.Binary:{
        inData.requestBody='';
        break;
      }
    }
    if (['json', 'xml'].includes(inData.requestBodyType)) {
      //Add/Replace Content-type
      const contentType: ContentTypeByAbridge =
        inData.requestBodyType === 'xml' ? ContentTypeByAbridge.XML : ContentTypeByAbridge.JSON;
      inData.requestHeaders = this.addOrReplaceContentType(contentType, inData.requestHeaders);
      //Xml、Json change content-type to raw in test page
      inData.requestBodyType = 'raw';
    }
    return inData;
  }
  getContentType(headers) {
    const existHeader = headers.find((val) => val.name.toLowerCase() === 'content-type');
    if (!existHeader) {
      return;
    }
    return existHeader.value;
  }
  /**
   * @param type content-type be added/replaced
   * @param headers
   */
  addOrReplaceContentType(contentType: ContentTypeByAbridge, headers: ApiTestHeaders[] = []) {
    const result = headers;
    const existHeader = headers.find((val) => val.name.toLowerCase() === 'content-type');
    if (existHeader) {
      existHeader.value = contentType;
      return result;
    }
    headers.unshift({
      required: true,
      name: 'content-type',
      value: contentType,
    });
    return result;
  }
  getGlobals(): object {
    let result = {};
    const global = localStorage.getItem(this.globalStorageKey);
    try {
      result = JSON.parse(global);
    } catch (e) {}
    return result;
  }
  setGlobals(globals) {
    if (!globals) {
      return;
    }
    localStorage.setItem(this.globalStorageKey, JSON.stringify(globals));
  }
}
