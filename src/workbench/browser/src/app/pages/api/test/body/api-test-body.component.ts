import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';
import { pairwise, takeUntil, debounceTime } from 'rxjs/operators';

import {
  ApiTestParamsTypeFormData,
  ApiTestParamsTypeJsonOrXml,
  ApiTestBody,
} from '../../../../shared/services/api-test/api-test-params.model';
import { ApiBodyType, JsonRootType } from '../../../../shared/services/storage/index.model';
import { ApiTestUtilService } from '../api-test-util.service';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';

@Component({
  selector: 'eo-api-test-body',
  templateUrl: './api-test-body.component.html',
  styleUrls: ['./api-test-body.component.scss'],
})
export class ApiTestBodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() model: string | object[] | any;
  @Input() supportType: string[];
  @Input() bodyType: ApiBodyType | string;
  @Input() jsonRootType: JsonRootType | string;
  @Output() jsonRootTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() bodyTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  isReload = true;
  listConf: any = {};
  cache: object = {};
  CONST: any = {
    JSON_ROOT_TYPE: Object.keys(JsonRootType).map((val) => ({ key: val, value: JsonRootType[val] })),
  };
  private itemStructure: ApiTestBody = {
    required: true,
    name: '',
    type: 'string',
    value: '',
  };
  private bodyType$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  constructor(
    private apiTest: ApiTestUtilService,
    private cdRef: ChangeDetectorRef,
    private message: EoMessageService
  ) {
    this.bodyType$.pipe(pairwise(), takeUntil(this.destroy$)).subscribe((val) => {
      this.beforeChangeBodyByType(val[0]);
    });
    this.initListConf();
    this.rawChange$.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(() => {
      this.modelChange.emit(this.model);
    });
  }
  beforeChangeBodyByType(type) {
    switch (type) {
      case ApiBodyType.Raw: {
        // case ApiBodyType.Binary:
        this.cache[type] = this.model;
        break;
      }
      default: {
        this.cache[type] = [...this.model];
        break;
      }
    }
  }
  changeBodyType(type?) {
    this.bodyType$.next(this.bodyType);
    this.bodyTypeChange.emit(this.bodyType);
    this.setListConf();
    this.setModel();
    if (type === 'init') return;
    this.modelChange.emit(this.model);
  }

  ngOnInit(): void {
    this.CONST.API_BODY_TYPE = Object.keys(ApiBodyType)
      .filter((val) => this.supportType.includes(ApiBodyType[val]))
      .map((val) => ({ key: val, value: ApiBodyType[val] }));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnChanges(changes) {
    if (
      (changes.model && !changes.model.previousValue && changes.model.currentValue) ||
      changes.model.currentValue?.length === 0
    ) {
      this.beforeChangeBodyByType(this.bodyType);
      this.changeBodyType('init');
    }
  }

  handleParamsImport(data) {
    this.model = data;
    this.modelChange.emit(data);
  }

  beforeHandleImport(result) {
    this.jsonRootType = Array.isArray(result) ? 'array' : 'object';
  }

  rawDataChange() {
    this.rawChange$.next(this.model);
  }
  /**
   * Set model after change bodyType
   *
   * Add last row| RestoreData From cache| XML first row type must be object
   */
  private setModel() {
    switch (this.bodyType) {
      case ApiBodyType.Raw: {
        // case ApiBodyType.Binary:
        this.model = this.cache[this.bodyType] || '';
        break;
      }
      default: {
        this.model = this.cache[this.bodyType] || [];
        break;
      }
    }
    if (['formData', 'json'].includes(this.bodyType)) {
      if (!this.model.length || this.model[this.model.length - 1].name) {
        this.model.push(Object.assign({ listDepth: 0 }, this.itemStructure));
      }
    }
    if (this.bodyType === 'xml') {
      if (!this.model.length) {
        this.model.push(Object.assign({ listDepth: 0 }, this.itemStructure));
      }
      this.model[0].type = 'object';
    }
  }
  private setListConf() {
    // reset table config
    this.listConf.setting = Object.assign({}, this.cache['listConfSetting']);
    const typeIndex = this.listConf.tdList.findIndex((val) => val.mark === 'type');
    let TYPE_CONST: any = [];
    switch (this.bodyType) {
      case ApiBodyType['Form-data']: {
        TYPE_CONST = ApiTestParamsTypeFormData;
        this.listConf.setting.isLevel = false;
        break;
      }
      case ApiBodyType.JSON: {
        TYPE_CONST = ApiTestParamsTypeJsonOrXml;
        this.listConf.setting.isLevel = true;
        break;
      }
      case ApiBodyType.XML: {
        TYPE_CONST = ApiTestParamsTypeJsonOrXml;
        this.listConf.setting.isLevel = true;
        this.listConf.setting.unSortIndex = 0;
        this.listConf.setting.munalHideOperateColumn = true;
        this.listConf.setting.isStaticFirstIndex = 0;
        break;
      }
    }
    this.listConf.tdList[typeIndex].selectQuery = Object.keys(TYPE_CONST).map((val) => ({
      key: val,
      value: TYPE_CONST[val],
    }));
  }
  private initListConf() {
    this.listConf = this.apiTest.initBodyListConf({
      title: $localize`Param`,
      itemStructure: this.itemStructure,
      watchFormLastChange: () => {
        this.modelChange.emit(this.model);
      },
      importFile: (inputArg) => {
        if (inputArg.file.length === 0) return;
        inputArg.item.value = '';
        inputArg.item.files = [];
        for (var i = 0; i < inputArg.file.length; i++) {
          var val = inputArg.file[i];
          if (val.size > 2 * 1024 * 1024) {
            inputArg.item.value = '';
            this.message.error($localize`File size must be less than 2M`);
            return;
          }
        }
        for (var i = 0; i < inputArg.file.length; i++) {
          var val = inputArg.file[i];
          inputArg.item.value = val.name + ',' + inputArg.item.value;
          let tmpReader = new FileReader();
          tmpReader.readAsDataURL(val);
          tmpReader.onload = function (_default) {
            inputArg.item.files.splice(0, 0, {
              name: val.name,
              dataUrl: this.result,
            });
          };
        }
        inputArg.item.value = inputArg.item.value.slice(0, inputArg.item.value.length - 1);
        this.modelChange.emit(this.model);
      },
    });
    this.cache['listConfSetting'] = Object.assign({}, this.listConf.setting);
  }
}
