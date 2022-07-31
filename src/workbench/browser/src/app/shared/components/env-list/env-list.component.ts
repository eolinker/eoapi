import { Component, OnInit } from '@angular/core';
import { ApiTestUtilService } from 'eo/workbench/browser/src/app/pages/api/test/api-test-util.service';
import { Environment, StorageRes, StorageResStatus } from '../../../shared/services/storage/index.model';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'env-list',
  template: ` <div style="width:300px">
    <span class="text-gray-400" i18n>Global variable</span>
    <div *ngFor="let it of gloablParams" class="flex items-center justify-between h-8">
      <span class="px-1 w-1/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
      <span class="px-1 w-2/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.value">{{ it.value }}</span>
    </div>
    <p *ngIf="!gloablParams.length" class="text-gray-500" i18n>No Global variables</p>
    <div class="py-2.5" *ngIf="env.uuid">
      <span class="text-gray-400" i18n>Environment Host</span>
      <div>
        <p class="text-gray-500 text-ellipsis overflow-hidden" class="h-8">{{ env.hostUri }}</p>
      </div>
      <span class="text-gray-400" *ngIf="env.parameters?.length" i18n>Environment variable</span>
      <div *ngFor="let it of env.parameters" class="flex items-center justify-between h-8">
        <span class="px-1 w-1/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.name">{{ it.name }}</span>
        <span class="px-1 w-2/3 text-gray-500 text-ellipsis overflow-hidden" [title]="it.value">{{ it.value }}</span>
      </div>
    </div>
  </div>`,
  styleUrls: [],
})
export class EnvListComponent implements OnInit {
  env: Environment | any = {};
  gloablParams: any = [];
  constructor(private storage: StorageService, private apiTest: ApiTestUtilService) {}
  async ngOnInit() {
    this.gloablParams = this.getGlobalParams();
    const uuid = Number(localStorage.getItem('env:selected')) || null;
    if (uuid == null) {
      return;
    }
    const envList: any = await this.getAllEnv();
    this.env = envList.find((it: any) => it.uuid === uuid);
  }
  getAllEnv(uuid?: number) {
    const projectID = 1;
    return new Promise((resolve) => {
      this.storage.run('environmentLoadAllByProjectID', [projectID], async (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          return resolve(result.data || []);
        }
        return resolve([]);
      });
    });
  }
  getGlobalParams() {
    return Object.entries(this.apiTest.getGlobals() || {}).map((it) => {
      const [key, value] = it;
      return { name: key, value };
    });
  }
}
