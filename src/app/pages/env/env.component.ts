import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Environment } from 'eoapi-core';
import { StorageService } from '../../shared/services/storage.service';
import { ElectronService } from '../../core/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { uuid as uid } from '../../utils/index';
import { EoTableComponent } from '../../eoui/table/eo-table/eo-table.component';
import { Change } from '../../shared/store/env.state';

import { Subject } from 'rxjs';

@Component({
  selector: 'eo-env',
  templateUrl: './env.component.html',
  styleUrls: ['./env.component.scss'],
})
export class EnvComponent implements OnInit, OnDestroy {
  @ViewChild('table') table: EoTableComponent; // * child component ref
  varName = `{{变量名}}`;
  isVisible = false;
  envInfo: any = {};
  envList: any[] = [];
  activeUuid = 0;
  envListColumns = [
    { title: '变量名', key: 'name', isEdit: true },
    { title: '变量值', key: 'value', isEdit: true },
    { title: '参数说明', key: 'description', isEdit: true },
    { title: '操作', slot: 'action', width: '15%' },
  ];

  private destroy$: Subject<void> = new Subject<void>();
  constructor(
    private storage: StorageService,
    private electron: ElectronService,
    private message: NzMessageService,
    private store: Store
  ) {}

  get envUuid(): number {
    return Number(localStorage.getItem('env:selected')) || 0;
  }
  set envUuid(value) {
    this.activeUuid = value;
    if (value) {
      localStorage.setItem('env:selected', value == null ? '' : value.toString());
    } else {
      localStorage.removeItem('env:selected');
    }
    this.changeStoreEnv(value);
  }

  ngOnInit(): void {
    this.getAllEnv();
    this.changeStoreEnv(localStorage.getItem('env:selected'));
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllEnv() {
    this.storage.storage.environmentLoadAllByProjectID(1).subscribe((result: Array<Environment>) => {
      if (result.length === 0) {
        this.envList = [];
        this.handleAddEnv(null);
        return;
      }
      this.envList = result;
      this.handleSwitchEnv(result[0].uuid);
    });
  }

  handleDeleteEnv(uuid: string) {
    // * delete env in menu on left sidebar
    this.storage.storage.environmentRemove(uuid).subscribe((result: boolean) => {
      this.getAllEnv();
    });
  }
  handleDeleteParams(index) {
    // * delete params in table
    const data = JSON.parse(JSON.stringify(this.envInfo.parameters));
    this.envInfo.parameters = data.filter((it, i) => i !== index);
  }
  handleSwitchEnv(uuid) {
    // * switch env in menu on left sidebar
    this.storage.storage.environmentLoad(uuid).subscribe((result: Environment) => {
      const { parameters, ...other } = result;
      const list = JSON.parse(JSON.stringify(parameters));
      this.envInfo = { ...other, parameters: [...list, { name: '', value: '', description: '' }] };
    });
    this.activeUuid = uuid;
  }

  handleAddEnv(pid) {
    // * init form of env, create new env-id
    this.envInfo = {
      projectID: pid || uid(),
      name: '',
      hostUri: '',
      parameters: [{ name: '', value: '', description: '' }],
    };
    this.activeUuid = null;
  }

  handleSaveEnv() {
    // * update list after call save api
    const { parameters, name, ...other } = this.envInfo;
    if (!name) {
      this.message.error('Name is not allowed to be empty.');
      return;
    }
    const data = parameters.filter((it) => it.name && it.value);
    this.storage.storage.environmentCreate({ ...other, name, parameters: data }).subscribe((result: Environment) => {
      this.envInfo = result;
      this.activeUuid = Number(result.uuid);
      this.handleSwitchEnv(result.uuid);
      this.getAllEnv();
    });
  }

  handleTableChange(data) {
    const list = data.filter((it) => it.name || it.value || it.description);
    this.envInfo.parameters = [...list, { name: '', value: '', description: '' }];
  }

  handleUpdateEnv(uuid: string | number) {
    // * update env
    const { parameters, name, ...other } = this.envInfo;
    if (!name) {
      this.message.error('Name is not allowed to be empty.');
      return;
    }
    const data = parameters.filter((it) => it.name && it.value);
    this.storage.storage.environmentUpdate({ ...other, name, parameters: data }, uuid).subscribe((result: Environment) => {
      this.message.success('Save success');
      this.getAllEnv();
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.envList = [];
    this.envInfo = {};
  }

  handleShowModal() {
    this.isVisible = true;
  }

  handleEnvSelectStatus(event) {
    if (event) {
      this.activeUuid = this.envUuid;
      this.handleSwitchEnv(this.activeUuid);
      this.getAllEnv();
    }
  }

  private changeStoreEnv(uuid) {
    if (uuid == null) {
      this.store.dispatch(new Change(null));
      return;
    }
    this.storage.storage.environmentLoadAllByProjectID(1).subscribe((result: Array<Environment>) => {
      if (result.length === 0) {
        return;
      }
      const data = result.find((val) => val.uuid === Number(uuid));
      this.store.dispatch(new Change(data));
    });
  }
}
