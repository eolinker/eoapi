import { Directive, ElementRef, Injector, Input, Output, EventEmitter } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

@Directive({ selector: 'list-block-common-component' })
export class ListBlockCommonComponent extends UpgradeComponent {
  @Input() mainObject: object;
  @Input() list: any;
  @Input() wrapStyle: any;
  @Output() listChange: EventEmitter<any>;
  constructor(ref: ElementRef, inj: Injector) {
    super('listBlockCommonComponent', ref, inj);
  }
}
