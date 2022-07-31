export enum ApiTestParamsTypeFormData {
  text = 'string',
  file = 'file',
}
export enum ContentTypeByAbridge {
  Text = 'text/plain',
  JSON = 'application/json',
  XML = 'application/xml',
  HTML = 'text/html',
}
interface BasiApiTestParams {
  /**
   * send this param when test
   */
  required: boolean;
  /**
   * param name
   */
  name: string;
  /**
   * param value
   */
  value: string;
}
export type ApiTestHeaders = BasiApiTestParams;
export type ApiTestQuery = BasiApiTestParams;
export type ApiTestRest = BasiApiTestParams;
export interface ApiTestBody extends BasiApiTestParams {
  /**
   * param type
   */
  type: string;
  /**
   * If value is file,value is base64 string
   */
  files?: string;
  /**
   * XML attribute
   */
  attribute?: string;
  /**
   * child param
   */
  children?: ApiTestBody[];
}

export enum ApiTestBodyType {
  'Form-data' = 'formData',
  Raw = 'raw',
  Binary = 'binary',
}
