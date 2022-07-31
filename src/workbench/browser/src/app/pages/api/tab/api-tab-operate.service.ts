import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiTabStorageService } from 'eo/workbench/browser/src/app/pages/api/tab/api-tab-storage.service';
import { BasicTab, TabItem, TabOperate } from 'eo/workbench/browser/src/app/pages/api/tab/tab.model';
/**
 * Api tab service operate tabs array add/replace/close...
 * Tab change by  url change(router event)
 */
@Injectable()
export class ApiTabOperateService {
  /**
   * Current selected tab index.
   */
  selectedIndex = 0;
  /**
   * Tab basic info
   */
  BASIC_TABS: { [key: string]: BasicTab };
  constructor(private tabStorage: ApiTabStorageService, private router: Router) {}
  //Init tab info
  //Maybe from tab cache info or router url
  init(BASIC_TABS) {
    this.BASIC_TABS = BASIC_TABS;
    const tabCache = this.tabStorage.getPersistenceStorage();
    // if (tabCache) {
    //   this.tabStorage.setTabs(tabCache.tabs);
    //   this.navigateTabRoute(tabCache.tabs[tabCache.selectIndex || 0]);
    // } else {
    this.operateTabAfterRouteChange({
      url: window.location.pathname + window.location.search,
    });
    // }
  }
  /**
   * Add Default tab
   *
   * @returns tabItem
   */
  newDefaultTab() {
    const tabItem: TabItem = this.getTabFromUrl(this.BASIC_TABS.test.pathname);
    this.tabStorage.addTab(tabItem);
    //If selectIndex no change,manually change tab content url
    //Because if selectIndex change,tab component will call navigateTabRoute automatically
    if (this.selectedIndex === this.tabStorage.tabs.length - 1) {
      this.navigateTabRoute(tabItem);
      return;
    }
    this.selectedIndex = this.tabStorage.tabs.length - 1;
  }

  closeTab(index) {
    // If tab is last one,selectIndex will be change by component itself;
    this.tabStorage.closeTab(index);
    if (this.tabStorage.tabs.length === 0) {
      this.newDefaultTab();
    }
  }
  /**
   * Close tab by ID
   * */
  batchClose(ids) {
    const tabs = this.tabStorage.tabs.filter((val) => {
      const shouldClose = ids.includes(val.uuid);
      if (shouldClose) {
        this.tabStorage.removeStorage(val.uuid);
      }
      return !shouldClose;
    });
    this.tabStorage.setTabs(tabs);
    if (this.tabStorage.tabs.length === 0) {
      this.newDefaultTab();
    }
  }
  closeTabByOperate(action: string | TabOperate) {
    switch (action) {
      case TabOperate.closeAll: {
        this.tabStorage.setTabs([]);
        this.newDefaultTab();
        break;
      }
      case TabOperate.closeOther: {
        this.tabStorage.setTabs([this.tabStorage.tabs[this.selectedIndex]]);
        break;
      }
      case TabOperate.closeLeft: {
        this.tabStorage.setTabs(this.tabStorage.tabs.slice(this.selectedIndex));
        break;
      }
      case TabOperate.closeRight: {
        this.tabStorage.setTabs(this.tabStorage.tabs.slice(0, this.selectedIndex + 1));
        break;
      }
    }
  }
  /**
   * Navigate  url to tab route
   *
   * @param tab
   */
  navigateTabRoute(tab: TabItem) {
    this.router.navigate([tab.pathname], {
      queryParams: { pageID: tab.uuid, ...tab.params },
    });
  }
  /**
   * Operate tab after router change,router triggle tab change
   * Such as new tab,pick tab,close tab...
   */
  operateTabAfterRouteChange(res: { url: string }) {
    const tmpTabItem = this.getTabFromUrl(res.url);
    //Pick current router url as the first tab
    if (this.tabStorage.tabs.length === 0) {
      this.tabStorage.addTab(tmpTabItem);
      return;
    }
    //If exist tab,select that tab
    const existTabIndex = this.tabStorage.tabs.findIndex(
      (val) => val.uuid === tmpTabItem.params.pageID && val.pathname === tmpTabItem.pathname
    );
    //Router has focus current tab
    if (this.selectedIndex === existTabIndex) {
      return;
    }
    //Pick tab
    if (existTabIndex !== -1) {
      this.selectedIndex = existTabIndex;
      return;
    }
    //If no exist,new tab or replace origin tab
    this.newOrReplaceTab(tmpTabItem);
  }
  /**
   * New or replace current tab
   * Avoid open too much tab,if tab[type==='preview'] or tab[type==='edit'] with no change,replace page in current tab
   *
   * @param tabItem tab need to be add
   */
  private newOrReplaceTab(tabItem) {
    const currentTab = this.tabStorage.tabs[this.selectedIndex];
    if (currentTab.type === 'preview' || (currentTab.type === 'edit' && !currentTab.hasChanged)) {
      this.tabStorage.replaceTab(this.selectedIndex, tabItem);
      //If selectedIndex not change,need manual call selectTab to change content
      this.navigateTabRoute(tabItem);
    } else {
      this.tabStorage.addTab(tabItem);
      this.selectedIndex = this.tabStorage.tabs.length - 1;
    }
  }
  /**
   * Get tab info from url
   *
   * @param url
   * @returns tabInfo
   */
  private getTabFromUrl(url): TabItem {
    const urlArr = url.split('?');
    const params: any = {};
    const basicTab = Object.values(this.BASIC_TABS).find((val) => val.pathname === urlArr[0]);
    // Parse query params
    new URLSearchParams(urlArr[1]).forEach((value, key) => {
      if (key === 'pageID') {
        params[key] = Number(value);
        return;
      }
      params[key] = value;
    });
    const result = {
      uuid: params.pageID || Date.now(),
      pathname: urlArr[0],
      params,
      title: basicTab.title,
      type: basicTab.type,
    };
    return result;
  }
}
