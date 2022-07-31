import { Injectable } from '@angular/core';
import { ApiData, StorageRes, StorageResStatus } from '../../shared/services/storage/index.model';
import { MessageService } from '../../shared/services/message';
import { StorageService } from '../../shared/services/storage';
@Injectable()
export class ApiService {
  constructor(private messageService: MessageService, private storage: StorageService) {}
  get(uuid): Promise<ApiData> {
    return new Promise((resolve) => {
      this.storage.run('apiDataLoad', [uuid], (result: StorageRes) => {
        if (result.status === StorageResStatus.success) {
          resolve(result.data);
        }
      });
    });
  }
  getAll(projectID): Promise<StorageRes> {
    return new Promise((resolve) => {
      this.storage.run('apiDataLoadAllByProjectID', [projectID], resolve);
    });
  }
  add(apiData: ApiData): Promise<StorageRes> {
    return new Promise((resolve) => {
      this.storage.run('apiDataCreate', [apiData], resolve);
    });
  }
  async copy({ uuid, createdAt, ...apiData }: ApiData) {
    apiData.name += ' Copy';
    window.sessionStorage.setItem('apiDataWillbeSave', JSON.stringify(apiData));
    await this.add(apiData);
    //TODO jump link to edit tab
  }
  delete(uuid): void {
    this.storage.run('apiDataRemove', [uuid], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        this.messageService.send({ type: 'deleteApiSuccess', data: { uuids: [uuid] } });
      }
    });
  }
  bulkDelete(apis) {
    // this.storage.run('apiDataBulkRemove', [apis], (result: StorageRes) => {
    //   if (result.status === StorageResStatus.success) {
        this.messageService.send({ type: 'deleteApiSuccess', data: { uuids: apis } });
    //   }
    // });
  }
}
