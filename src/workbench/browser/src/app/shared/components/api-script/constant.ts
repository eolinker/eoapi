import * as monaco from 'monaco-editor';

export type Note = {
  code?: string;
  desc?: string;
  input?: { key: string; value: string }[];
  output?: string;
};

export interface TreeNode {
  name: string;
  caption?: string;
  note?: Note;
  value?: string;
  children?: TreeNode[];
}

export interface FlatNode extends TreeNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}
const generateEoExcuteSnippet = (bodyType) => {
  const variableByBodyType = {
    formdata: {
      id: 'formdata',
      name: 'FORM-DATA',
      contentType: 'application/x-www-form-urlencoded',
      bodyType: 'form-data',
      body: `{
     "param_1": "value_1",
     "param_2": "value_2"
     }`,
    },
    json: {
      id: 'json',
      name: 'JSON',
      contentType: 'application/json',
      bodyType: 'json',
      body: `{
     "param_1": "value_1",
     "param_2": "value_2"
     }`,
    },
    xml: {
      id: 'xml',
      name: 'XML',
      contentType: 'application/xml',
      bodyType: 'xml',
      body: `{
      "root": {
          "book":[
              {
                  "name":"eolinker_book_1"
              },
              {
                  "name":"eolinker_book_2"
              }
          ]
      }
  }`,
    },
    raw: {
      id: 'raw',
      name: 'RAW',
      contentType: 'text/plain',
      bodyType: 'raw',
      body: `"hello world"`,
    },
  };

  const variables = variableByBodyType[bodyType];
  // Because i18n compile complex line error,safe way
  const localizes = {
    apidefind: $localize`API Definite`,
    url: $localize`[Required][string] Request url`,
    name: $localize`[Required][string] API name,for report detail`,
    header: $localize`[Not Required][object] Request headers`,
    bodyType: $localize`[Not Required][string] Body type，formdata|json|xml|raw`,
    body: $localize`[Not Required][object] Request Body`,
    timelimit: $localize`[Not Required]If it exceeds the judgment, the request fails, and the default is 1000ms`,
    execute: $localize`Execute request,${variables.id}_api_demo_1_result={time:"Test time",code:"HTTP status code",response:"API response",header:"response headers"}，`,
    assert: $localize`Assert response`,
    info: $localize`Print info`,
    infoError: $localize`Print error info`,
  };
  const result = `//${localizes.apidefind}
  var ${variables.id}_api_demo_1 = {
      "url": "https://api.eolink.com", //${localizes.url}
      "name": "${variables.name} API Demo", //${localizes.name}
      "method": "POST",
      "headers": {
          "Content-Type": "${variables.contentType}"
      }, //${localizes.header}
      "bodyType": " ${variables.bodyType}", //${localizes.bodyType}
      "body": ${variables.body},//${localizes.body}
      "timelimit": 1000 //${localizes.timelimit}
  };
  //${localizes.execute}
  var ${variables.id}_api_demo_1_result = eo.execute(${variables.id}_api_demo_1);
  //${localizes.assert}
  if (${variables.id}_api_demo_1_result.response !== "") {
      eo.info("info_1"); //${localizes.info}
  } else {
      eo.stop("info_2"); //${localizes.infoError}
  }`;
  return result;
};
export type Completion = { caption: string; value: string };

const commonInputs = [
  { key: 'param_key', value: $localize`Param Name` },
  { key: 'param_value：', value: $localize`Param Value` },
] as const;

