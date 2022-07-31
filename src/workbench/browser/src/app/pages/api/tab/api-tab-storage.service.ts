import { Injectable } from '@angular/core';
import { RemoteService } from '../../../shared/services/remote/remote.service';
import { TabItem } from './tab.model';

@Injectable()
/**
 * Storage tab data
 * All data chagne in this service
 */
export class ApiTabStorageService {
  tabs: Array<TabItem> = [];
  storage = {};
  private cacheName = `${this.dataSource.dataSourceType}_TabCache`;
  constructor(private dataSource: RemoteService) {}
  addTab(tabItem) {
    this.tabs.push(tabItem);
  }
  replaceTab(index, tabItem) {
    this.tabs[index] = tabItem;
  }
  setTabs(tabs) {
    this.tabs = tabs;
    //reset storage
    const storage = {};
    this.tabs.forEach((val) => {
      if (this.storage[val.uuid]) {
        storage[val.uuid] = this.storage[val.uuid];
      }
    });
    this.storage = storage;
  }
  closeTab(index) {
    this.tabs.splice(index, 1);
    this.removeStorage(this.tabs[index]?.uuid);
  }
  /**
   * Storage tab data in runtime object
   *
   * @param tab
   * @param data
   */
  setStorage(tab: TabItem, data: any) {
    this.storage[tab.uuid] = data;
  }
  removeStorage(tabID) {
    if (!this.storage.hasOwnProperty(tabID)) {
      return;
    }
    delete this.storage[tabID];
  }
  /**
   * Storage tab data in runtime object
   *
   * @param tab
   * @param data
   */
  setPersistenceStorage(currentIndex) {
    console.log('cacheTabData');
    const storage = {};
    this.tabs
      .filter((val) => val.type === 'edit' && val.hasChanged)
      .forEach((val) => {
        storage[val.uuid] = this.storage[val.uuid];
      });
    window.localStorage.setItem(
      this.cacheName,
      JSON.stringify({
        currentIndex,
        tabs: this.tabs,
        storage,
      })
    );
  }
  getPersistenceStorage() {
    let result: any = null;
    try {
      result = JSON.parse(window.localStorage.getItem(this.cacheName) as string);
    } catch (e) {}
    return result;
  }
  destroy() {
    this.storage = {};
  }
}
