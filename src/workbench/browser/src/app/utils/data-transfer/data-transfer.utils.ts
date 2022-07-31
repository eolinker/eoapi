import { whatType, whatTextType } from '..';
import { ApiBodyType, ApiEditBody, JsonRootType } from '../../shared/services/storage/index.model';
import { flatData } from '../tree/tree.utils';

export const isXML = (data) => {
  const parser = new DOMParser();
  let xml = null;
  try {
    const xmlContent = parser.parseFromString(data, 'text/xml');
    xml = xmlContent.getElementsByTagName('parsererror');
  } catch (error) {
    return false;
  }
  if (xml.length > 0) {
    return false;
  }
  return true;
};
/**
 * Parse item to table need row data
 */
export const parseTree = (key, value, level = 0) => {
  if (whatType(value) === 'object') {
    return {
      name: key,
      required: true,
      example: '',
      type: 'object',
      description: '',
      listDepth: level,
      children: Object.keys(value).map((it) => parseTree(it, value[it], level + 1)),
    };
  }
  if (whatType(value) === 'array') {
    // * just by first
    const [data] = value;
    if (whatType(data) === 'string') {
      return {
        name: key,
        required: true,
        value: JSON.stringify(value),
        example: JSON.stringify(value),
        type: 'array',
        description: '',
        listDepth: level,
      };
    }
    return {
      name: key,
      required: true,
      example: '',
      type: 'array',
      description: '',
      listDepth: level,
      children: data ? Object.keys(data).map((it) => parseTree(it, data[it], level + 1)) : [],
    };
  }
  return {
    name: key,
    value,
    description: '',
    type: whatType(value),
    required: true,
    example: value || '',
    listDepth: level,
  };
};
/**
 * Parse item to table need row data
 */
export const form2json = (tmpl) =>
  tmpl
    .split('\n')
    .filter((it) => it.trim())
    .map((it) => it.split(':'))
    .map((it) => {
      const [key, value] = it;
      return { key: key.trim(), value: value.trim() };
    });

export const xml2json = (tmpl) => {
  // * delete <?xml ... ?>
  let xml = tmpl.replace(/<\?xml.+\?>/g, '').trim();
  if (xml === '') {
    return [];
  }
  const startTag = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m;
  const endTag = /^<\/([^>\s]+)[^>]*>/m;
  const stack = [];
  const result = [];
  let start = null;
  let index = null;
  while (xml) {
    // * handle end tags
    if (xml.substring(0, 2) === '</') {
      const end = xml.match(endTag);
      const [str, label] = end;
      const last = stack.pop();
      if (last.tagName !== label) {
        throw new Error('Parse error 101');
      }
      if (stack.length === 0) {
        result.push(last);
      } else {
        const parent = stack.pop();
        parent.children.push(last);
        stack.push(parent);
      }
      xml = xml.substring(str.length);
      continue;
    }
    // * handle start tags
    if ((start = xml.match(startTag))) {
      const [str, label, attr] = start;
      stack.push({
        tagName: label.trim(),
        attr: attr.trim(),
        content: '',
        children: [],
      });
      xml = xml.trim().substring(str.length);
      continue;
    }
    // * handle text content
    if ((index = xml.indexOf('<') > 0)) {
      const content = xml.slice(0, index);
      const last = stack.pop();
      last.content += content;
      stack.push(last);
      xml = xml.substring(index);
      index = null;
    }
    xml = xml.trim();
  }
  if (stack.length) {
    throw new Error('Parse error 102');
  }
  return result;
};

interface uiData {
  textType: ApiBodyType | string;
  rootType: JsonRootType | string;
  data: any;
}
export const xml2UiData = (text) => {
  const data: any[] = xml2json(text);
  const result = {};
  const mapAttr = (obj: any) => {
    const { tagName, attr, children, content } = obj;
    return {
      [tagName]: children.length ? mapAttr(children[0]) : attr,
    };
  };
  data.forEach((it) => {
    const { tagName, attr, children } = it;
    result[tagName] = children.length ? mapAttr(children[0]) : attr;
  });
  return JSON.parse(JSON.stringify(result));
};
/**
 * Json object 2 xml
 *
 * @param o Object
 * @param tab tab or indent string for pretty output formatting,omit or use empty string "" to supress.
 * @returns
 */
export const json2XML: (o: object, tab?) => string = (o, tab) => {
  const toXml = function(v, name, ind) {
    let xml = '';
    if (v instanceof Array) {
      for (let i = 0, n = v.length; i < n; i++) {
        xml += ind + toXml(v[i], name, ind + '\t') + '\n';
      }
    } else if (typeof v == 'object') {
      let hasChild = false;
      xml += ind + '<' + name;
      for (var m in v) {
        if (m.charAt(0) == '@') {
          xml += ' ' + m.substr(1) + '="' + v[m].toString() + '"';
        } else {
          hasChild = true;
        }
      }
      xml += hasChild ? '>' : '/>';
      if (hasChild) {
        for (var m in v) {
          if (m == '#text') {
            xml += v[m];
          } else if (m == '#cdata') {
            xml += '<![CDATA[' + v[m] + ']]>';
          } else if (m.charAt(0) != '@') {
            xml += toXml(v[m], m, ind + '\t');
          }
        }
        xml += (xml.charAt(xml.length - 1) == '\n' ? ind : '') + '</' + name + '>';
      }
    } else {
      xml += ind + '<' + name + '>' + v.toString() + '</' + name + '>';
    }
    return xml;
  };
  let xml = '';
  for (const m in o) {
    if (Object.prototype.hasOwnProperty.call(o, m)) {
      xml += toXml(o[m], m, '');
    }
  }
  return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, '');
};

