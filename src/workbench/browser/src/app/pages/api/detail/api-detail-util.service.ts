import { Injectable } from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
@Injectable()
export class ApiDetailUtilService {
  constructor(private modal: ModalService) {}
  spreedAll($event) {
    let tmpEvent = $event.target;
    let tmpDepth = 10;
    let tmpElemList;
    while (true) {
      if (tmpEvent.getElementsByClassName('tr-tbd').length > 0 || tmpDepth === 0) {
        tmpElemList = tmpEvent.getElementsByClassName('tr-tbd');
        break;
      }
      tmpEvent = tmpEvent.parentNode;
      tmpDepth--;
    }
    for (const key in tmpElemList) {
      const val = tmpElemList[key];
      switch (typeof tmpElemList[key]) {
        case 'object': {
          val.click();
          break;
        }
      }
    }
  }
  spreedSingleItem(inputItem, inputBool, inputGlobalBool) {
    if (inputBool) {
      inputItem.isClick = inputGlobalBool;
    } else {
      inputItem.isClick = !inputItem.isClick;
    }
    if (
      inputItem.minimum ||
      inputItem.maximum ||
      inputItem.minLength ||
      inputItem.maxLength ||
      (inputItem.enum && inputItem.enum.length > 0 && inputItem.enum[0].value)
    ) {
      if (inputBool) {
        return {
          throw: 'needToStopEvent',
          valid: true,
        };
      } else {
        return true;
      }
    } else {
      if (inputBool) {
        return {
          throw: 'needToStopEvent',
          valid: false,
        };
      }
      return false;
    }
  }
  initListConf(opts) {
    opts.title = opts.title || $localize`Param`;
    return {
      setting: {
        draggable: true,
        dragCacheVar: opts.dragCacheVar || 'DRAG_VAR_API_EDIT_PARAM',
      },
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          thKey: opts.nameTitle || $localize`${opts.title} Name`,
          type: 'text',
          modelKey: 'name',
          placeholder: opts.nameTitle || $localize`${opts.title} Name`,
          width: 250,
          mark: 'name',
        },
        {
          thKey: $localize`Required`,
          type: 'html',
          html: $localize`{{item.required?"True":""}}`,
          width: 80,
          mark: 'require',
        },
        {
          thKey: $localize`:@@Description:Description`,
          type: 'text',
          modelKey: 'description',
          width: 250,
          mark: 'description',
        },

        {
          thKey: $localize`Example`,
          type: 'text',
          modelKey: 'example',
          width: 200,
          mark: 'example',
        },
      ],
    };
  }
  initBodyListConf(opts) {
    return {
      setting: {
        draggable: true,
        trClass: 'va_tr_asad',
        trDirective:
          'insert-html-common-directive insert-type="after" template-id="paramDetail_Template_js" bind-fun="$ctrl.mainObject.baseFun.itemClick(item,$ctrl.data.isSpreed,$ctrl.data.isSpreedBtnClick)"',
        isLevel: true,
        dragCacheVar: 'DRAG_VAR_API_EDIT_BODY',
      },
      baseFun: {
        spreedAll: this.spreedAll,
        itemClick: this.spreedSingleItem,
        watchCheckboxChange: opts.watchFormLastChange,
      },
      itemStructure: Object.assign({}, opts.itemStructure),
      tdList: [
        {
          thKey: $localize`Param Name`,
          type: 'depthHtml',
          html: '<span class="param-name-span">{{item.name}}</span>',
          width: 260,
          mark: 'name',
        },
        {
          thKey: $localize`Type`,
          type: 'text',
          modelKey: 'type',
          mark: 'type',
          width: 80,
        },
        {
          thKey: $localize`Required`,
          type: 'html',
          html: $localize`{{item.required?"True":""}}`,
          width: 60,
          mark: 'require',
        },
        {
          thKey: $localize`:@@Description:Description`,
          type: 'text',
          modelKey: 'description',
          width: 260,
          mark: 'description',
        },

        {
          thKey: $localize`Example`,
          type: 'text',
          modelKey: 'example',
          width: 200,
          mark: 'example',
        },
        {
          thKey: $localize`<button type="button" class="eo-operate-btn" ng-click="$ctrl.data.isSpreedBtnClick=!$ctrl.data.isSpreedBtnClick;$ctrl.data.isSpreed=true;$ctrl.mainObject.baseFun.spreedAll($event);$ctrl.data.isSpreed=false;">{{$ctrl.data.isSpreedBtnClick?"Shrink All":"Expand All"}}</button>`,
          type: 'html',
          html: $localize`<span class="eo-operate-btn fs12" ng-show="item.minimum ||
          item.maximum ||
          item.minLength ||
          item.maxLength ||
          (item.enum && item.enum.length > 0 && item.enum[0].value)">{{item.isClick?"Shrink":"Expand"}}</span>`,
          mark: 'fn_btn',
          width: '100px',
          class: 'undivide_line_lbcc',
          undivide: true,
        },
      ],
    };
  }
}
