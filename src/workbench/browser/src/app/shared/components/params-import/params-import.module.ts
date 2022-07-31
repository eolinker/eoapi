import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ParamsImportComponent } from './params-import.component';

import { EouiModule } from '../../../eoui/eoui.module';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { EoIconparkIconModule } from 'eo/workbench/browser/src/app/eoui/iconpark-icon/eo-iconpark-icon.module';

@NgModule({
  declarations: [ParamsImportComponent],
  imports: [FormsModule, EoIconparkIconModule, NzDropDownModule, NzModalModule, NzButtonModule, EouiModule],
  exports: [ParamsImportComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ParamsImportModule {}
