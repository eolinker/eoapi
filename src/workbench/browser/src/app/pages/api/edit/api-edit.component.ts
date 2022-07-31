import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';

import { Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { MessageService } from '../../../shared/services/message';
import { StorageService } from '../../../shared/services/storage';

import {
  Group,
  ApiData,
  RequestProtocol,
  RequestMethod,
  ApiEditRest,
  StorageRes,
  StorageResStatus,
} from '../../../shared/services/storage/index.model';

import { objectToArray } from '../../../utils';
import { getRest } from '../../../utils/api';
import { listToTree, getExpandGroupByKey } from '../../../utils/tree/tree.utils';
import { ApiParamsNumPipe } from '../../../shared/pipes/api-param-num.pipe';
import { ApiEditService } from 'eo/workbench/browser/src/app/pages/api/edit/api-edit.service';
@Component({
  selector: 'eo-api-edit-edit',
  templateUrl: './api-edit.component.html',
  styleUrls: ['./api-edit.component.scss'],
})
export class ApiEditComponent implements OnInit, OnDestroy {
  @Input() apiData: ApiData;
  @Output() modelChange = new EventEmitter<ApiData>();
  @ViewChild('apiGroup') apiGroup: NzTreeSelectComponent;
  validateForm: FormGroup;
  groups: any[];
  expandKeys: string[];
  REQUEST_METHOD = objectToArray(RequestMethod);
  REQUEST_PROTOCOL = objectToArray(RequestProtocol);

  private destroy$: Subject<void> = new Subject<void>();
  private changeGroupID$: Subject<string | number> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private messageService: MessageService,
    private storage: StorageService,
    private apiEdit: ApiEditService
  ) {}
  getApiGroup() {
    this.groups = [];
    const treeItems: any = [
      {
        title: $localize`Root directory`,
        //!actually is 0,but 0 will hidden in nz component,so use -1 replace 0
        key: '-1',
        weight: 0,
        parentID: '0',
        isLeaf: false,
      },
    ];
    this.storage.run('groupLoadAllByProjectID', [1], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        [].concat(result.data).forEach((item: Group) => {
          delete item.updatedAt;
          treeItems.push({
            title: item.name,
            key: item.uuid.toString(),
            weight: item.weight || 0,
            parentID: (item.parentID || 0).toString(),
            isLeaf: false,
          });
        });
        treeItems.sort((a, b) => a.weight - b.weight);
      }
      listToTree(treeItems, this.groups, '0');
      this.resetGroupID();
    });
  }
  saveApi() {
    //manual set dirty in case user submit directly without edit
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    if (this.validateForm.status === 'INVALID') {
      return;
    }
    const formData: any = Object.assign({}, this.apiData, this.validateForm.value);
    this.editApi(formData);
  }
  bindGetApiParamNum(params) {
    return new ApiParamsNumPipe().transform(params);
  }
  ngOnInit(): void {
    this.getApiGroup();
    this.watchGroupIDChange();
    this.init();
    this.initBasicForm();
    this.watchUri();
  }
  async init() {
    if (!this.apiData) {
      this.apiData = {} as ApiData;
      const id = Number(this.route.snapshot.queryParams.uuid);
      this.apiData = await this.apiEdit.getApi({
        id,
        groupID: this.route.snapshot.queryParams.groupID || '-1',
      });
    }

    this.changeGroupID$.next(this.apiData.groupID);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private watchGroupIDChange() {
    this.changeGroupID$.pipe(debounceTime(500), take(1)).subscribe((id) => {
      this.apiData.groupID = (this.apiData.groupID === 0 ? -1 : this.apiData.groupID).toString();
      /**
       * Expand Select Group
       */
      this.expandKeys = getExpandGroupByKey(this.apiGroup, this.apiData.groupID.toString());
    });
  }
  private watchUri() {
    this.validateForm
      .get('uri')
      .valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((url) => {
        this.generateRestFromUrl(url);
      });
  }
  /**
   * Reset Group ID after group list load
   * Resolve the problem that groupID change but view not change
   */
  private resetGroupID() {
    let groupID: number | string = '-1';
    if (this.apiData && this.apiData.groupID) {
      groupID = this.apiData.groupID;
      this.apiData.groupID = '';
    }
    setTimeout(() => {
      this.apiData.groupID = groupID;
      this.changeGroupID$.next(groupID);
    }, 0);
  }
  /**
   * Init basic form,such as url,protocol,method
   */
  private initBasicForm() {
    const controls = {};
    ['protocol', 'method', 'uri', 'groupID', 'name'].forEach((name) => {
      controls[name] = [this.apiData[name], [Validators.required]];
    });
    this.validateForm = this.fb.group(controls);
  }
  /**
   * Generate Rest Param From Url
   */
  private generateRestFromUrl(url) {
    const rests = getRest(url);
    rests.forEach((newRest) => {
      if (this.apiData.restParams.find((val: ApiEditRest) => val.name === newRest)) {
        return;
      }
      const restItem: ApiEditRest = {
        name: newRest,
        required: true,
        example: '',
        description: '',
      };
      this.apiData.restParams.splice(this.apiData.restParams.length - 1, 0, restItem);
    });
  }
  private async editApi(formData) {
    const busEvent = formData.uuid ? 'editApi' : 'addApi';
    const title = busEvent === 'editApi' ? $localize`编辑成功` : $localize`新增成功`;
    const result: StorageRes = await this.apiEdit.editApi(formData);
    if (result.status === StorageResStatus.success) {
      this.message.success(title);
      this.messageService.send({ type: `${busEvent}Success`, data: result.data });
    } else {
      this.message.success('失败');
    }
  }
}
