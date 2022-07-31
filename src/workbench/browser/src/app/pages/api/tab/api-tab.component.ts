import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ApiTabOperateService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-operate.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { BasicTab, TabOperate } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
@Component({
  selector: 'eo-api-tab',
  templateUrl: './api-tab.component.html',
  styleUrls: ['./api-tab.component.scss'],
})
export class ApiTabComponent implements OnInit, OnDestroy {
  @Input() tagsTemplate: { [key: string]: BasicTab };
  MAX_TAB_LIMIT = 15;
  routerSubscribe: Subscription;
  constructor(
    public tabStorage: ApiTabStorageService,
    public tabOperate: ApiTabOperateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.tabOperate.init(this.tagsTemplate);
    this.watchRouterChange();
  }
  newTab() {
    if (this.tabStorage.tabs.length >= this.MAX_TAB_LIMIT) {
      return;
    }
    this.tabOperate.newDefaultTab();
  }
  /**
   * Select tab
   */
  selectChange() {
    this.tabOperate.navigateTabRoute(this.tabStorage.tabs[this.tabOperate.selectedIndex]);
  }
  closeTab({ index }) {
    this.tabOperate.closeTab(index);
  }
  getTabsInfo() {
    return this.tabStorage.tabs;
  }
  batchCloseTab(uuids) {
    this.tabOperate.batchClose(uuids);
  }
  /**
   * Tab  Close Operate
   *
   * @param action
   */
  closeTabByOperate(action: TabOperate|string) {
    this.tabOperate.closeTabByOperate(action);
  }
  private watchRouterChange() {
    this.routerSubscribe = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((res: NavigationEnd) => {
        this.tabOperate.operateTabAfterRouteChange(res);
      });
  }
  ngOnDestroy(): void {
    this.routerSubscribe.unsubscribe();
  }
}
