import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { ApiTestService } from 'eo/workbench/browser/src/app/pages/api/test/api-test.service';
import {  formatUri } from 'eo/workbench/browser/src/app/shared/services/api-test/api-test.utils';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { StorageService } from 'eo/workbench/browser/src/app/shared/services/storage/storage.service';
import { copyText } from 'eo/workbench/browser/src/app/utils';
import { tree2obj } from 'eo/workbench/browser/src/app/utils/tree/tree.utils';
import { ApiData, ApiMockEntity, StorageRes, StorageResStatus } from '../../../../shared/services/storage/index.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { messageService } from 'eo/workbench/browser/src/app/shared/services/message/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'eo/workbench/browser/src/app/shared/services/message';

@Component({
  selector: 'eo-api-detail-mock',
  templateUrl: './api-detail-mock.component.html',
  styleUrls: ['./api-detail-mock.component.scss'],
})
export class ApiDetailMockComponent implements OnInit, OnChanges {
  @Input() apiData: ApiData;
  get mockUrl() {
    return this.remoteService.mockUrl;
  }
  mocklList: ApiMockEntity[] = [];
  listConf: object = {};
  isVisible = false;
  createWayMap = {
    system: $localize`System creation`,
    custom: $localize`Manual creation`,
  };
  mockListColumns = [
    { title: $localize`Name`, key: 'name' },
    { title: $localize`Created Type`, slot: 'createWay' },
    { title: 'URL', slot: 'url' },
  ];
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private storageService: StorageService,
    private apiTest: ApiTestService,
    private remoteService: RemoteService,
    private message: NzMessageService
  ) {}

  async ngOnInit() {
    messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'mockAutoSyncSuccess':
            this.initMockList(this.apiData);
        }
      });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    const { apiData } = changes;
    if (apiData.currentValue !== apiData.previousValue) {
      this.initMockList(apiData.currentValue);
    }
  }

  async initMockList(apiData: ApiData) {
    if (apiData?.uuid) {
      const apiDataID = Number(this.apiData.uuid);
      console.log('apiDataID', this.apiData, apiDataID);
      const mockRes = await this.getMockByApiDataID(apiDataID);
      this.mocklList = mockRes.map((item) => {
        item.url = this.getApiUrl(item);
        return item;
      });
    }
  }

  getApiUrl(mock?: ApiMockEntity) {
    const uri = this.apiTest.transferUrlAndQuery(
      formatUri(this.apiData.uri, this.apiData.queryParams),
      this.apiData.queryParams,
      {
        base: 'query',
        replaceType: 'replace',
      }
    ).url;
    const url = new URL(`${this.mockUrl}/${uri}`.replace(/(?<!:)\/{2,}/g, '/'), 'https://github.com/');
    if (mock?.createWay === 'custom' && mock.uuid) {
      url.searchParams.set('mockID', mock.uuid + '');
    }
    return decodeURIComponent(url.toString());
  }
  /**
   * get mock list
   *
   * @param apiDataID
   * @returns
   */
  getMockByApiDataID(apiDataID: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storageService.run('apiMockLoadAllByApiDataID', [apiDataID], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        } else {
          reject(result);
        }
      });
    });
  }

  /**
   * create mock
   *
   * @param mock
   * @returns
   */
  createMock(mock): Promise<StorageRes> {
    return new Promise((resolve, reject) => {
      this.storageService.run('mockCreate', [mock], (res: StorageRes) => {
        if (res.status === StorageResStatus.success) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    });
  }

  /**
   * create mock object data
   *
   * @param options
   * @returns
   */
  createMockObj(options: Record<string, any> = {}) {
    const { name = '', createWay = 'custom', ...rest } = options;
    return {
      name,
      url: this.getApiUrl(),
      apiDataID: this.apiData.uuid,
      projectID: 1,
      createWay,
      response: JSON.stringify(tree2obj([].concat(this.apiData.responseBody))),
      ...rest,
    };
  }

  async copyText(text: string) {
    await copyText(text);
    this.message.success($localize`Copied`);
  }
}
