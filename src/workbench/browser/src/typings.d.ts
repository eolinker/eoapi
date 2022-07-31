/* SystemJS module definition */
declare const nodeModule: NodeModule;
import * as monaco from 'monaco-editor';

interface NodeModule {
  id: string;
}
declare global {
  interface Window {
    process: any;
    requirejs: any;
    require: any;
    angular: any;
    eo: any;
    BlobBuilder: any;
    WebKitBlobBuilder: any;
    MozBlobBuilder: any;
    MSBlobBuilder: any;
    monaco: typeof monaco;
  }
}
