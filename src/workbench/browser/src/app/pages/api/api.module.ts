import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ApiRoutingModule } from './api-routing.module';
import { ApiEditModule } from './edit/api-edit.module';
import { ApiDetailModule } from './detail/api-detail.module';
import { ApiTestModule } from './test/api-test.module';
import { EnvModule } from '../../shared/components/env/env.module';
import { EouiModule } from '../../eoui/eoui.module';

import { ApiComponent } from './api.component';
import { ApiGroupEditComponent } from './group/edit/api-group-edit.component';
import { ExportApiComponent } from '../../shared/components/export-api/export-api.component';
import { SyncApiComponent } from '../../shared/components/sync-api/sync-api.component';

import { ImportApiComponent } from '../../shared/components/import-api/import-api.component';
import { ExtensionSelectComponent } from '../../shared/components/extension-select/extension-select.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { ApiGroupTreeComponent } from './group/tree/api-group-tree.component';
import { ApiTabComponent } from './tab/api-tab.component';
import { ApiService } from './api.service';
import { ElectronService } from '../../core/services';
import { ApiOverviewComponent } from './overview/api-overview.component';
import { HistoryComponent } from './history/eo-history.component';
import { ApiMockComponent } from './mock/api-mock.component';
import { IndexedDBStorage } from 'eo/workbench/browser/src/app/shared/services/storage/IndexedDB/lib/';
import { SharedModule } from 'eo/workbench/browser/src/app/shared/shared.module';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { ApiTabOperateService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-operate.service';

const COMPONENTS = [
  ApiComponent,
  ApiGroupEditComponent,
  ApiGroupTreeComponent,
  ExportApiComponent,
  SyncApiComponent,
  ApiTabComponent,
  ApiOverviewComponent,
  ImportApiComponent,
  ExtensionSelectComponent,
  ApiMockComponent,
  HistoryComponent,
];
@NgModule({
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ApiRoutingModule,
    ApiEditModule,
    ApiDetailModule,
    ApiTestModule,
    NzButtonModule,
    NzIconModule,
    NzTabsModule,
    NzLayoutModule,
    NzTreeModule,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzUploadModule,
    NzDropDownModule,
    NzDividerModule,
    NzToolTipModule,
    EouiModule,
    EnvModule,
    NzCardModule,
    NzModalModule,
    NzSelectModule,
    NzPopconfirmModule,
    SharedModule,
  ],
  declarations: [...COMPONENTS],
  exports: [],
  providers: [ElectronService, ApiService, ApiTabOperateService, ApiTabStorageService, IndexedDBStorage],
})
export class ApiModule {}
