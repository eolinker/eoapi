import { Component, OnInit, Inject, LOCALE_ID, EventEmitter, Input, Output } from '@angular/core';
import { formatDate } from '@angular/common';
import { ApiTestUtilService } from '../api-test-util.service';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { StorageService } from '../../../../shared/services/storage';
import {
  ApiTestHistory,
  ApiTestHistoryFrame,
  StorageRes,
  StorageResStatus,
} from '../../../../shared/services/storage/index.model';

@Component({
  selector: 'eo-api-test-history',
  templateUrl: './api-test-history.component.html',
  styleUrls: ['./api-test-history.component.scss'],
})
export class ApiTestHistoryComponent implements OnInit {
  listConf = {};
  model: ApiTestHistory[] | object[];
  @Input() apiID: number;
  @Output() clickItem: EventEmitter<any> = new EventEmitter();
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private message: EoMessageService,
    private apiTest: ApiTestUtilService,
    private storage: StorageService
  ) {
    this.initListConf();
  }

  add(history: ApiTestHistoryFrame, apiID) {
    this.storage.run(
      'apiTestHistoryCreate',
      [
        {
          projectID: 1,
          apiDataID: apiID,
          ...history,
        },
      ],
      (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          this.parseItem(result.data);
          this.model = this.model || [];
          this.model.unshift(result.data);
        } else {
          console.error(result.data);
        }
      }
    );
  }

  deleteAll() {
    this.storage.run('apiTestHistoryBulkRemove', [this.model.map((val) => val.uuid)], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.model = [];
        this.message.success($localize`Delete Succeeded`);
      } else {
        this.message.error($localize`Failed to delete`);
        console.error(result.data);
      }
    });
  }

  ngOnChanges(changes) {
    if (changes && changes.apiID && changes.apiID.currentValue !== undefined) {
      this.getList();
    }
  }

  ngOnInit(): void {}
  private initListConf() {
    this.listConf = {
      setting: {
        munalHideOperateColumn: true,
        trClass: 'cp',
      },
      baseFun: {
        trClick: (inArg) => {
          this.clickItem.emit(inArg.item);
        },
      },
      tdList: [
        {
          thKey: $localize`Test Time`,
          type: 'text',
          modelKey: 'testTime',
          class: 'pl20 w_180',
        },
        {
          thKey: $localize`URL`,
          type: 'html',
          html: '<span class="method_text_{{item.request.method}} method_label mr5">{{item.request.method}}</span>{{item.request.uri}}',
        },
        {
          thKey: $localize`Status Code`,
          type: 'html',
          class: 'w_100',
          html: `<span class="{{item.codeClass}}">{{item.response.statusCode}}</span>`,
        },
        {
          thKey: $localize`Request Time(ms)`,
          type: 'html',
          html: '{{item.response.testDeny}}',
          class: 'w_120',
        },
        {
          type: 'btn',
          class: 'w_100',
          btnList: [
            {
              key: $localize`:@@Delete:Delete`,
              operateName: 'delete',
              fun: (inArg) => {
                this.delete(inArg);
              },
            },
          ],
        },
      ],
    };
  }

  private delete(inArg) {
    this.storage.run('apiTestHistoryRemove', [inArg.item.uuid], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.model.splice(inArg.$index, 1);
        this.message.success($localize`Delete Succeeded`);
      } else {
        this.message.success($localize`Failed to delete`);
        console.error(result.data);
      }
    });
  }

  private getList() {
    this.storage.run('apiTestHistoryLoadAllByApiDataID', [this.apiID], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        [].concat(result.data).forEach((val: any) => {
          this.parseItem(val);
        });
        this.model = result.data || [];
      } else {
        console.error(result.data);
      }
    });
  }

  private parseItem(item) {
    item.codeClass = this.apiTest.getHTTPStatus(item.response.statusCode).fontClass;
    item.testTime = item.createdAt ? formatDate(item.createdAt, 'YYYY-MM-dd HH:mm:ss', this.locale) : null;
  }
}
