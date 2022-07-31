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
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzAlertModule } from 'ng-zorro-antd/alert';


import { ByteToStringPipe } from './result-response/get-size.pipe';

import { TestServerService } from '../../../shared/services/api-test/test-server.service';
import { ApiTestService } from './api-test.service';
import { TestServerLocalNodeService } from '../../../shared/services/api-test/local-node/test-connect.service';
import { TestServerServerlessService } from '../../../shared/services/api-test/serverless-node/test-connect.service';

import { ApiTestComponent } from './api-test.component';
import { ApiTestHeaderComponent } from './header/api-test-header.component';
import { ApiTestBodyComponent } from './body/api-test-body.component';
import { ApiTestQueryComponent } from './query/api-test-query.component';
import { ApiTestRestComponent } from './rest/api-test-rest.component';
import { ApiTestResultHeaderComponent } from './result-header/api-test-result-header.component';
import { ApiTestResultResponseComponent } from './result-response/api-test-result-response.component';
import { ApiTestHistoryComponent } from './history/api-test-history.component';
import { ApiTestResultRequestBodyComponent } from './result-request-body/api-test-result-request-body.component';
import { TestServerRemoteService } from 'eo/workbench/browser/src/app/shared/services/api-test/remote-node/test-connect.service';
import { NzUploadModule } from 'ng-zorro-antd/upload';
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
  NzEmptyModule,
  NzPopconfirmModule,
  NzToolTipModule,
  NzAlertModule,
  NzTypographyModule,
  NzUploadModule
];
const COMPONENTS = [
  ApiTestComponent,
  ApiTestHeaderComponent,
  ApiTestBodyComponent,
  ApiTestQueryComponent,
  ApiTestRestComponent,
  ApiTestResultHeaderComponent,
  ApiTestResultResponseComponent,
  ApiTestResultRequestBodyComponent,
  ApiTestHistoryComponent,
];
@NgModule({
  declarations: [...COMPONENTS, ByteToStringPipe],
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
  providers: [ApiTestService, TestServerService, TestServerLocalNodeService,TestServerServerlessService,TestServerRemoteService],
})
export class ApiTestModule {}
