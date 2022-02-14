import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PageNotFoundComponent,
  SelectThemeComponent,
  ToolbarComponent,
  SidebarComponent,
  NavbarComponent,
} from './components';
import { WebviewDirective } from './directives';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzResultModule } from 'ng-zorro-antd/result';

import { ApiParamsNumPipe } from './pipes/api-param-num.pipe';
import { ModalService } from './services/modal.service';

const COMPONENTS = [PageNotFoundComponent, ToolbarComponent, SelectThemeComponent, SidebarComponent, NavbarComponent];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDrawerModule,
    NzRadioModule,
    NzButtonModule,
    NzIconModule,
    NzToolTipModule,
    NzResultModule,
  ],
  declarations: [WebviewDirective, ...COMPONENTS, ApiParamsNumPipe],
  providers: [ModalService],
  exports: [WebviewDirective, ...COMPONENTS, ApiParamsNumPipe],
})
export class SharedModule {}
