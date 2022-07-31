import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ModuleInfo } from 'eo/platform/node/extension-manager/types/index';
import { SidebarModuleInfo } from './sidebar.model';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  collapsed = false;
  currentModule: ModuleInfo | SidebarModuleInfo | any;
  private collapsedChanged$: Subject<boolean> = new Subject();
  public appChanged$: Subject<void> = new Subject();
  constructor() {}
  getCollapsed() {
    return this.collapsed;
  }
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedChanged$.next(this.collapsed);
  }
  onCollapsedChanged = function () {
    return this.collapsedChanged$.pipe();
  };
}
