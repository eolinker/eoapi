import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService } from 'eo/workbench/browser/src/app/core/services/language/language.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'eo-extension-setting',
  template: `
    <div class="font-bold text-lg mb-2" i18n>Extensions</div>
    <form nz-form [nzLayout]="'vertical'" [formGroup]="validateForm" class="form">
      <div *ngFor="let module of extensitonConfigurations">
        <h2 class="title" [id]="module.moduleID" *ngIf="module.title">{{ module.title }}</h2>
        <nz-form-item nz-col class="fg1" *ngFor="let field of objectKeys(module.properties || {})">
          <ng-container *ngIf="module.properties[field]?.label">
            <nz-form-label nzFor="{{ field }}" [nzRequired]="module.properties[field]?.required" class="label">
              {{ module.properties[field]?.label }}
            </nz-form-label>
          </ng-container>
          <!-- 二级说明 -->
          <div
            *ngIf="module.properties[field]?.type !== 'boolean' && module.properties[field]?.description"
            class="description"
          >
            <eo-shadow-dom [text]="module.properties[field]?.description || ''"></eo-shadow-dom>
          </div>
          <nz-form-control
            i18n-nzErrorTip
            nzErrorTip="Please Enter {{ module.properties[field]?.label }}"
            class="form-control"
          >
            <!-- 字符串类型 -->
            <ng-container *ngIf="module.properties[field]?.type === 'string'">
              <input
                type="text"
                nz-input
                id="{{ field }}"
                [disabled]="module.properties[field]?.disabled"
                i18n-placeholder
                placeholder="{{
                  module.properties[field]?.placeholder ?? 'Please Enter ' + module.properties[field]?.label
                }}"
                formControlName="{{ field }}"
                [(ngModel)]="model[field]"
              />
            </ng-container>

            <!-- 布尔类型 -->
            <ng-container *ngIf="module.properties[field]?.type === 'boolean'">
              <label
                nz-checkbox
                [(ngModel)]="model[field]"
                id="{{ field }}"
                [nzDisabled]="module.properties[field]?.disabled"
                formControlName="{{ field }}"
                >{{ module.properties[field]?.description }}</label
              >
            </ng-container>

            <!-- 数字类型 -->
            <ng-container *ngIf="module.properties[field]?.type === 'number'">
              <nz-input-number
                [(ngModel)]="model[field]"
                id="{{ field }}"
                [nzDisabled]="module.properties[field]?.disabled"
                formControlName="{{ field }}"
              >
                {{ module.properties[field]?.description }}</nz-input-number
              >
            </ng-container>
          </nz-form-control>
        </nz-form-item>
      </div>
    </form>
    <nz-empty *ngIf="!extensitonConfigurations.length" nzNotFoundImage="simple" [nzNotFoundContent]="contentTpl">
      <ng-template #contentTpl>
        <span i18n
          >No plugins are currently installed,<a class="eo_link" (click)="navToExtensionList()"> go to install </a>
        </span>
      </ng-template>
    </nz-empty>
  `,
  styles: [
    `
      [nz-form]:not(.ant-form-inline):not(.ant-form-vertical) {
        max-width: 600px;
      }
    `,
  ],
})
export class ExtensionSettingComponent implements OnInit {
  @Input() localSettings: object = {};
  @Input() extensitonConfigurations = [];
  @Input() model: object = {};
  @Output() modelChange: EventEmitter<any> = new EventEmitter();
  validateForm!: FormGroup;
  objectKeys = Object.keys;

  constructor(public languageService: LanguageService, private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.init();
  }

  private init() {
    const controls = {};
    console.log('model', this.model, controls);

    /** Generate settings model based on configuration configuration */
    this.extensitonConfigurations.forEach((item) => {
      console.log('item', item);
      if (Array.isArray(item)) {
        item.forEach((n) => {
          n.properties = this.appendModuleID(n.properties, n.moduleID);
          this.setSettingsModel(n.properties, controls);
        });
      } else {
        item.properties = this.appendModuleID(item.properties, 'eoapi-extensions');
        this.setSettingsModel(item.properties, controls);
      }
    });

    this.validateForm = this.fb.group(controls);
    this.validateForm.valueChanges.pipe(debounceTime(300)).subscribe(this.handleChange);
  }

  // Appends the module ID to the plug-in property
  private appendModuleID = (properties, moduleID) =>
    Object.keys(properties).reduce((prev, key) => {
      prev[`${moduleID}.${key}`] = properties[key];
      return prev;
    }, {});

  /**
   * set data
   *
   * @param properties
   */
  private setSettingsModel(properties, controls) {
    //  Flat configuration object
    Object.keys(properties).forEach((fieldKey) => {
      const props = properties[fieldKey];
      this.model[fieldKey] = this.localSettings?.[fieldKey] ?? props.default;
      // Extensible to add more default checks
      if (props.required) {
        controls[fieldKey] = [null, [Validators.required]];
      } else {
        controls[fieldKey] = [null];
      }
    });
  }

  handleChange = () => {
    console.log('this.model', this.model);
    this.modelChange.emit(this.model);
  };

  navToExtensionList() {
    this.router.navigate(['home/extension/list'], {
      queryParams: { type: 'all' },
    });
    // this.handleCancel();
  }
}
