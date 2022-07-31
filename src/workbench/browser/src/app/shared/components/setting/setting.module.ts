import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';

import { ElectronService } from '../../../core/services';
import { SelectThemeComponent } from 'eo/workbench/browser/src/app/shared/components/toolbar/select-theme/select-theme.component';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import {
  DataStorageComponent,
  LanguageSwticherComponent,
  AboutComponent,
  ExtensionSettingComponent,
} from 'eo/workbench/browser/src/app/shared/components/setting/common';

const ANTDMODULES = [
  NzModalModule,
  NzButtonModule,
  NzIconModule,
  NzListModule,
  NzInputModule,
  NzFormModule,
  NzSelectModule,
  NzDividerModule,
  NzTabsModule,
  NzTreeViewModule,
  NzCheckboxModule,
  NzInputNumberModule,
  NzEmptyModule,
  NzDropDownModule,
  NzPopoverModule,
  NzRadioModule,
  NzDescriptionsModule,
];
@NgModule({
  declarations: [
    SettingComponent,
    SelectThemeComponent,
    DataStorageComponent,
    LanguageSwticherComponent,
    AboutComponent,
    ExtensionSettingComponent,
  ],
  imports: [FormsModule, ReactiveFormsModule, SharedModule, CommonModule, ...ANTDMODULES],
  exports: [SettingComponent, SelectThemeComponent],
  providers: [ElectronService],
})
export class SettingModule {}
