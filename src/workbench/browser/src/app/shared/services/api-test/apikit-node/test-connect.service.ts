import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { TestServer } from '../test-server.model';
import { eoFormatRequestData, eoFormatResponseData } from '../api-test.utils';
@Injectable()
export class TestServerAPIKitService implements TestServer {
  socket: WebSocket;
  constructor(@Inject(LOCALE_ID) private locale: string) {}
  init(receiveMessage: (message) => void) {
    this.socket = new WebSocket(`/nodeWebsocketServer/unit`);
    this.socket.onopen = () => {
      this.socket.send(
        '{"status":"init","lang":"cn","globals":{},"spaceKey":"eolinker","projectHashKey":"ccsIhPl17503a6b2326f09fbc4e3a7c03874c7333002038","module":0,"apiID":"5622482","markFrontUrl":"apiManagementPro","from":"default"}	'
      );
    };
    this.socket.onmessage = (inputEvt) => {
      receiveMessage(this.formatResponseData(JSON.parse(inputEvt.data)));
    };
  }
  send(module, message) {
    this.socket.send(
      JSON.stringify({
        status: message.action,
        ...message.data,
      })
    );
  }
  /**
   * Format UI Request Data To Server Request Data
   *
   * @param input
   */
  formatRequestData(data, opts = { env: {}, beforeScript: '', afterScript: '' }) {
    return eoFormatRequestData(data, opts, this.locale);
  }
  /**
   * Format TestResult to TestData
   *
   * @param report test result after test finish
   * @param history storage test history
   */
  formatResponseData({ report, history, id }) {
    ['general', 'requestInfo', 'resultInfo'].forEach((keyName) => {
      history[keyName] = JSON.parse(history[keyName]);
    });
    return eoFormatResponseData({
      history,
      report,
      id,
    });
  }
  close() {
    if (!this.socket) {return;}
    this.socket.close();
  }
}
