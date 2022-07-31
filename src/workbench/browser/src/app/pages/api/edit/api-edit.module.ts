import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Ng1Module } from '../../../ng1/ng1.module';
import { EouiModule } from '../../../eoui/eoui.module';
import { SharedModule } from '../../../shared/shared.module';
import { ParamsImportModule } from '../../../shared/components/params-import/params-import.module';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { ApiEditComponent } from './api-edit.component';
import { ApiEditHeaderComponent } from './header/api-edit-header.component';
import { ApiEditBodyComponent } from './body/api-edit-body.component';
import { ApiEditQueryComponent } from './query/api-edit-query.component';
import { ApiEditRestComponent } from './rest/api-edit-rest.component';
import { ApiParamsExtraSettingComponent } from './extra-setting/api-params-extra-setting.component';

import { ApiEditUtilService } from './api-edit-util.service';
import { ApiEditService } from 'eo/workbench/browser/src/app/pages/api/edit/api-edit.service';

const NZ_COMPONETS = [
  NzDropDownModule,
  NzModalModule,
  NzInputModule,
  NzButtonModule,
  NzFormModule,
  NzSelectModule,
  NzTreeSelectModule,
  NzCollapseModule,
  NzIconModule,
  NzTabsModule,
  NzRadioModule,
  NzDividerModule,
  NzAffixModule,
  NzPopconfirmModule,
];
const COMPONENTS = [
  ApiEditComponent,
  ApiEditHeaderComponent,
  ApiEditBodyComponent,
  ApiEditQueryComponent,
  ApiEditRestComponent,
  ApiParamsExtraSettingComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Ng1Module,
    CommonModule,
    ...NZ_COMPONETS,
    EouiModule,
    SharedModule,
    ParamsImportModule,
  ],
  providers: [ApiEditUtilService,ApiEditService],
})
export class ApiEditModule {}
