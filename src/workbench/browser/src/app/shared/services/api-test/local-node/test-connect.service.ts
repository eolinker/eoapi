import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { ElectronService } from '../../../../core/services';
import { requestDataOpts, TestServer } from '../test-server.model';
import { eoFormatRequestData, eoFormatResponseData } from '../api-test.utils';
@Injectable()
export class TestServerLocalNodeService implements TestServer {
  constructor(private electron: ElectronService, @Inject(LOCALE_ID) private locale: string) {}
  init(receiveMessage: (message) => void) {
    this.electron.ipcRenderer.on('unitTest', (event, args) => {
      console.log('[localNode]receiveMessage', args);
      receiveMessage(this.formatResponseData(args));
    });
  }
  send(module, message) {
    console.log('[localNode]send message', message);
    this.electron.ipcRenderer.send(module, message);
  }
  close() {
    this.electron.ipcRenderer.removeAllListeners('unitTest');
  }
  /**
   * Format UI Request Data To Server Request Data
   *
   * @param input
   */
  formatRequestData(data, opts: requestDataOpts) {
    return eoFormatRequestData(data, opts, this.locale);
  }
  /**
   * Format TestResult to TestData
   *
   * @param report test result after test finish
   * @param history storage test history
   */
  formatResponseData(data) {
    return eoFormatResponseData(data);
  }
}
