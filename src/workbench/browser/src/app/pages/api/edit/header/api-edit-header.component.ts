import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked, OnChanges } from '@angular/core';
import { ApiEditHeaders } from '../../../../shared/services/storage/index.model';
import { ApiEditUtilService } from '../api-edit-util.service';
@Component({
  selector: 'eo-api-edit-header',
  templateUrl: './api-edit-header.component.html',
  styleUrls: ['./api-edit-header.component.scss'],
})
export class ApiEditHeaderComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() model: ApiEditHeaders[];
  listConf: object = {};
  private itemStructure: ApiEditHeaders = {
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
      dragCacheVar: 'DRAG_VAR_API_EDIT_HEADER',
      itemStructure: this.itemStructure,
      title: $localize`:@@Header:Header`,
      nameTitle: $localize`Key`,
      nzOnOkMoreSetting: (inputArg) => {
        this.model[inputArg.$index] = inputArg.item;
      },
    });
  }
}
