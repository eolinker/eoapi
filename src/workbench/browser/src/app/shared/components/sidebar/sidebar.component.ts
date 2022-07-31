import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, takeWhile } from 'rxjs/operators';
import { ElectronService } from '../../../core/services';
import { ModuleInfo } from '../../../../../../../platform/node/extension-manager';
import { SidebarService } from './sidebar.service';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarModuleInfo } from './sidebar.model';

@Component({
  selector: 'eo-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  destroy = false;
  modules: Array<ModuleInfo | SidebarModuleInfo | any>;
  constructor(private electron: ElectronService, private router: Router, public sidebar: SidebarService) {
    this.isCollapsed = this.sidebar.getCollapsed();
    this.sidebar
      .onCollapsedChanged()
      .pipe(takeWhile(() => !this.destroy))
      .subscribe((isCollapsed) => {
        this.isCollapsed = isCollapsed;
        if (this.electron.isElectron) {
          const sideWidth: number = isCollapsed ? 50 : 90;
          window.eo.autoResize(sideWidth);
        }
      });
  }
  toggleCollapsed(): void {
    this.sidebar.toggleCollapsed();
  }

  ngOnInit(): void {
    this.getModules();
    this.getModuleIDFromRoute();
    this.watchRouterChange();
  }

  watchRouterChange() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((res: any) => {
      this.getModuleIDFromRoute();
    });
  }
  clickModule(module) {
    this.sidebar.currentModule = module;
    this.sidebar.appChanged$.next();
    const nextApp = this.modules.find((val) => val.moduleID === module.moduleID);
    const route = (nextApp as SidebarModuleInfo).route || '/home/blank';
    console.log('route', route);
    this.router.navigate([route]);
  }
  ngOnDestroy(): void {
    this.destroy = true;
  }
  private getModules() {
    const defaultModule = [
      {
        moduleName: 'REST',
        moduleID: '@eo-core-apimanger',
        isOffical: true,
        icon: 'api',
        activeRoute: 'home/api',
        route: 'home/api/test',
      },
      {
        moduleName: $localize`Extensions`,
        moduleID: '@eo-core-extension',
        isOffical: true,
        icon: 'puzzle',
        activeRoute: 'home/extension',
        route: 'home/extension/list',
      },
    ];
    if (this.electron.isElectron) {
      this.modules = [...defaultModule, ...Array.from(window.eo.getSideModuleList())];
      this.electron.ipcRenderer.on('moduleUpdate', (event, args) => {
        this.modules = window.eo.getSideModuleList();
      });
    } else {
      this.modules = [...defaultModule];
    }
  }
  private getModuleIDFromRoute() {
    const currentModule = this.modules.find((val) => this.router.url.includes(val.activeRoute));
    if (!currentModule) {
      //route error
      this.clickModule(this.modules[0]);
      console.error('route error: currentModule is undefind', currentModule);
      return;
    }
    this.sidebar.currentModule = currentModule;
    this.sidebar.appChanged$.next();
  }
}
