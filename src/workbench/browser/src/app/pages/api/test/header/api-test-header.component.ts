import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiTestHeaders } from '../../../../shared/services/api-test/api-test-params.model';
import { ApiTestUtilService } from '../api-test-util.service';
@Component({
  selector: 'eo-api-test-header',
  templateUrl: './api-test-header.component.html',
  styleUrls: ['./api-test-header.component.scss'],
})
export class ApiTestHeaderComponent implements OnInit, OnChanges {
  @Input() model: object[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  listConf: object = {};
  private modelChange$: Subject<void> = new Subject();
  private destroy$: Subject<void> = new Subject();
  private itemStructure: ApiTestHeaders = {
    name: '',
    required: true,
    value: '',
  };
  constructor(private editService: ApiTestUtilService) {
    this.modelChange$.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {
      this.modelChange.emit(this.model);
    });
  }

  ngOnInit(): void {
    this.initListConf();
  }
  ngOnChanges(changes) {
    if (changes.model) {
      let currentVal = changes.model.currentValue;
      if (currentVal && (!currentVal.length || (currentVal.length && currentVal[currentVal.length - 1].name))) {
        this.model.push(Object.assign({}, this.itemStructure));
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private initListConf() {
    this.listConf = this.editService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_HEADER',
      itemStructure: this.itemStructure,
      title: $localize`:@@Header:Header`,
      nameTitle: $localize`Key`,
      valueTitle: $localize`Value`,
      watchFormLastChange: () => {
        this.modelChange$.next();
      },
    });
  }
}