const COMMON_DATA: TreeNode[] = [
  {
    name: $localize`Custom Global Variable`,
    children: [
      {
        name: $localize`Set an global variable`,
        caption: 'eo.globals.set',
        value: 'eo.globals.set("param_key","param_value");',
        note: {
          code: 'eo.http.response.get()',
          desc: $localize`Set an global variable`,
          input: [...commonInputs],
        },
      },
      {
        name: $localize`Get an global variable`,
        caption: 'eo.globals.get',
        value: 'eo.globals.get("param_key");',
        note: {
          code: 'eo.globals.get("param_key")',
          desc: $localize`Get an global variable`,
          input: [commonInputs[0]],
          output: $localize`Global Varibale Value`,
        },
      },
      {
        name: $localize`Clear an global variable`,
        caption: 'eo.globals.unset',
        value: 'eo.globals.unset("param_key");',
        note: {
          code: 'eo.globals.unset("param_key")',
          desc: $localize`Clear an global variable`,
          input: [commonInputs[0]],
        },
      },
      {
        name: $localize`Clear all global variable`,
        caption: 'eo.globals.clear',
        value: 'eo.globals.clear()',
        note: {
          code: 'eo.globals.clear()',
          desc: $localize`Clear all global variable`,
        },
      },
    ],
  },
  {
    name: $localize`Environment Management`,
    children: [
      {
        name: $localize`Get enviroment host`,
        caption: 'http.baseUrl.get',
        value: 'http.baseUrl.get()',
        note: {
          code: 'http.baseUrl.get()',
          desc: $localize`Get enviroment host`,
          output: $localize`The host prefix set in the environment`,
        },
      },
      {
        name: $localize`Get an environment variables`,
        caption: 'eo.env.param.get',
        value: 'eo.env.param.get("param_key")',
        note: {
          code: 'eo.env.param.get("param_key")',
          desc: $localize`Get an environment variables`,
          input: [commonInputs[0]],
        },
      },
      {
        name: $localize`Set an environment variables`,
        caption: 'eo.env.param.set',
        value: 'eo.env.param.set("param_key","param_value")',
        note: {
          code: 'eo.env.param.set("param_key","param_value")',
          desc: $localize`Set an environment variables`,
          input: [...commonInputs],
        },
      },
    ],
  },
  {
    name: $localize`Encode and Decode`,
    children: [
      {
        name: $localize`JSON Encode`,
        caption: 'eo.json.encode',
        value: 'eo.json.encode(json_object)',
        note: {
          code: 'eo.json.encode(json_object)',
          desc: $localize`JSON Encode`,
          input: [{ key: 'json_object', value: $localize`JSON object` }],
          output: $localize`JSON string`,
        },
      },
      {
        name: $localize`JSON Decode`,
        caption: 'json.decode',
        value: 'json.decode(json)',
        note: {
          code: 'json.decode(json)',
          desc: $localize`JSON Decode`,
          input: [{ key: 'json', value: $localize`JSON string` }],
          output: $localize`JSON object`,
        },
      },
      {
        name: $localize`XML Encode`,
        caption: 'xml.encode',
        value: 'xml.encode(xml_object)',
        note: {
          code: 'xml.encode(xml_object)',
          desc: $localize`XML Encode`,
          input: [{ key: 'xml_object', value: $localize`XML object` }],
          output: $localize`XML string`,
        },
      },
      {
        name: $localize`XML Decode`,
        caption: 'xml.decode',
        value: 'xml.decode(xml)',
        note: {
          code: 'xml.decode(xml)',
          desc: $localize`XML Decode`,
          input: [{ key: 'xml', value: $localize`XML string` }],
          output: $localize`XML code`,
        },
      },
      {
        name: $localize`Base64 Encode`,
        caption: 'base64.encode',
        value: 'base64.encode(data)',
        note: {
          code: 'base64.encode(data)',
          desc: $localize`Base64 Encode`,
          input: [{ key: 'data', value: $localize`string of wait for encode` }],
          output: $localize`string after encode`,
        },
      },
      {
        name: $localize`Base64 Decode`,
        caption: 'base64.decode',
        value: 'base64.decode(data)',
        note: {
          code: 'base64.decode(data)',
          desc: $localize`Base64 Decode`,
          input: [{ key: 'data', value: $localize`string of wait for decode` }],
          output: $localize`string after decode`,
        },
      },
      {
        name: $localize`UrlEncode Encode`,
        caption: 'eo.urlEncode',
        value: 'eo.urlEncode(data)',
        note: {
          code: 'eo.urlEncode(data)',
          desc: $localize`UrlEncode Encode`,
          input: [{ key: 'data', value: $localize`string of wait for encode` }],
          output: $localize`string after encode`,
        },
      },
      {
        name: $localize`UrlEncode Decode`,
        caption: 'eo.urlDecode',
        value: 'eo.urlDecode(data)',
        note: {
          code: 'eo.urlDecode(data)',
          desc: $localize`UrlEncode Decode`,
          input: [{ key: 'data', value: $localize`string of wait for decode` }],
          output: $localize`string after decode`,
        },
      },
      {
        name: $localize`Gzip zip`,
        caption: 'eo.gzip.zip',
        value: 'eo.gzip.zip(data)',
        note: {
          code: 'eo.gzip.zip(data)',
          desc: $localize`Gzip zip`,
          input: [{ key: 'data', value: $localize`string of wait for zip` }],
          output: $localize`string after zip`,
        },
      },
      {
        name: $localize`Gzip unzip`,
        caption: 'eo.gzip.unzip',
        value: 'eo.gzip.unzip(data)',
        note: {
          code: 'eo.gzip.unzip(data)',
          desc: $localize`Gzip unzip`,
          input: [{ key: 'data', value: $localize`string of wait for unzip` }],
          output: $localize`string after unzip`,
        },
      },
      {
        name: $localize`Deflate zip`,
        caption: 'eo.deflate.zip',
        value: 'eo.deflate.zip(data)',
        note: {
          code: 'eo.deflate.zip(data)',
          desc: $localize`Deflate zip`,
          input: [{ key: 'data', value: $localize`string of wait for zip` }],
          output: $localize`string after zip`,
        },
      },
      {
        name: $localize`Deflate unzip`,
        caption: 'eo.deflate.unzip',
        value: 'eo.deflate.unzip(data)',
        note: {
          code: 'eo.deflate.unzip(data)',
          desc: $localize`Deflate unzip`,
          input: [{ key: 'data', value: $localize`string of wait for unzip` }],
          output: $localize`string after unzip`,
        },
      },
    ],
  },
  {
    name: $localize`Encryption and Decryption`,
    children: [
      {
        name: `MD5`,
        caption: 'eo.crypt.md5',
        value: 'eo.crypt.md5(data)',
        note: {
          code: 'eo.crypt.md5(data)',
          desc: $localize`MD5 Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
          ],
          output: $localize`Encrypted result`,
        },
      },
      {
        name: $localize`SHA1 Encryption`,
        caption: 'eo.crypt.sha1',
        value: 'eo.crypt.sha1(data)',
        note: {
          code: 'eo.crypt.sha1(data)',
          desc: $localize`SHA1 Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
          ],
          output: $localize`Encrypted result`,
        },
      },
      {
        name: $localize`SHA256 Encryption`, // SHA256 加密
        caption: 'eo.crypt.sha256',
        value: 'eo.crypt.sha256(data)',
        note: {
          code: 'eo.crypt.sha256(data)',
          desc: $localize`SHA256 Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
          ],
          output: $localize`Encrypted result`,
        },
      },
      {
        name: $localize`RSA-SHA1 Signature`,
        caption: 'eo.crypt.rsaSHA1',
        value: 'eo.crypt.rsaSHA1(data,privateKey,"base64")',
        note: {
          code: 'eo.crypt.rsaSHA1(data,privateKey,"base64")',
          desc: $localize`RSA-SHA1 Signature`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'privateKey',
              value: $localize`private key`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the result, base64 (default)`,
            },
          ],
          output: $localize`Content After Signing`,
        },
      },
      {
        name: $localize`RSA-SHA256 Signature`, // RSA-SHA256 签名
        caption: 'eo.crypt.rsaSHA256',
        value: 'eo.crypt.rsaSHA256(data,privateKey,"base64")',
        note: {
          code: 'eo.crypt.rsaSHA256(data,privateKey,"base64")',
          desc: $localize`RSA-SHA256 Signature`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'privateKey',
              value: $localize`private key`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the result, base64 (default)`,
            },
          ],
          output: $localize`Content After Signing`,
        },
      },
      {
        name: $localize`RSA Public Key Encryption`, // RSA 公钥加密
        caption: 'eo.crypt.rsaPublicEncrypt',
        value: 'eo.crypt.rsaPublicEncrypt(data,publicKey,"base64")',
        note: {
          code: 'eo.crypt.rsaPublicEncrypt(data,publicKey,"base64")',
          desc: $localize`RSA Public Key Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'publicKey',
              value: $localize`public key`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the result, base64 (default)`,
            },
          ],
          output: $localize`Content After Signing`,
        },
      },
      {
        name: $localize`RSA Public Key Dencryption`, // RSA 公钥解密
        caption: 'eo.crypt.rsaPublicDecrypt',
        value: 'eo.crypt.rsaPublicDecrypt(data,publicKey,"base64")',
        note: {
          code: 'eo.crypt.rsaPublicDecrypt(data,publicKey,"base64")',
          desc: $localize`RSA Public Key Dencryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'publicKey',
              value: $localize`public key`,
            },
            {
              key: 'inputEncoding',
              value: $localize`The encoding format of the content to be decrypted, base64 (default)`,
            },
          ],
          output: $localize`Decrypted content`,
        },
      },
      {
        name: $localize`RSA Private Key Encryption`, // RSA 私钥加密
        caption: 'eo.crypt.rsaPrivateEncrypt',
        value: 'eo.crypt.rsaPrivateEncrypt(data,privateKey,"base64")',
        note: {
          code: 'eo.crypt.rsaPrivateEncrypt(data,privateKey,"base64")',
          desc: $localize`RSA Private Key Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'privateKey',
              value: $localize`private key`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the result, base64 (default)`,
            },
          ],
          output: $localize`Encrypted result`,
        },
      },
      {
        name: $localize`RSA Private Key Encryption`, // RSA 私钥解密
        caption: 'eo.crypt.rsaPrivateDecrypt',
        value: 'eo.crypt.rsaPrivateDecrypt(data,privateKey,"base64")',
        note: {
          code: 'eo.crypt.rsaPrivateDecrypt(data,privateKey,"base64")',
          desc: $localize`RSA Private Key Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be decrypted`,
            },
            {
              key: 'privateKey',
              value: $localize`private key`,
            },
            {
              key: 'outputEncoding',
              value: $localize`The encoding format of the content to be decrypted, base64 (default)`,
            },
          ],
          output: $localize`Decrypted Content`,
        },
      },
      {
        name: $localize`AES Encryption`, // AES 加密
        caption: 'eo.crypt.aesEncrypt',
        value: 'eo.crypt.aesEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
        note: {
          code: 'eo.crypt.aesEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
          desc: $localize`AES Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'password',
              value: $localize`password`,
            },
            {
              key: 'padding',
              value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`,
            },
            {
              key: 'mode',
              value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`,
            },
            {
              key: 'iv',
              value: $localize`offset vector`,
            },
          ],
          output: $localize`Encrypted result`,
        },
      },
      {
        name: $localize`AES Dencryption`, // AES 解密
        caption: 'eo.crypt.aesDecrypt',
        value: 'eo.crypt.aesDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
        note: {
          code: 'eo.crypt.aesDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
          desc: $localize`AES Dencryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'password',
              value: $localize`password`,
            },
            {
              key: 'padding',
              value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`,
            },
            {
              key: 'mode',
              value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`,
            },
            {
              key: 'iv',
              value: $localize`offset vector`,
            },
          ],
          output: $localize`Encrypted result`,
        },
      },
      {
        name: $localize`DES Encryption`, // DES 加密
        caption: 'eo.crypt.desEncrypt',
        value: 'eo.crypt.desEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
        note: {
          code: 'eo.crypt.desEncrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
          desc: $localize`DES Encryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'password',
              value: $localize`password`,
            },
            {
              key: 'padding',
              value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`,
            },
            {
              key: 'mode',
              value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`,
            },
            {
              key: 'iv',
              value: $localize`offset vector`,
            },
          ],
          output: $localize`Encrypted result`,
        },
      },
      {
        name: $localize`DES Dencryption`, // DES 解密
        caption: 'eo.crypt.desDecrypt',
        value: 'eo.crypt.desDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
        note: {
          code: 'eo.crypt.desDecrypt(data,password,{"padding":"Pkcs7","mode":"CBC","iv":""})',
          desc: $localize`DES Dencryption`,
          input: [
            {
              key: 'data',
              value: $localize`Content to be encrypted`,
            },
            {
              key: 'password',
              value: $localize`password`,
            },
            {
              key: 'padding',
              value: $localize`Padding mode, Pkcs7 (default)/NoPadding/ZeroPadding`,
            },
            {
              key: 'mode',
              value: $localize`Mode, CBC (default)/ECB/CTR/OFB/CFB`,
            },
            {
              key: 'iv',
              value: $localize`offset vector`,
            },
          ],
          output: $localize`Encrypted result`,
        },
      },
    ],
  },
];

export const BEFORE_DATA: TreeNode[] = [
  {
    name: $localize`HTTP API request`,
    children: [
      {
        name: $localize`Set Request URL`,
        caption: 'eo.http.url.set',
        value: 'eo.http.url.set("new_url")',
        note: {
          code: 'eo.http.url.set("new_url")',
          desc: $localize`Set HTTP API request path`,
          input: [{ key: 'new_url', value: $localize`new url` }],
        },
      },
      {
        name: $localize`Set Header`,
        caption: 'eo.http.header.set',
        value: 'eo.http.header.set("param_key","param_value")',
        note: {
          code: 'eo.http.header.set("param_key","param_value")',
          desc: $localize`Set HTTP API request header params`,
          input: [
            { key: 'param_key', value: $localize`params name` },
            { key: 'param_value', value: $localize`params value` },
          ],
        },
      },

      {
        name: $localize`Request body[Form-data]`,
        caption: 'eo.http.bodyParseParam',
        value: 'eo.http.bodyParseParam',
      },

      {
        name: $localize`Request body[Raw]`,
        caption: 'eo.http.bodyParam',
        value: 'eo.http.bodyParam',
      },
      {
        name: $localize`Set REST params`,
        caption: 'eo.http.rest.set',
        value: 'eo.http.rest.set("param_key","param_value")',
        note: {
          code: 'eo.http.rest.set("param_key","param_value")',
          desc: $localize`Set HTTP API REST params`,
          input: [
            { key: 'param_key', value: $localize`params name` },
            { key: 'param_value', value: $localize`params value` },
          ],
        },
      },
      {
        name: $localize`Set Query params`,
        caption: 'eo.http.query.set',
        value: 'eo.http.query.set("param_key","param_value")',
        note: {
          code: 'eo.http.query.set("param_key","param_value")',
          desc: $localize`Set HTTP API Query params`,
          input: [
            { key: 'param_key', value: $localize`params name` },
            { key: 'param_value', value: $localize`params value` },
          ],
        },
      },
      {
        name: $localize`Insert new API test[Form-data]`,
        caption: '',
        value: generateEoExcuteSnippet('formdata'),
      },
      {
        name: $localize`Insert new API test[JSON]`,
        caption: '',
        value: generateEoExcuteSnippet('json'),
      },
      {
        name: $localize`Insert new API test[XML]`,
        caption: '',
        value: generateEoExcuteSnippet('xml'),
      },
      {
        name: $localize`Insert new API test[Raw]`,
        caption: '',
        value: generateEoExcuteSnippet('raw'),
      },
    ],
  },
  ...COMMON_DATA,
];

export const AFTER_DATA: TreeNode[] = [
  {
    name: $localize`HTTP API request`,
    children: [
      {
        name: $localize`Get Response Results`,
        caption: 'eo.http.response.get',
        value: 'eo.http.response.get();',
        note: {
          code: 'eo.http.response.get()',
          desc: $localize`Get the response result of the HTTP API`,
        },
      },
      {
        name: $localize`Set Response Result`,
        caption: 'eo.http.response.set',
        value: 'eo.http.response.set("response_value");',
        note: {
          code: 'eo.http.response.set("response_value")',
          desc: $localize`Set the response result of the HTTP API`,
          input: [{ key: 'response_value', value: $localize`response result` }],
        },
      },
    ],
  },
  ...COMMON_DATA,
];

export const beforeScriptCompletions: any[] = BEFORE_DATA.flatMap((n) => n.children).reduce((prev, curr) => {
  const { caption, value } = curr;
  if (caption) {
    prev.push({
      label: caption,
      insertText: value,
      kind: monaco.languages.CompletionItemKind.Function,
    });
  }
  return prev;
}, []);

export const afterScriptCompletions: Completion[] = AFTER_DATA.flatMap((n) => n.children).reduce((prev, curr) => {
  const { caption, value } = curr;
  if (caption) {
    prev.push({
      label: caption,
      insertText: value,
      kind: monaco.languages.CompletionItemKind.Function,
    });
  }
  return prev;
}, []);
