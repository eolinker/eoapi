import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';

import {
  RequestMethod,
  RequestProtocol,
  StorageRes,
  StorageResStatus,
} from '../../../shared/services/storage/index.model';
import { MessageService } from '../../../shared/services/message';

import { interval, Subscription, Observable, of, Subject } from 'rxjs';
import { take, takeUntil, distinctUntilChanged, pairwise, filter } from 'rxjs/operators';

import { ApiTestHistoryComponent } from './history/api-test-history.component';

import { TestServerService } from '../../../shared/services/api-test/test-server.service';
import { ApiTestUtilService } from './api-test-util.service';
import { ApiTabStorageService } from '../tab/api-tab-storage.service';
import { objectToArray } from '../../../utils';

import { EnvState } from '../../../shared/store/env.state';
import { ApiParamsNumPipe } from '../../../shared/pipes/api-param-num.pipe';
import { StorageService } from '../../../shared/services/storage';
import { TestServerLocalNodeService } from '../../../shared/services/api-test/local-node/test-connect.service';
import { TestServerServerlessService } from '../../../shared/services/api-test/serverless-node/test-connect.service';
import { TestServerRemoteService } from 'eo/workbench/browser/src/app/shared/services/api-test/remote-node/test-connect.service';
import { ApiTestRes } from 'eo/workbench/browser/src/app/shared/services/api-test/test-server.model';
import {
  BEFORE_DATA,
  AFTER_DATA,
  beforeScriptCompletions,
  afterScriptCompletions,
} from 'eo/workbench/browser/src/app/shared/components/api-script/constant';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'eo-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent implements OnInit, OnDestroy {
  @ViewChild('historyComponent') historyComponent: ApiTestHistoryComponent;
  @Select(EnvState) env$: Observable<any>;
  validateForm!: FormGroup;
  apiData: any;
  env: any = {
    parameters: [],
    hostUri: '',
  };
  BEFORE_DATA = BEFORE_DATA;
  AFTER_DATA = AFTER_DATA;
  beforeScriptCompletions = beforeScriptCompletions;
  afterScriptCompletions = afterScriptCompletions;
  beforeScript = '';
  afterScript = '';
  nzSelectedIndex = 1;
  status: 'start' | 'testing' | 'tested' = 'start';
  waitSeconds = 0;
  tabIndexRes = 0;
  testResult: any = {
    response: {},
    request: {},
  };
  scriptCache = {};
  testServer: TestServerLocalNodeService | TestServerServerlessService | TestServerRemoteService;
  REQUEST_METHOD = objectToArray(RequestMethod);
  REQUEST_PROTOCOL = objectToArray(RequestProtocol);

  private status$: Subject<string> = new Subject<string>();
  private timer$: Subscription;
  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    // private scroller: ViewportScroller,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private apiTest: ApiTestUtilService,
    private apiTab: ApiTabStorageService,
    private testServerService: TestServerService,
    private messageService: MessageService,
    private storage: StorageService,
    private lang: LanguageService
  ) {
    this.testServer = this.testServerService.instance;
    this.testServer.init((message) => {
      this.receiveMessage(message);
    });
    this.status$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((status) => {
      this.changeStatus(status);
    });
  }
  clickTest() {
    if (this.status === 'testing') {
      this.abort();
      return;
    }
    this.test();
  }
  /**
   * click history to restore data from history
   * @param item  test history data
   */
  restoreHistory(item) {
    const result = this.apiTest.getTestDataFromHistory(item);
    console.log('restoreHistory', result);
    //restore request
    this.apiData = result.testData;
    this.setScriptsByHistory(result.response);
    this.changeUri();
    //restore response
    this.tabIndexRes = 0;
    this.testResult = result.response;
  }
  getApi(id) {
    this.storage.run('apiDataLoad', [id], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.apiData = this.apiTest.getTestDataFromApi(result.data);
        this.validateForm.patchValue(this.apiData);
      }
    });
  }
  setScriptsByHistory(response) {
    this.beforeScript = response?.beforeScript || '';
    this.afterScript = response?.afterScript || '';
  }
  loadTestHistory(id) {
    if (!id) {
      this.beforeScript = '';
      this.afterScript = '';
      return;
    }
    this.storage.run('apiTestHistoryLoadAllByApiDataID', [id], (result: StorageRes) => {
      let history = {} as any;
      if (result.status === StorageResStatus.success) {
        history = result.data.reduce((prev, curr) => (prev.updatedAt > curr.updatedAt ? prev : curr), {});
      }
      this.beforeScript = history.beforeScript || '';
      this.afterScript = history.afterScript || '';
    });
  }
  saveTestDataToApi() {
    const apiData = this.apiTest.getApiFromTestData({
      history: this.testResult,
      testData: this.apiData,
    });
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    this.messageService.send({ type: 'addApiFromTest', data: apiData });
  }
  changeQuery(queryParams) {
    this.apiData.uri = this.apiTest.transferUrlAndQuery(this.apiData.uri, queryParams, {
      base: 'query',
      replaceType: 'replace',
    }).url;
  }
  changeUri() {
    this.apiData.queryParams = this.apiTest.transferUrlAndQuery(this.apiData.uri, this.apiData.queryParams, {
      base: 'url',
      replaceType: 'replace',
    }).query;
  }
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  ngOnInit(): void {
    const apiDataId = Number(this.route.snapshot.queryParams.uuid);
    this.initApi(apiDataId);
    this.watchEnvChange();
    this.messageService.get().subscribe(({ type, data }) => {
      if (type === 'renderHistory') {
        this.restoreHistory(data);
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.testServer.close();
  }
  private test() {
    this.scriptCache = {
      beforeScript: this.beforeScript,
      afterScript: this.afterScript,
    };
    this.testServer.send('unitTest', {
      // id: this.apiTab.tabID,
      action: 'ajax',
      data: this.testServer.formatRequestData(this.apiData, {
        env: this.env,
        globals: this.apiTest.getGlobals(),
        beforeScript: this.beforeScript,
        afterScript: this.afterScript,
        lang: this.lang.systemLanguage === 'zh-Hans' ? 'cn' : 'en',
      }),
    });
    this.status$.next('testing');
  }
  private abort() {
    this.testServer.send('unitTest', {
      // id: this.apiTab.tabID,
      action: 'abort',
    });
    this.status$.next('tested');
  }
  private addHistory(message, id) {
    //Only has statusCode need save report
    if (message.response.statusCode) {
      this.historyComponent.add(
        {
          general: message.general,
          request: message.history.request,
          response: message.response,
          ...this.scriptCache,
        },
        id
      );
      this.messageService.send({ type: 'updateHistory', data: {} });
    }
  }
  /**
   * Receive Test Server Message
   */
  private receiveMessage(message: ApiTestRes) {
    console.log('[api test componnet]receiveMessage', message);
    const tmpHistory = {
      general: message.general,
      request: message.report?.request,
      response: message.response,
    };
    this.testResult = tmpHistory;
    // this.scroller.scrollToAnchor("test-response")
    this.status$.next('tested');
    if (message.status === 'error') return;

    //set globals
    this.apiTest.setGlobals(message.globals);

    //If test sucess,addHistory
    // other tab test finish,support multiple tab test same time
    // if (message.id && this.apiTab.tabID !== message.id) {
    //   this.apiTab.storage[message.id].testResult = tmpHistory;
    //   const tab = this.apiTab.tabs.find((val) => val.uuid === message.id);
    //   if (tab) {
    //     this.addHistory(message, tab.key);
    //   }
    //   return;
    // }
    this.addHistory(message, this.apiData.uuid);
  }
  /**
   * Change test status
   * @param status - 'start'|'testing'|'tested'
   */
  private changeStatus(status) {
    this.status = status;
    const that = this;
    switch (status) {
      case 'testing': {
        this.timer$ = interval(1000)
          .pipe(take(60))
          .subscribe({
            next(val) {
              console.log('next');
              that.waitSeconds = val + 1;
            },
            complete() {
              that.changeStatus('tested');
            },
          });
        break;
      }
      case 'tested': {
        this.timer$.unsubscribe();
        this.waitSeconds = 0;
        this.tabIndexRes = 0;
        this.ref.detectChanges();
        break;
      }
    }
  }
  private initApi(id) {
    this.resetForm();
    this.initBasicForm();
    // //recovery from tab
    // if (this.apiTab.currentTab && this.apiTab.tabCache[this.apiTab.tabID]) {
    //   const tabData = this.apiTab.tabCache[this.apiTab.tabID];
    //   this.apiData = tabData.apiData;
    //   this.testResult = tabData.testResult;
    //   this.validateForm.patchValue(this.apiData);
    //   this.setScriptsByHistory(tabData.testResult);
    //   return;
    // }
    if (!id) {
      Object.assign(this.apiData, {
        uuid: 0,
        requestBodyType: 'json',
        requestBodyJsonType: 'object',
        requestBody: [],
        queryParams: [],
        restParams: [],
        requestHeaders: [],
      });
    } else {
      this.getApi(id);
    }
  }
  private watchEnvChange() {
    this.env$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      const { env } = data;
      if (env) {
        this.env = env;
      }
    });
  }
  /**
   * Init API data structure
   */
  private resetForm() {
    this.apiData = {
      projectID: 1,
      uri: '',
      protocol: RequestProtocol.HTTP,
      method: RequestMethod.POST,
    };

    this.testResult = {
      response: {},
      request: {},
    };
    this.status$.next('start');
    if (this.timer$) {
      this.timer$.unsubscribe();
    }
    this.waitSeconds = 0;
    this.tabIndexRes = 0;
  }
  /**
   * Init basic form,such as url,protocol,method
   */
  private initBasicForm() {
    const controls = {};
    ['protocol', 'method', 'uri'].forEach((name) => {
      controls[name] = [this.apiData[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
}
