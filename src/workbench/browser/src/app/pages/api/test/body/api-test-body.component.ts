import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

import { Observable, Observer, Subject } from 'rxjs';
import { pairwise, takeUntil, debounceTime } from 'rxjs/operators';

import {
  ApiTestParamsTypeFormData,
  ApiTestBody,
  ApiTestBodyType,
  ContentTypeByAbridge,
} from '../../../../shared/services/api-test/api-test.model';
import { ApiTestService } from '../api-test.service';
import { EoMessageService } from 'eo/workbench/browser/src/app/eoui/message/eo-message.service';
import { transferFileToDataUrl } from 'eo/workbench/browser/src/app/utils';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { EoMonacoEditorComponent } from 'eo/workbench/browser/src/app/shared/components/monaco-editor/monaco-editor.component';

@Component({
  selector: 'eo-api-test-body',
  templateUrl: './api-test-body.component.html',
  styleUrls: ['./api-test-body.component.scss'],
})
export class ApiTestBodyComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() model: string | object[] | any;
  @Input() supportType: string[];
  @Input() contentType: ContentTypeByAbridge;
  @Input() bodyType: ApiTestBodyType | string;
  @Output() bodyTypeChange: EventEmitter<any> = new EventEmitter();
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  @Output() contentTypeChange: EventEmitter<ContentTypeByAbridge> = new EventEmitter();
  @ViewChild(EoMonacoEditorComponent, { static: false }) eoMonacoEditor?: EoMonacoEditorComponent;
  isReload = true;
  listConf: any = {};
  binaryFiles: NzUploadFile[] = [];
  CONST: any = {};
  cache: any = {};
  private itemStructure: ApiTestBody = {
    required: true,
    name: '',
    type: 'string',
    value: '',
  };
  private resizeObserver: ResizeObserver;
  private readonly el: HTMLElement;
  private bodyType$: Subject<string> = new Subject<string>();
  private destroy$: Subject<void> = new Subject<void>();
  private rawChange$: Subject<string> = new Subject<string>();
  constructor(private apiTest: ApiTestService, elementRef: ElementRef, private message: EoMessageService) {
    this.el = elementRef.nativeElement;
    this.bodyType$.pipe(pairwise(), takeUntil(this.destroy$)).subscribe((val) => {
      this.beforeChangeBodyByType(val[0]);
    });
    this.initListConf();
    this.rawChange$.pipe(debounceTime(700), takeUntil(this.destroy$)).subscribe(() => {
      this.modelChange.emit(this.model);
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.eoMonacoEditor?.rerenderEditor();
    });
    this.resizeObserver.observe(this.el);
  }
  beforeChangeBodyByType(type) {
    switch (type) {
      case ApiTestBodyType.Binary:
      case ApiTestBodyType.Raw: {
        this.cache[type] = this.model;
        break;
      }
      default: {
        this.cache[type] = [...this.model];
        break;
      }
    }
  }
  changeContentType(contentType) {
    this.contentTypeChange.emit(contentType);
  }
  changeBodyType(type?) {
    this.bodyType$.next(this.bodyType);
    this.bodyTypeChange.emit(this.bodyType);
    this.setListConf();
    this.setModel();
    if (type === 'init') {
      return;
    }
    this.modelChange.emit(this.model);
  }

  ngOnInit(): void {
    this.CONST.API_BODY_TYPE = Object.keys(ApiTestBodyType)
      .filter((val) => this.supportType.includes(ApiTestBodyType[val]))
      .map((val) => ({ key: val, value: ApiTestBodyType[val] }));
    this.CONST.CONTENT_TYPE = Object.keys(ContentTypeByAbridge).map((name) => ({
      name,
      value: ContentTypeByAbridge[name],
    }));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.resizeObserver.disconnect();
  }
  ngOnChanges(changes) {
    if (
      changes.model &&
      ((!changes.model.previousValue && changes.model.currentValue) || changes.model.currentValue?.length === 0)
    ) {
      this.beforeChangeBodyByType(this.bodyType);
      this.changeBodyType('init');
    }
  }
  uploadBinary = (file) =>
    new Observable((observer: Observer<boolean>) => {
      transferFileToDataUrl(file).then((result: { name: string; content: string }) => {
        this.model = {
          name: file.name,
          dataUrl: result.content,
        };
        this.binaryFiles = [
          {
            uid: '1',
            name: file.name,
            status: 'done',
          },
        ];
        this.modelChange.emit(this.model);
      });
      observer.complete();
    });
  handleParamsImport(data) {
    this.model = data;
    this.modelChange.emit(data);
  }

  rawDataChange() {
    this.rawChange$.next(this.model);
  }
  /**
   * Set model after change bodyType
   *
   * Add last row| RestoreData From cache
   */
  private setModel() {
    switch (this.bodyType) {
      case ApiTestBodyType.Binary:
      case ApiTestBodyType.Raw: {
        this.model = this.cache[this.bodyType] || '';
        break;
      }
      default: {
        this.model = this.cache[this.bodyType] || [];
        break;
      }
    }
    if (['formData'].includes(this.bodyType)) {
      if (!this.model.length || this.model[this.model.length - 1].name) {
        this.model.push(Object.assign({ listDepth: 0 }, this.itemStructure));
      }
    }
  }
  private setListConf() {
    // reset table config
    this.listConf.setting = Object.assign({}, this.cache.listConfSetting);
    const typeIndex = this.listConf.tdList.findIndex((val) => val.mark === 'type');
    let TYPE_CONST: any = [];
    switch (this.bodyType) {
      case ApiTestBodyType['Form-data']: {
        TYPE_CONST = ApiTestParamsTypeFormData;
        this.listConf.setting.isLevel = false;
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
        if (inputArg.file.length === 0) {
          return;
        }
        inputArg.item.value = '';
        inputArg.item.files = [];
        for (const file of inputArg.file) {
          if (file.size > 2 * 1024 * 1024) {
            inputArg.item.value = '';
            this.message.error($localize`File size must be less than 2M`);
            return;
          }
        }
        for (const file of inputArg.file) {
          inputArg.item.value = file.name + ',' + inputArg.item.value;
          transferFileToDataUrl(file).then((result: { name: string; content: string }) => {
            inputArg.item.files.splice(0, 0, {
              name: file.name,
              dataUrl: result.content,
            });
          });
        }
        inputArg.item.value = inputArg.item.value.slice(0, inputArg.item.value.length - 1);
        this.modelChange.emit(this.model);
      },
    });
    this.cache.listConfSetting = Object.assign({}, this.listConf.setting);
  }
}
