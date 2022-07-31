import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { eoapiSettings } from './eoapi-settings/';
import { Message, MessageService } from '../../../shared/services/message';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
import { SettingService } from 'eo/workbench/browser/src/app/core/services/settings/settings.service';
import { Router } from '@angular/router';
import { debounce } from 'eo/workbench/browser/src/app/utils';

interface TreeNode {
  name: string;
  moduleID?: string;
  disabled?: boolean;
  children?: TreeNode[];
  configuration?: any[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'eo-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  extensitonConfigurations: any[];
  @Input() set isShowModal(val) {
    this.$isShowModal = val;
    if (val) {
      this.init();
      this.remoteServerUrl = this.settings['eoapi-common.remoteServer.url'];
      this.remoteServerToken = this.settings['eoapi-common.remoteServer.token'];
      this.oldDataStorage = this.settings['eoapi-common.dataStorage'];
    } else {
      // this.handleSave();
    }
  }
  get isShowModal() {
    return this.$isShowModal;
  }
  @Output() isShowModalChange = new EventEmitter<any>();
  objectKeys = Object.keys;
  isClick = false;
  /** Whether the remote data source */
  get isRemote() {
    return this.remoteService.isRemote;
  }
  /** The text corresponding to the current data source */
  get dataSourceText() {
    return this.remoteService.dataSourceText;
  }
  private transformer = (node: TreeNode, level: number): FlatNode & TreeNode => ({
    ...node,
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    disabled: !!node.disabled,
  });
  selectListSelection = new SelectionModel<FlatNode & TreeNode>();
  treeControl: any = new FlatTreeControl<FlatNode & TreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
  switchDataSourceLoading = false;
  /** current configuration */
  currentConfiguration = [];
  // ! isVisible = false;
  $isShowModal = false;
  /** current active configure */
  /** all configure */
  $settings = {};

  set settings(val) {
    this.$settings = val;
    this.handleSave();
  }

  get settings() {
    return this.$settings;
  }
  treeNodes = [
    {
      name: $localize`:@@DataSource:Data Storage`,
      moduleID: 'eoapi-common',
    },
    {
      name: $localize`:@@Language:Language`,
      moduleID: 'eoapi-language',
    },
    {
      name: $localize`Extensions`,
      moduleID: 'eoapi-extensions',
    },
    {
      name: $localize`About`,
      moduleID: 'eoapi-about',
    },
  ] as const;
  /** local configure */
  localSettings = {};
  validateForm!: FormGroup;
  /** remote server url */
  remoteServerUrl = '';
  /** remote server token */
  remoteServerToken = '';
  oldDataStorage = '';

  get selected() {
    return this.selectListSelection.selected.at(0)?.moduleID;
  }

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private messageService: MessageService,
    private message: NzMessageService,
    private remoteService: RemoteService,
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.init();
    // this.parseSettings();
    this.messageService
      .get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((inArg: Message) => {
        switch (inArg.type) {
          case 'toggleSettingModalVisible': {
            inArg.data.isShow ? this.handleShowModal() : this.handleCancel();
            break;
          }
          case 'onDataSourceChange': {
            if (inArg.data.showWithSetting) {
              this.remoteService.refreshComponent();
            }
            break;
          }
        }
      });
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  /**
   * switch data source
   */
  switchDataSource() {
    this.switchDataSourceLoading = true;
    this.remoteService.switchDataSource().finally(() => {
      this.switchDataSourceLoading = false;
    });
    // this.messageService.send({ type: 'switchDataSource', data: { showWithSetting: true } });
  }

  /**
   * Get the title of the module
   *
   * @param module
   * @returns
   */
  getModuleTitle(module: any): string {
    const title = module?.moduleName ?? module?.contributes?.title ?? module?.title;
    return title;
  }

  handleScroll = debounce((e: Event) => {
    if (this.isClick) return;
    const target = e.target as HTMLDivElement;
    const treeNodes = this.dataSource._flattenedData.value;
    treeNodes.some((node) => {
      const el = target.querySelector(`#${node.moduleID}`) as HTMLDivElement;
      if (el.offsetTop > target.scrollTop) {
        this.selectListSelection.select(node);
        return true;
      }
    });
  }, 50);

  selectModule(node) {
    this.isClick = true;
    this.currentConfiguration = node.configuration || [];
    // console.log('this.currentConfiguration', this.currentConfiguration);
    this.selectListSelection.select(node);
    const target = document.querySelector(`#${node.moduleID}`);
    target?.scrollIntoView();
    setTimeout(() => {
      this.isClick = false;
    }, 800);
  }

  /**
   * Parse the configuration information of all modules
   */
  private init() {
    this.settings = this.localSettings = this.settingService.getSettings();
    console.log('localSettings', this.localSettings);
    const modules = window.eo?.getModules() || new Map([]);
    this.extensitonConfigurations = [...modules.values()]
      .filter((n) => n.features?.configuration)
      .map((n) => {
        const configuration = n.features.configuration;
        if (Array.isArray(configuration)) {
          configuration.forEach((m) => (m.moduleID ??= n.moduleID));
        } else {
          configuration.moduleID ??= n.moduleID;
        }
        return configuration;
      });

    // Recursively generate the setup tree
    const generateTreeData = (configurations = []) =>
      [].concat(configurations).reduce<TreeNode[]>((prev, curr) => {
        if (Array.isArray(curr)) {
          return prev.concat(generateTreeData(curr));
        }
        const treeItem: TreeNode = {
          name: curr.title,
          moduleID: curr.moduleID,
          configuration: [].concat(curr),
        };
        return prev.concat(treeItem);
      }, []);
    // All settings
    const treeData = JSON.parse(JSON.stringify(this.treeNodes));
    const extensions = treeData.find((n) => n.moduleID === 'eoapi-extensions');
    extensions.children = generateTreeData(this.extensitonConfigurations);
    extensions.configuration = this.extensitonConfigurations;
    this.dataSource.setData(treeData);
    this.treeControl.expandAll();

    // The first item is selected by default
    this.selectModule(this.treeControl.dataNodes.at(0));
  }

  handleShowModal() {
    this.isShowModal = true;
  }

  handleSave = () => {
    // for (const i in this.validateForm.controls) {
    //   if (this.validateForm.controls.hasOwnProperty(i)) {
    //     this.validateForm.controls[i].markAsDirty();
    //     this.validateForm.controls[i].updateValueAndValidity();
    //   }
    // }
    // if (this.validateForm.status === 'INVALID') {
    //   return;
    // }
    this.settingService.saveSetting(this.settings);
    window.eo?.saveSettings?.({ ...this.settings });
  };

  async handleCancel() {
    try {
      const isUpdateRemoteInfo =
        this.remoteServerUrl !== this.settings['eoapi-common.remoteServer.url'] ||
        this.remoteServerToken !== this.settings['eoapi-common.remoteServer.token'] ||
        this.oldDataStorage !== this.settings['eoapi-common.dataStorage'];

      if (isUpdateRemoteInfo) {
        this.message.success(
          'You have modified the data source related information, the page will refresh in 2 seconds...'
        );
        setTimeout(() => {
          this.remoteService.switchDataSource();
          this.remoteService.refreshComponent();
        }, 2000);
      }
    } catch (error) {
    } finally {
      this.handleSave();

      this.isShowModal = false;
      this.isShowModalChange.emit(false);
    }
  }
}
