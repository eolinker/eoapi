import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked, OnChanges } from '@angular/core';
import { ApiEditQuery } from '../../../../shared/services/storage/index.model';
import { ApiEditUtilService } from '../api-edit-util.service';

@Component({
  selector: 'eo-api-edit-query',
  templateUrl: './api-edit-query.component.html',
  styleUrls: ['./api-edit-query.component.scss'],
})
export class ApiEditQueryComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() model: object[];
  listConf: object = {};
  private itemStructure: ApiEditQuery = {
    name: '',
    required: true,
    example: '',
    description: '',
  };
  constructor(private editService: ApiEditUtilService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initListConf();
  }
  ngAfterViewChecked() {
    // prevent AngularJS error when dragging and sorting item
    this.cdRef.detectChanges();
  }
  ngOnChanges(changes) {
    if (changes.model && !changes.model.previousValue && changes.model.currentValue) {
      this.model.push(Object.assign({}, this.itemStructure));
    }
  }
  private initListConf() {
    this.listConf = this.editService.initListConf({
      dragCacheVar: 'DRAG_VAR_API_EDIT_QUERY',
      itemStructure: this.itemStructure,
      nzOnOkMoreSetting: (inputArg) => {
        this.model[inputArg.$index] = inputArg.item;
      },
    });
  }
}
