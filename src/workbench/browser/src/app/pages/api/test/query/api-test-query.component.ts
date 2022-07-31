import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ApiTestQuery } from '../../../../shared/services/api-test/api-test.model';
import { ApiTestService } from '../api-test.service';

@Component({
  selector: 'eo-api-test-query',
  templateUrl: './api-test-query.component.html',
  styleUrls: ['./api-test-query.component.scss'],
})
export class ApiTestQueryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() model: object[];
  @Output() modelChange: EventEmitter<any> = new EventEmitter();

  listConf: object = {};
  private itemStructure: ApiTestQuery = {
    name: '',
    required: true,
    value: '',
  };

  private modelChange$: Subject<void> = new Subject();
  private destroy$: Subject<void> = new Subject();

  constructor(private editService: ApiTestService) {
    this.modelChange$.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {
      this.modelChange.emit(this.model);
    });
  }

  ngOnInit(): void {
    this.initListConf();
  }
  ngOnChanges(changes) {
    if (changes.model) {
      const currentVal = changes.model.currentValue;
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
      dragCacheVar: 'DRAG_VAR_API_QUERY',
      itemStructure: this.itemStructure,
      watchFormLastChange: () => {
        this.modelChange$.next();
      },
    });
  }
}
