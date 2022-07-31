import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElectronService } from 'eo/workbench/browser/src/app/core/services/electron/electron.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'eo-data-storage',
  template: `
    <div class="font-bold text-lg mb-2" i18n="@@DataSource">Data Storage</div>
    <form nz-form nzLayout="vertical" [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-control>
          <nz-select
            formControlName="eoapi-common.dataStorage"
            i18n-nzPlaceHolder="@@DataSource"
            nzPlaceHolder="Data Storage"
          >
            <nz-option nzValue="http" i18n-nzLabel="@@Remote Server" nzLabel="Remote Server"></nz-option>
            <nz-option nzValue="local" i18n-nzLabel nzLabel="Localhost"></nz-option>
          </nz-select>
        </nz-form-control>
        <div class="text-[12px] mt-[8px] text-gray-400">
          <p i18n>Localhost: Store the data locally. You can only use the product on the current computer.</p>
          <p i18n>
            Remote Server: Store data on a remote server to facilitate cross device use of the product. Only the client
            can connect to the remote server. You need to download the client first.
            <a href="https://eoapi.io/docs/storage.html" target="_blank" class="eo_link"> Learn more..</a>
          </p>
        </div>
      </nz-form-item>
      <ng-container *ngIf="validateForm.value['eoapi-common.dataStorage'] === 'http'">
        <nz-form-item>
          <nz-form-label i18n>Host</nz-form-label>
          <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your Host">
            <input nz-input formControlName="eoapi-common.remoteServer.url" i18n-placeholder placeholder="your host" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item>
          <nz-form-label>Security Token</nz-form-label>
          <nz-form-control i18n-nzErrorTip nzErrorTip="Please input your Security Token">
            <input
              nz-input
              formControlName="eoapi-common.remoteServer.token"
              i18n-placeholder
              placeholder="your security token"
            />
          </nz-form-control>
        </nz-form-item>
      </ng-container>
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [nzLoading]="loading" i18n>Change Data Storage</button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: [
    `
      [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }
    `,
  ],
})
export class DataStorageComponent implements OnInit, OnChanges {
  @Input() model: Record<string, any> = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  validateForm!: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private message: NzMessageService, private electronService: ElectronService) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      'eoapi-common.dataStorage': this.model['eoapi-common.dataStorage'] ?? 'local',
      'eoapi-common.remoteServer.url': [
        this.model['eoapi-common.remoteServer.url'] || 'http://localhost:3000',
        [Validators.required],
      ],
      'eoapi-common.remoteServer.token': [
        this.model['eoapi-common.remoteServer.token'] || '1ab2c3d4e5f61ab2c3d4e5f6',
        [Validators.required],
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { model } = changes;

    if (model && this.validateForm?.value) {
      this.setFormValue(model.currentValue);
    }
  }

  /**
   * 测试远程服务器地址是否可用
   */
  async pingRmoteServerUrl() {
    const dataStorage = this.validateForm.value['eoapi-common.dataStorage'];
    const remoteUrl = this.validateForm.value['eoapi-common.remoteServer.url'];
    const token = this.validateForm.value['eoapi-common.remoteServer.token'];

    if (dataStorage !== 'http') {
      return Promise.resolve(false);
    }

    try {
      const url = `${remoteUrl}/system/status`.replace(/(?<!:)\/{2,}/g, '/');
      const response = await fetch(url, {
        headers: {
          'x-api-key': token,
        },
      });
      const result = await response.json();
      console.log('result', result);
      if (result.statusCode !== 200) {
        throw result;
      }
      // await result.json();
      // this.message.create('success', $localize`Remote server address set successfully!`);
      return Promise.resolve(true);
    } catch (error) {
      console.error(error);
      this.message.create('error', $localize`Remote server connection failed!!`);
      return Promise.reject(false);
    }
  }

  async submitForm() {
    if (!this.electronService.isElectron && this.validateForm.value['eoapi-common.dataStorage'] === 'http') {
      return this.message.error(
        $localize`Only the client can connect to the remote server. You need to download the client first.`
      );
    }
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.loading = true;
      const result = await this.pingRmoteServerUrl().finally(() => (this.loading = false));
      if (Object.is(result, true)) {
        this.message.success($localize`The remote data source connection is successful!`);
      }
      this.model = {
        ...this.model,
        ...this.validateForm.value,
      };
      this.modelChange.emit(this.model);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  setFormValue(model = {}) {
    Object.keys(model).forEach((key) => {
      this.validateForm.get(key)?.setValue(model[key]);
    });
  }
}
