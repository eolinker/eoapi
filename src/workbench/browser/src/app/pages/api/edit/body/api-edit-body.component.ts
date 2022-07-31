import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { pairwise, takeUntil, debounceTime } from 'rxjs/operators';
import {
  ApiParamsTypeFormData,
  ApiParamsTypeJsonOrXml,
  ApiEditBody,
  ApiBodyType,
  JsonRootType,
} from '../../../../shared/services/storage/index.model';
import { ApiEditUtilService } from '../api-edit-util.service';
@Component({
  selector: 'eo-api-edit-body',
  templateUrl: './api-edit-body.component.html',
  styleUrls: ['./api-edit-body.component.scss'],
})
export class ApiEditBodyComponent implements OnInit, OnChanges, OnDestroy {
  @Input() model: string | object[] | any;
  @Input() supportType: string[];
  @Input() bodyType: ApiBodyType | string;
  @Input() jsonRootType: JsonRootType | string;
  @Output() jsonRootTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() bodyTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  listConf: any = {};
  cache: object = {};
  CONST: any = {
    JSON_ROOT_TYPE: Object.keys(JsonRootType).map((val) => ({ key: val, value: JsonRootType[val] })),
  };
  private itemStructure: ApiEditBody = {
    name: '',
    type: 'string',
    required: true,
    example: '',
    enum: [],
    description: '',
  };
  private bodyType$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  constructor(private apiEdit: ApiEditUtilService, private cdRef: ChangeDetectorRef) {
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
        if (typeof this.model !== 'string') return;
        this.cache[type] = this.model || '';
        break;
      }
      default: {
        this.cache[type] = [...this.model];
        break;
      }
    }
  }
  rawDataChange() {
    this.rawChange$.next(this.model);
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

  beforeHandleImport(result) {
    this.jsonRootType = Array.isArray(result) ? 'array' : 'object';
  }

  handleParamsImport(data) {
    this.model = data;
    this.modelChange.emit(data);
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
        TYPE_CONST = ApiParamsTypeFormData;
        this.listConf.setting.isLevel = false;
        break;
      }
      case ApiBodyType.JSON: {
        TYPE_CONST = ApiParamsTypeJsonOrXml;
        this.listConf.setting.isLevel = true;
        break;
      }
      case ApiBodyType.XML: {
        TYPE_CONST = ApiParamsTypeJsonOrXml;
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
    this.listConf = this.apiEdit.initBodyListConf({
      title: '参数',
      itemStructure: this.itemStructure,
      nzOnOkMoreSetting: (result) => {
        this.model[result.$index] = result.item;
        this.modelChange.emit(this.model);
      },
      watchFormLastChange: () => {
        this.modelChange.emit(this.model);
      },
    });
    this.cache['listConfSetting'] = Object.assign({}, this.listConf.setting);
  }
}
