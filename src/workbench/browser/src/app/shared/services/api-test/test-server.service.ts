import { Injectable } from '@angular/core';
import { TestServerLocalNodeService } from './local-node/test-connect.service';
import { TestServerServerlessService } from './serverless-node/test-connect.service';
import { ElectronService } from '../../../core/services';
import { TestServerRemoteService } from 'eo/workbench/browser/src/app/shared/services/api-test/remote-node/test-connect.service';
@Injectable()
export class TestServerService {
  isElectron = true;
  constructor(
    private electron: ElectronService,
    private remoteNode: TestServerRemoteService,
    private localNode: TestServerLocalNodeService,
    private serverlessNode: TestServerServerlessService
  ) {
    this.isElectron = this.electron.isElectron;
  }
  get instance() {
    const isVercel = window.location.href.includes('vercel')||window.location.host==='demo.eoapi.io';
    if (this.isElectron) {
      return this.localNode;
    } else if (!isVercel) {
      return this.remoteNode;
    } else {
      return this.serverlessNode;
    }
  }
}