/**
 * Transfer text to json/xml/raw ui data,such as request body/response body
 *
 * @returns body info
 */
export const text2UiData: (text: string) => uiData = (text) => {
  const result: uiData = {
    textType: 'raw',
    rootType: 'object',
    data: text,
  };
  const textType = whatTextType(text);
  result.textType = ['xml', 'json'].includes(textType) ? textType : 'raw';
  switch (result.textType) {
    case 'xml': {
      result.data = xml2UiData(text);
      result.data = flatData(Object.keys(result.data).map((it) => parseTree(it, result.data[it])));
      break;
    }
    case 'json': {
      try {
        result.data = JSON.parse(result.data);
        result.data = flatData(Object.keys(result.data).map((it) => parseTree(it, result.data[it])));
      } catch (error) {
        result.textType = 'raw';
      }
      break;
    }
    default: {
      break;
    }
  }
  return result;
};

/**
 * Format eoapi body to json
 * !TODO refactor
 *
 * @param eoapiList
 * @param inputOptions
 * @returns
 */
export const uiData2Json = function(eoapiArr: ApiEditBody, inputOptions) {
  inputOptions = inputOptions || {};
  const result = {};
  const loopFun = (inputArr, inputObject) => {
    if (inputOptions.checkXmlAttr) {
      inputObject['@eo_attr'] = inputObject['@eo_attr'] || {};
    }
    for (const val of inputArr) {
      if (!val.name) {
        continue;
      }
      if (!val.required && !inputOptions.ignoreCheckbox) {
        continue;
      }
      const tmpKey = val.nameHtml || val.name;
      if (inputOptions.checkXmlAttr) {
        if (val.isErrorXmlAttr) {
          // $rootScope.InfoModal('请填写正确格式的XML属性列表再进行转换', 'warning');
          throw new Error('errorXmlAttr');
        }
        if (inputObject['@eo_attr'].hasOwnProperty(tmpKey)) {
          inputObject['@eo_attr'][tmpKey] = [
            inputObject['@eo_attr'][tmpKey],
            (val.attribute || '').replace(/\s+/, ' '),
          ];
        } else {
          inputObject['@eo_attr'][tmpKey] = (val.attribute || '').replace(/\s+/, ' ');
        }
      }
      if (inputOptions.defaultValueKey) {
        inputObject[tmpKey] = val[inputOptions.defaultValueKey];
      } else {
        inputObject[tmpKey] = val.paramInfo;
      }
      if (val.children && val.children.length > 0) {
        switch (val.type) {
          case 'array': {
            const tmp_child_zero_item = val.children[0];
            if (tmp_child_zero_item.isArrItem) {
              // 判断是否为新数组格式
              if (inputOptions.checkXmlAttr) {
                inputObject['@eo_attr'][tmpKey] = [];
              }
              inputObject[tmpKey] = [];
              val.children.forEach((tmp_arr_item) => {
                if (!(tmp_arr_item.checkbox || tmp_arr_item.paramNotNull || inputOptions.ignoreCheckbox)) {
                  return;
                }
                if (inputOptions.checkXmlAttr) {
                  const tmp_attr = typeof tmp_arr_item.attribute === 'string' ? tmp_arr_item.attribute : '';
                  inputObject['@eo_attr'][tmpKey].push(tmp_attr.replace(/\s+/, ' '));
                }
                let tmp_result_arr_item = {};
                if (tmp_arr_item.type === 'array' || !(tmp_arr_item.children && tmp_arr_item.children.length > 0)) {
                  loopFun([tmp_arr_item], tmp_result_arr_item);
                  tmp_result_arr_item = tmp_result_arr_item[tmp_arr_item.nameHtml || tmp_arr_item.name];
                } else {
                  loopFun(tmp_arr_item.children, tmp_result_arr_item);
                }
                inputObject[tmpKey].push(tmp_result_arr_item);
              });
            } else {
              if (inputOptions.checkXmlAttr) {
                inputObject['@eo_attr'][tmpKey] = [inputObject['@eo_attr'][tmpKey]];
              }
              inputObject[tmpKey] = [{}];
              loopFun(val.children, inputObject[tmpKey][0]);
            }
            break;
          }
          default: {
            inputObject[tmpKey] = {};
            loopFun(val.children, inputObject[tmpKey]);
            break;
          }
        }
      } else {
        const tmpDefaultTypeValueObj = {
          boolean: 'false',
          array: '[]',
          object: '{}',
          number: '0',
          int: '0',
        };
        switch (val.type) {
          case 'string': {
            inputObject[tmpKey] = inputObject[tmpKey] || '';
            break;
          }
          case 'null': {
            inputObject[tmpKey] = null;
            break;
          }
          default: {
            try {
              inputObject[tmpKey] = JSON.parse(inputObject[tmpKey] || tmpDefaultTypeValueObj[val.type]);
            } catch (JSON_PARSE_ERROR) {
              inputObject[tmpKey] = inputObject[tmpKey] || '';
            }
            break;
          }
        }
      }
    }
  };
  loopFun(eoapiArr, result);
  return result;
};
