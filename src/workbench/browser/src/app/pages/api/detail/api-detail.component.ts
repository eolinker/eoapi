import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ApiData,
  ApiBodyType,
  JsonRootType,
  StorageRes,
  StorageResStatus,
} from '../../../shared/services/storage/index.model';
import { treeToListHasLevel } from '../../../utils/tree/tree.utils';
import { reverseObj } from '../../../utils';
import { StorageService } from '../../../shared/services/storage';
import { RemoteService } from 'eo/workbench/browser/src/app/shared/services/remote/remote.service';
@Component({
  selector: 'api-detail',
  templateUrl: './api-detail.component.html',
  styleUrls: ['./api-detail.component.scss'],
})
export class ApiDetailComponent implements OnInit {
  apiData: ApiData | any = {};
  get isElectron() {
    return this.remoteService.isElectron;
  }
  CONST = {
    BODY_TYPE: reverseObj(ApiBodyType),
    JSON_ROOT_TYPE: reverseObj(JsonRootType),
  };
  constructor(private route: ActivatedRoute, private storage: StorageService, private remoteService: RemoteService) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.init(params.uuid);
    });
  }
  init(id) {
    if (id) {
      this.getApiByUuid(Number(id));
    } else {
      console.error("can't no find api");
    }
  }
  getApiByUuid(id: number) {
    this.storage.run('apiDataLoad', [id], (result: StorageRes) => {
      if (result.status === StorageResStatus.success) {
        ['requestBody', 'responseBody'].forEach((tableName) => {
          if (['xml', 'json'].includes(result.data[`${tableName}Type`])) {
            result.data[tableName] = treeToListHasLevel(result.data[tableName]);
          }
        });
        this.apiData = result.data;
      }
    });
  }
}
