angular.module('eolinker').component('listBlockCommonComponent', {
  template: `<script type="text/ng-template" id="paramDetail_Template_js">
  <div class="container_pdtj" style="padding-left: -{-(item.listDepth||0)*29+20-}-px" {eoData}-show="item.isClick">
      <p class="f_row" {eoData}-if="item.minLength">
          <span class="title-span mw_100" i18n>最小长度：</span>
          <span  class="wb_all">-{-item.minLength-}-</span>
      </p>
      <p class="f_row" {eoData}-if="item.maxLength">
          <span class="title-span mw_100">最大长度：</span>
          <span  class="wb_all">-{-item.maxLength-}-</span>
      </p>
      <p class="f_row" {eoData}-if="item.minimum">
          <span class="title-span mw_100">最小值：</span>
          <span  class="wb_all">-{-item.minimum-}-</span>
      </p>
      <p class="f_row" {eoData}-if="item.maximum">
          <span class="title-span mw_100">最大值：</span>
          <span  class="wb_all">-{-item.maximum-}-</span>
      </p>
      <div class="f_row" {eoData}-if="item.enum.length>0&&item.enum[0].value">
          <span class="title-span mw_100">值可能性：</span>
          <table>
              <tr {eoData}-repeat="childItem in item.enum track by $index">
                  <td class="value-td">
                      <span>-{-childItem.value-}-</span>
                  </td>
                  <td class="type-td"  {eoData}-if="childItem.type">
                      <span class="divide-span">|</span>
                      <span >-{-childItem.type-}-</span>
                  </td>
                  <td class="desc-td f_row f_ac"  {eoData}-if="childItem.description">
                      <span class="divide-span">|</span>
                      <span>-{-childItem.description-}-</span>
                  </td>
                  <td class="default-td mw_100 f_ac" {eoData}-if="item.default">
                          <span class="divide-span">|</span>
                          <span>默认值</span>
                      </td>
              </tr>
          </table>
      </div>
  </div>
</script>
<div class="wrap_lbcc"
  ng-class="{'default_screen_container_lbcc':$ctrl.data.screenStatus==='default','full_screen_container_lbcc':$ctrl.data.screenStatus==='full'}">
  <div class="po_re" ng-switch="$ctrl.data.screenStatus"
      ng-if="$ctrl.mainObject.setting.ableToSetFullScreen||$ctrl.data.filterStorageKey">
      <div class="po_ab eo_to_right_0" ng-switch-default>
          <div class="po_ab enlarge_btn_container_lbcc eo_theme_iblock">
              <button type="button" ng-click="$ctrl.fun.watchUi('full_screen')"
                  ng-if="$ctrl.mainObject.setting.ableToSetFullScreen" class="eo_theme_btn_info mr5 enlarge_btn_lbcc"
                  form-undisabled="true">
                  <span class="iconfont icon-quanping"></span>
                  <span>全屏</span>
              </button>
              <button ng-if="$ctrl.data.filterStorageKey" type="button" class="eo_theme_btn_info enlarge_btn_lbcc"
                  mark="{{$ctrl.data.filterStorageKey}}" eo-attr-tip-placeholder="tab_list" form-undisabled="true"
                  other-obj="{isXml:$ctrl.otherObject.isXml,list:$ctrl.data.TAB_BLOCK_LIST_ARR,active:$ctrl.data.bodyTabBlockObj,conf:$ctrl.component.tabBlockListObj}"
                  eo-drop-elem text-arr="$ctrl.data.tabBlockListHtml">
                  <span class="iconfont icon-table-column-width"></span>
                  <span>{{$ctrl.listBlockVarible.column}}</span>
              </button>
              <button ng-if="$ctrl.mainObject.setting.ableToCopy" copy-common-directive fn-prefix="$ctrl.fun.copy()"
                  text="复制内容可用于导入平台专属格式" eo-attr-tip-placeholder="eo_custom_text" type="button"
                  class="eo_theme_btn_info enlarge_btn_lbcc">
                  <span>复制</span>
              </button>
              <button ng-if="$ctrl.mainObject.setting.ableToImport" import-method="eolinker_schema" text-html="导入"
                  single=true set-to-params="paramKey" item='{{$ctrl.mainObject.itemStructure}}'
                  reset-result="$ctrl.list" set-value="paramInfo"
                  level-status="{{$ctrl.mainObject.setting.isLevel?'nest':'unlevel'}}" text="支持导入平台专属格式"
                  eo-attr-tip-placeholder="eo_custom_text" type="button" class="eo_theme_btn_info enlarge_btn_lbcc"
                  extra-obj="$ctrl.otherObject">
              </button>
          </div>
      </div>
      <div ng-switch-when="full">
          <button type="button" ng-click="$ctrl.fun.watchUi('zoom_out_screen')"
              class="zoom_out_btn_lbcc iconfont icon-quxiaoquanping">
          </button>
      </div>
  </div>
  <div class="wrap_table_container_lbcc"
  ng-style="$ctrl.wrapStyle"
      ng-class="{'had_select_drag_wrap_lbcc':$ctrl.mainObject.setting.draggableWithSelect,'drag_wrap_lbcc':$ctrl.mainObject.setting.draggable&&$ctrl.list.length,'drag_wrap_without_data_lbcc':$ctrl.mainObject.setting.draggable&&!$ctrl.list.length}">
      <div class="thead_div_wrap">
          <div class="thead-div" inner-html-common-directive remove=true html="$ctrl.data.thHtml"
              ng-if="!$ctrl.mainObject.setting.hideTh"></div>
      </div>
      <div class="tbody_div_wrap" sv-group-root fun="$ctrl.fun.sort" sv-group-part="$ctrl.list"
          disabled="$ctrl.data.isSortDisabled" un-level="!$ctrl.mainObject.setting.isLevel"
          only-can-sort-in-model-key="$ctrl.mainObject.setting.onlyCanSortInModelKey"
          disabled-last="true"
          disabled-model-key="$ctrl.mainObject.setting.disabledSortModelKey">
          <div class="tbody-div {{$ctrl.mainObject.setting.tbodyClass}}"
              infinite-scroll="$ctrl.mainObject.baseFun.scrollLoading()" infinite-scroll-parent
              infinite-scroll-cancel="$ctrl.otherObject.allQuery.length===0||$ctrl.otherObject.allQuery.length<$ctrl.mainObject.setting.scrollMaxSize||!$ctrl.mainObject.setting.isScrollLoad"
              ng-class="{'readonly-tbody-div':$ctrl.mainObject.setting.readonly}"
              ng-click="$ctrl.fun.itemClick($event)">
              <inner-html-common-directive class="container-tbd" remove=true html="$ctrl.data.html">
              </inner-html-common-directive>
          </div>
      </div>
      <div class=" tfooter-div" ng-if="$ctrl.pageObject&&$ctrl.list.length>0">
          <div class="pageFooter f_row f_ac">
              <uib-pagination total-items="$ctrl.pageObject.msgCount" items-per-page="$ctrl.pageObject.pageSize"
                  ng-model="$ctrl.pageObject.page" max-size="$ctrl.pageObject.maxSize" boundary-link-Number="true"
                  rotate="false" next-text="&#xeb5b;" previous-text="&#xeb5a;" ng-change="$ctrl.pageObject.fun()">
              </uib-pagination>
          </div>
      </div>
      <button class="eo-operate-btn lh_30 w_100percent btd mr0"
          ng-if="$ctrl.list.length>$ctrl.data.MAX_OMIT_LIST_LENTH*$ctrl.data.listPartIndex"
          ng-click="$ctrl.fun.watchUi('show_more_list')">展开更多...</button>
  </div>
</div>`,
  controller: listBlockController,
  bindings: {
    otherObject: '=',
    authorityObject: '<',
    wrapStyle: '<',
    mainObject: '<',
    list: '=',
    activeObject: '=',
    pageObject: '<',
    mark: '@',
  },
});
listBlockController.$inject = ['$rootScope', '$element', '$scope'];

function listBlockController($rootScope, $element, $scope) {
  let vm = this;
  let locale = window.location.href.includes('zh') ? 'zh' : 'en';
  vm.listBlockVarible = {
    operate: locale === 'zh' ? '操作' : 'Operation',
    column: locale === 'zh' ? '列表项' : 'Column',
  };

  const fun = {};
  const privateFun = {};
  privateFun.setTabListStorage = (inputStorageName, inputCheckboxObject, inputList) => {
    const tmpIndexAddress = {};
    inputList.map((val) => {
      if (inputCheckboxObject.indexAddress.hasOwnProperty(val.value)) {
        tmpIndexAddress[val.value] = inputCheckboxObject.indexAddress[val.value];
      } else {
        delete tmpIndexAddress[val.value];
      }
    });
    window.localStorage.setItem(inputStorageName, JSON.stringify(tmpIndexAddress));
  };
  vm.filterActiveObj = {};
  vm.component = {
    tabBlockListObj: {
      setting: {
        hideFilter: true,
        trClass: 'hover-tr-lbcc',
        trExpression: "ng-if=\"($ctrl.otherObject.isXml&&item.value==='attr')||item.value!=='attr'\"",
      },
      baseFun: {
        teardownWhenCheckboxIsClick: (inputCheckboxObject, inputList, inputOptions = {}) => {
          privateFun.setTabListStorage(inputOptions.mark, inputCheckboxObject, inputList);
        },
      },
      tdList: [
        {
          type: 'checkbox',
          isWantedToExposeObject: true,
          checkboxClickAffectTotalItem: true,
          activeKey: 'value',
          activeValue: 1,
        },
        {
          thKey: `列表项`,
          type: 'html',
          html: '<inner-html-common-directive html="item.key"></inner-html-common-directive>',
        },
      ],
    },
  };
  vm.data = {
    MAX_OMIT_LIST_LENTH: 500,
    listPartIndex: 1,
    moreBtnObj: {},
    sortForm: {
      parentContainment: 'tbody-div',
      containment: '.tbody-div',
    },
    sortAuthorityVar: '',
    sort: false,
    isEditTable: false,
    html: '',
    partHtml: {},
    movePart: null,
    checkboxTdObject: {
      selectAll: false,
      indexAddress: {},
      query: [],
    },
    bodyTabBlockObj: {
      selectAll: false,
      indexAddress: {},
      query: [],
    },
    TAB_BLOCK_LIST_ARR: [],
    tabBlockListHtml:
      '<list-Block-Common-Component class="w_200 dp_b tab_block_list_mcc" mark="$_{mark}" other-object="$ctrl.otherObj" active-object="$ctrl.otherObj.active" list="$ctrl.otherObj.list" main-object="$ctrl.otherObj.conf"></list-Block-Common-Component>',
  };
  vm.fun = {};
  const data = {
    isAlreadyInitFilter: true,
    radioOriginalIndex: 0,
    movePart: null,
  };
  const CONFIG = {
    draggableMainObject: {
      setting: {
        object: 'width',
        affectCount: -1,
        dragOffSet: 0,
        minWidth: 30,
      },
      baseFun: {
        mouseup: (inputMark, inputWidth) => {
          /**
           * @desc 拖动鼠标放开操作
           */
          vm.data.dragCacheObj[inputMark] = inputWidth;
          window.localStorage.setItem(
            vm.mainObject.setting.dragCacheVar ||
              `${window.location.pathname.toUpperCase().replace(/\./g, '_')}_LIST_DRAG_VAR`,
            JSON.stringify(vm.data.dragCacheObj)
          );
        },
      },
      dom: $element[0],
    },
  };
  vm.fun.watchUi = (inputOpr) => {
    switch (inputOpr) {
      case 'show_more_list': {
        vm.data.listPartIndex++;
        break;
      }
      case 'full_screen': {
        vm.data.screenStatus = 'full';
        if (document.getElementsByClassName('group_and_list_container')[0])
          document.getElementsByClassName('group_and_list_container')[0].style.zIndex = 9;
        document.body.parentNode.style.overflowY = 'hidden';
        break;
      }
      case 'zoom_out_screen': {
        vm.data.screenStatus = 'default';
        if (document.getElementsByClassName('group_and_list_container')[0])
          document.getElementsByClassName('group_and_list_container')[0].style.zIndex = '';
        document.body.parentNode.style.overflowY = '';
        break;
      }
    }
  };
  vm.fun.sort = function (arg) {
    const tmpPartModule = data.movePart;
    if (!vm.data.sort) return;
    if (vm.mainObject.setting.hasOwnProperty('unSortIndex') && vm.mainObject.setting.unSortIndex === arg.targetIndex) {
      return;
    }
    switch (arg.where) {
      case 'before':
      case 'in':
      case 'after': {
        break;
      }
      default: {
        return;
      }
    }
    arg = arg || {};
    const tmp = {
      list: [],
      oldList: angular.copy(vm.list),
      index: arg.originIndex + 1,
      targetIndex: arg.targetIndex,
    };
    tmp.list.push(
      Object.assign({}, arg.from, {
        listDepth: arg.where === 'in' ? arg.to.listDepth + 1 : arg.to.listDepth,
        isHide: !!(arg.where === 'in' && arg.to.isShrink),
      })
    );
    const tmpFunListParse = () => {
      const val = tmp.oldList[tmp.index];
      if (arg.where === 'in') {
        val.listDepth = arg.to.listDepth + val.listDepth - arg.from.listDepth + 1;
      } else {
        val.listDepth -= arg.from.listDepth - arg.to.listDepth;
      }
      if (val.listDepth < 0) val.listDepth = 0;
      tmp.list.push(val);
      tmp.index++;
    };
    if (vm.mainObject.baseFun.checkIsDisabledToSort) {
      if (vm.mainObject.baseFun.checkIsDisabledToSort(arg, vm.list)) return;
    }
    if (vm.mainObject.baseFun.sortPartLastIndex) {
      while (
        tmp.index < arg.groupList.length &&
        (vm.mainObject.baseFun.sortPartLastIndex(arg.from, arg.groupList[tmp.index], {
          targetIndex: tmp.index,
          originIndex: arg.originIndex,
          list: vm.list,
        }) ||
          arg.groupList[tmp.index].listDepth > arg.from.listDepth)
      ) {
        tmpFunListParse();
      }
    } else {
      while (tmp.index < arg.groupList.length && arg.groupList[tmp.index].listDepth > arg.from.listDepth) {
        tmpFunListParse();
      }
    }
    if (arg.targetIndex > arg.originIndex && arg.targetIndex < tmp.index) return;
    tmp.oldList.splice(arg.originIndex, tmp.index - arg.originIndex);
    if (arg.targetIndex > arg.originIndex) {
      arg.targetIndex = arg.targetIndex - (tmp.index - arg.originIndex) + 1;
      tmp.targetIndex = arg.targetIndex - 1;
    }
    if (tmp.targetIndex < 0) return;
    let tmpResultList = null;
    switch (arg.where) {
      case 'before': {
        if (arg.originIndex < arg.targetIndex) {
          tmpResultList = tmp.oldList
            .slice(0, arg.targetIndex - 1)
            .concat(tmp.list)
            .concat(tmp.oldList.slice(arg.targetIndex - 1, tmp.oldList.length));
        } else {
          tmpResultList = tmp.oldList
            .slice(0, arg.targetIndex || 0)
            .concat(tmp.list)
            .concat(tmp.oldList.slice(arg.targetIndex || 0, tmp.oldList.length));
        }
        break;
      }
      case 'in': {
        // if (arg.to.listDepth >= 4) {
        //     return;
        // }
        if (vm.mainObject.baseFun.sortIn) {
          vm.mainObject.baseFun.sortIn(tmp.oldList[tmp.targetIndex]);
        }
        if (vm.mainObject.baseFun.resetSortIn) {
          arg.targetIndex = vm.mainObject.baseFun.resetSortIn(arg.targetIndex, tmp.oldList);
        }
        if (arg.originIndex < arg.targetIndex) {
          tmpResultList = tmp.oldList
            .slice(0, arg.targetIndex || 1)
            .concat(tmp.list)
            .concat(tmp.oldList.slice(arg.targetIndex || 1, tmp.oldList.length));
        } else {
          tmpResultList = tmp.oldList
            .slice(0, arg.targetIndex + 1)
            .concat(tmp.list)
            .concat(tmp.oldList.slice(arg.targetIndex + 1, tmp.oldList.length));
        }
        break;
      }
      case 'after': {
        tmpResultList = tmp.oldList
          .slice(0, arg.targetIndex || 1)
          .concat(tmp.list)
          .concat(tmp.oldList.slice(arg.targetIndex || 1, tmp.oldList.length));
        break;
      }
      default: {
        return;
      }
    }

    vm.list = tmpResultList;
    if (vm.mainObject.baseFun.sort) {
      vm.mainObject.baseFun.sort(tmpResultList, tmpPartModule);
    }
  };
  fun.getTargetEvent = function ($event, inputPointAttr) {
    const itemIndex = $event.getAttribute(inputPointAttr || 'eo-attr-index');
    if (itemIndex) {
      return $event;
    } else {
      return fun.getTargetEvent($event.parentNode, inputPointAttr);
    }
  };
  fun.getTargetIndex = function ($event, inputPointAttr) {
    const itemIndex = $event.getAttribute(inputPointAttr || 'eo-attr-index');
    if (itemIndex) {
      return itemIndex;
    } else {
      return fun.getTargetIndex($event.parentNode, inputPointAttr);
    }
  };
  fun.deleteItem = function (inputIndex) {
    if (vm.data.isDepth) {
      vm.list.splice(inputIndex, fun.getLastItemIndex(inputIndex, vm.list) - inputIndex || 1);

      // 子集为 arrItem 数组结构
      const parentIdx = fun.getParentItemIndex(inputIndex, vm.list);
      const isHasArrItem = parentIdx > -1 && fun.checkCurChildListIsArrItems(parentIdx, vm.list);
      if (isHasArrItem) {
        fun.afterHandleUpdateItems(inputIndex, vm.list);
      }
    } else {
      vm.list.splice(inputIndex, 1);
    }
  };
  fun.insertItem = function (inputObject) {
    // array类型插入为插入 copy item
    if (inputObject.item.isArrItem) {
      fun.copyItem(
        {
          item: inputObject.item,
          $index: inputObject.$index,
        },
        { isResetDefault: true, isInsertBefore: true }
      );
    } else {
      vm.list.splice(
        inputObject.$index,
        0,
        Object.assign(
          {},
          {
            listDepth: inputObject.item.listDepth,
          },
          vm.mainObject.itemStructure
        )
      );
    }
  };
  /**
   * @desc 添加子级
   * @param {object} inputObject 为当前对象添加子级
   */
  fun.addChildItem = function (inputObject) {
    const isArrItemsParent = fun.checkCurChildListIsArrItems(inputObject.$index, vm.list);
    // 如果当前字段的子集 是 isArrItem 类型数据，则以复制item方式添加
    if (isArrItemsParent) {
      const childIdxs = fun.getCurItemIdxRang(inputObject.$index, vm.list);
      const firstItemIndex = childIdxs[0];

      fun.copyItem(
        {
          item: vm.list[firstItemIndex],
          $index: firstItemIndex,
        },
        { isResetDefault: true, isInsertBefore: false }
      );
    } else {
      if (vm.mainObject.baseFun.reduceItemWhenAddChildItem) {
        vm.mainObject.baseFun.reduceItemWhenAddChildItem(inputObject.item);
      }

      const lastItemIdx = fun.getLastItemIndex(inputObject.$index, vm.list) || 1;

      const currentItem = Object.assign(
        {},
        {
          listDepth: (inputObject.item.listDepth || 0) + 1,
          isHide: !!inputObject.item.isShrink,
        },
        vm.mainObject.itemStructure
      );

      let customItem = {};

      // 自定义更新后的子级
      if (vm.mainObject.baseFun.customAddChildItem) {
        const parentItem = inputObject.item;
        customItem = vm.mainObject.baseFun.customAddChildItem(currentItem, parentItem);
      }

      const newItem = Object.assign({}, currentItem, customItem);

      vm.list.splice(lastItemIdx, 0, newItem);
    }

    // 逻辑处理添加子级，如若父级没有勾选，自动勾选
    switch (typeof data.checkboxTdIndex) {
      case 'object': {
        if (vm.mainObject.setting && vm.mainObject.setting.hasOwnProperty('parentAndChildLinkTdIndex')) {
          const tmpCheckboxTd = vm.mainObject.tdList[vm.mainObject.setting.parentAndChildLinkTdIndex];
          if (tmpCheckboxTd) {
            fun.clickCheckbox(tmpCheckboxTd, inputObject.$index, 0, true);
          }
        }

        break;
      }
      default: {
        const tmpCheckboxTd = vm.mainObject.tdList[data.checkboxTdIndex];
        if (tmpCheckboxTd) {
          fun.clickCheckbox(tmpCheckboxTd, inputObject.$index, 0, true);
        }
        break;
      }
    }
  };
  fun.copyItem = (inputObject, { isResetDefault, isInsertBefore } = {}) => {
    // 复制 指定行
    if (inputObject.item.isArrItem) {
      const [startIdx, endIdx] = fun.getCurrentItemRange(inputObject.$index, vm.list);
      let copyItems = angular.copy(vm.list.slice(startIdx, endIdx + 1));

      // 获取插入位置
      let insertIdx = 0;
      if (isInsertBefore) {
        insertIdx = startIdx;
      } else {
        const parentIdx = fun.getParentItemIndex(inputObject.$index, vm.list);
        const [_, childEndIdx] = fun.getCurrentItemRange(parentIdx, vm.list);
        insertIdx = childEndIdx + 1;
      }

      if (isResetDefault) {
        copyItems = fun.resetTargetItems(copyItems);
      }

      vm.list.splice(insertIdx, 0, ...copyItems);

      fun.afterHandleUpdateItems(inputObject.$index, vm.list);
    }
  };

  /**
   *  清空指定数组数据
   */
  fun.resetTargetItems = (itemArrs) => {
    const items = [...itemArrs];
    for (const item of items) {
      item.paramInfo = '';
    }
    return items;
  };

  /**
   * 判断子级列表是否为 isArrItem 结构的子集
   */
  fun.checkCurChildListIsArrItems = (targetIndex, inputArray) => {
    const childIdxs = fun.getCurItemIdxRang(targetIndex, inputArray);
    return childIdxs.length > 0 && childIdxs.every((idx) => inputArray[idx].isArrItem);
  };

  /**
   * 处理方法后 更新指定下标的子集 含 isArrItem 结构子集的名称
   * @param {*} inputObject
   */
  fun.afterHandleUpdateItems = (targetIndex, inputArray) => {
    const parentIdx = fun.getParentItemIndex(targetIndex, inputArray);

    if (parentIdx === -1) return;

    fun.updateItemsByParentIdx(parentIdx, inputArray);
  };
  fun.updateItemsByParentIdx = (parentIdx, inputArray) => {
    const parentParamKey = inputArray[parentIdx].paramKey;

    const childIdxs = fun.getCurItemIdxRang(parentIdx, inputArray);

    // 更新每个新的item所处下标
    childIdxs.forEach((childIdx, index) => {
      // inputArray[childIdx].paramKey = `${ parentParamKey }[${index}]`;
      inputArray[childIdx].paramKey = `item[${index}]`;
    });
  };
  /**
   * 获取当前字段 所有子字段的下标范围
   */
  fun.getCurrentItemRange = (inputIndex, inputArray) => {
    const initDepth = inputArray[inputIndex].listDepth;
    const startIdx = inputIndex;
    let endIdx = startIdx;

    while (endIdx < inputArray.length) {
      const isChild = inputArray[endIdx + 1] && inputArray[endIdx + 1].listDepth > initDepth;

      if (isChild) {
        endIdx++;
      } else {
        break;
      }
    }
    return [startIdx, endIdx];
  };
  /**
   * 获取当前字段 父级的下标
   *
   */
  fun.getParentItemIndex = (inputIndex, inputArray) => {
    let parentIdx = inputIndex - 1;
    if (!inputArray[inputIndex]) return parentIdx;
    const currentDepth = inputArray[inputIndex].listDepth;
    while (parentIdx >= 0) {
      if (inputArray[parentIdx].listDepth === currentDepth - 1) {
        break;
      }
      parentIdx--;
    }
    // -1 为未找到
    return parentIdx;
  };
  /**
   * 获取当前字段 下一级的下标 数组
   */
  fun.getCurItemIdxRang = (inputIndex, inputArray) => {
    const idxs = [];
    const curDepth = inputArray[inputIndex].listDepth;
    let startIdx = inputIndex + 1;
    while (startIdx < inputArray.length) {
      // 查找到同级或大于同级就退出
      if (curDepth >= inputArray[startIdx].listDepth) {
        break;
      }
      if (curDepth + 1 === inputArray[startIdx].listDepth) {
        idxs.push(startIdx);
      }
      startIdx++;
    }

    return idxs;
  };

  /**
   * @desc 循环去设置父级下子级的checkbox
   * @param {number} inputIndex 当前操作的序号
   * @param {array} inputList 待操作数组
   * @param {string} inputModelKey checkbox绑定的字段名
   * @param {boolean} inputIsCheck 是否勾选
   */
  fun.loopToSetChildItemCheckbox = (inputIndex, inputList, inputTdObject, inputIsCheck) => {
    let tmpNextIndex = inputIndex + 1;
    while (tmpNextIndex < inputList.length && inputList[tmpNextIndex].listDepth > inputList[inputIndex].listDepth) {
      if (
        inputTdObject.checkIsValidItem &&
        !inputTdObject.checkIsValidItem({
          item: inputList[tmpNextIndex],
        })
      ) {
        tmpNextIndex++;
        continue;
      }
      inputList[tmpNextIndex][inputTdObject.modelKey] = inputIsCheck;
      tmpNextIndex++;
    }
  };
  /**
   * @desc 单点checkbox
   * @param {object} inputTdObject checkbox 操作对象
   * @param {number} inputItemIndex 操作的行
   * @param {number} inputPartIndex 操作part序号
   * @param {boolean} inputIsAlreadyCheck 是否已经是勾选
   */
  fun.clickCheckbox = function (inputTdObject, inputItemIndex, inputPartIndex, inputIsAlreadyCheck) {
    const tmpAuthority = inputTdObject.authority;
    if (tmpAuthority && !vm.authorityObject[tmpAuthority]) return;
    const tmpList = vm.list;
    if (inputTdObject.fun) {
      inputTdObject.fun({
        item: tmpList[inputItemIndex],
        $index: inputItemIndex,
      });
      return;
    }
    if (vm.mainObject.baseFun.checkIsValidItem) {
      if (
        !vm.mainObject.baseFun.checkIsValidItem({
          item: tmpList[inputItemIndex],
          $index: inputItemIndex,
          type: inputTdObject.type,
        })
      )
        return;
    }
    if (
      inputTdObject.checkIsValidItem &&
      !inputTdObject.checkIsValidItem({
        item: tmpList[inputItemIndex],
      })
    )
      return;
    if (inputTdObject.modelKey) {
      let tmpBatchObj = null;
      let tmpIsCheck = inputIsAlreadyCheck || !tmpList[inputItemIndex][inputTdObject.modelKey];
      let tmpCheckboxValue;
      if (inputTdObject.modelValueArr) {
        tmpIsCheck =
          tmpList[inputItemIndex][inputTdObject.modelKey] === inputTdObject.modelValueArr[0] || inputIsAlreadyCheck;
        tmpCheckboxValue = inputTdObject.modelValueArr[tmpIsCheck ? 1 : 0];
      } else {
        tmpCheckboxValue = tmpIsCheck;
      }
      tmpList[inputItemIndex][inputTdObject.modelKey] = tmpCheckboxValue;
      switch (inputTdObject.type) {
        case 'checkbox': {
          tmpBatchObj = vm.data.checkboxTdObject;
          try {
            inputItemIndex = parseInt(inputItemIndex);
            if (tmpIsCheck) {
              if (!inputTdObject.cancelParentAndChildCheckLink) {
                // 逻辑处理：作为子级元素，自动勾选父级
                let tmpPreIndex = inputItemIndex - 1;
                let tmpCurrentLevel = tmpList[inputItemIndex].listDepth;
                while (tmpPreIndex >= 0) {
                  if (tmpCurrentLevel > tmpList[tmpPreIndex].listDepth) {
                    tmpList[tmpPreIndex][inputTdObject.modelKey] = tmpCheckboxValue;
                    tmpCurrentLevel = tmpList[tmpPreIndex].listDepth;
                  }
                  if (!tmpCurrentLevel) break;
                  tmpPreIndex--;
                }
              }
              // 逻辑处理：作为父级元素，弹窗询问是否勾选所有子级选项，提问语：“是否勾选所有子级？”
              if (!inputIsAlreadyCheck && !inputTdObject.disabledToAlert) {
                // disabledToAlert配置，用于判断是否需要禁用弹窗提示勾选子级
                const tmpNextIndex = inputItemIndex + 1;
                if (
                  tmpNextIndex < tmpList.length &&
                  tmpList[tmpNextIndex].listDepth > tmpList[inputItemIndex].listDepth
                ) {
                  $rootScope.EnsureModal(
                    '是否勾选所有子级？',
                    false,
                    '是否确认勾选此层级下的所有子级',
                    {
                      btnType: 1,
                      btnMessage: '确定',
                    },
                    (callback) => {
                      if (callback) {
                        fun.loopToSetChildItemCheckbox(inputItemIndex, tmpList, inputTdObject, tmpCheckboxValue);
                      }
                    }
                  );
                }
              }
            } else {
              // 函数传参，存在自定义取消勾选内容
              if (inputTdObject.fnWhenCancelToCheck) {
                inputTdObject.fnWhenCancelToCheck(inputItemIndex, tmpList, () => {
                  fun.loopToSetChildItemCheckbox(inputItemIndex, tmpList, inputTdObject, tmpCheckboxValue);
                });
                return;
              }
              // 逻辑处理：取消父级勾选时，自动取消子级勾选框
              fun.loopToSetChildItemCheckbox(inputItemIndex, tmpList, inputTdObject, tmpCheckboxValue);
            }
          } catch (EXEC_ERR) {
            console.error(EXEC_ERR);
          }

          break;
        }
        case 'relationalCheckbox': {
          tmpBatchObj = inputTdObject;
          if (inputTdObject.checkIsValidToRelate(tmpList[inputItemIndex])) {
            fun.clickCheckbox(vm.mainObject.tdList[data.checkboxTdIndex], inputItemIndex, inputPartIndex);
          }
          break;
        }
      }
      if (tmpIsCheck) {
        data.queryLength++;
        if (data.queryLength === (vm.list || []).length) {
          tmpBatchObj.selectAll = true;
        }
      } else {
        data.queryLength--;
        tmpBatchObj.selectAll = false;
      }
    } else {
      const tmpItemActiveKeyValue = tmpList[inputItemIndex][inputTdObject.activeKey];
      if (tmpItemActiveKeyValue === null && !vm.mainObject.setting.isValidToBeNull) return;
      if (vm.data.checkboxTdObject.indexAddress[tmpItemActiveKeyValue]) {
        vm.data.checkboxTdObject.query.splice(vm.data.checkboxTdObject.query.indexOf(tmpItemActiveKeyValue), 1);
        delete vm.data.checkboxTdObject.indexAddress[tmpItemActiveKeyValue];
        vm.data.checkboxTdObject.selectAll = false;
        if (vm.mainObject.baseFun.clickCheckbox) {
          vm.mainObject.baseFun.clickCheckbox('minus-single', {
            targetValue: tmpItemActiveKeyValue,
          });
        }
      } else {
        vm.data.checkboxTdObject.indexAddress[tmpItemActiveKeyValue] = inputTdObject.hasOwnProperty('activeValue')
          ? inputTdObject.activeValue
          : parseInt(inputItemIndex) + 1;
        vm.data.checkboxTdObject.query.push(tmpItemActiveKeyValue);
        let tmpQuery = [];
        if (vm.mainObject.setting && vm.mainObject.setting.isScrollLoad) {
          tmpQuery = vm.otherObject.allQuery.filter((val, key) => {
            if (val[inputTdObject.activeKey]) {
              return true;
            }
            return false;
          });
        } else {
          tmpQuery = vm.list;
        }
        if (tmpQuery.length === (vm.data.checkboxTdObject.query || []).length) {
          vm.data.checkboxTdObject.selectAll = true;
        }
        if (vm.mainObject.baseFun.clickCheckbox) {
          vm.mainObject.baseFun.clickCheckbox('plus-single', {
            targetValue: tmpItemActiveKeyValue,
          });
        }
      }
      if (vm.mainObject.baseFun.teardownWhenCheckboxIsClick) {
        vm.mainObject.baseFun.teardownWhenCheckboxIsClick(vm.data.checkboxTdObject, tmpList, {
          mark: vm.mark,
        });
      }
    }
  };
  vm.fun.moreItemClick = function (inputItem, $event, inputIndex, inputPartIndex) {
    $event.stopPropagation();
    switch (inputItem.opr) {
      case 'clear': {
        vm.list = [angular.copy(vm.mainObject.itemStructure)];
        break;
      }
      case 'insert_top': {
        fun.insertItem({
          item: vm.list[0],
          $index: 0,
        });
        break;
      }
      case 'insert_bottom': {
        fun.insertItem({
          item: vm.list[0],
          $index: vm.list.length,
        });
        break;
      }
      case 'delete': {
        fun.deleteItem(inputIndex);
        break;
      }
      case 'addChild': {
        fun.addChildItem({
          item: vm.list[inputIndex],
          $index: inputIndex,
        });
        break;
      }
      case 'insert_pre': {
        fun.insertItem({
          item: vm.list[inputIndex],
          $index: inputIndex,
        });
        break;
      }
      case 'insert_next': {
        fun.insertItem({
          item: vm.list[inputIndex],
          $index: inputIndex + 1,
        });
        break;
      }
      default: {
        const tmp = {};
        tmp.btnObject = vm.mainObject.tdList[inputItem.tdKey].btnList[inputItem.btnKey];
        tmp.btnObject = tmp.btnObject.funArr[inputItem.btnFunKey];
        if (tmp.btnObject.fun) {
          const inputArg = {
            item: vm.list[inputIndex],
            $index: inputIndex,
          };
          switch (typeof tmp.btnObject.param) {
            case 'string': {
              eval(`tmp.btnObject.fun(${tmp.btnObject.param})`);
              return;
            }
            default: {
              tmp.btnObject.fun(Object.assign(inputArg, tmp.btnObject.param));
            }
          }
        }
        break;
      }
    }
  };
  vm.fun.itemClick = function ($event, inputPartIndex) {
    // $event.stopPropagation();
    const tmp = {};
    try {
      tmp.point = $event.target.classList[0];
      if ($event.target.classList.value.indexOf('input-checkbox') > -1) {
        tmp.point = 'input-checkbox';
      }
    } catch (e) {
      console.error(e);
      tmp.point = 'default';
    }
    if (/container-tbd/.test(tmp.point)) return;
    if (/^(btn-)|(fbtn-)|(cbtn-)/.test(tmp.point)) {
      tmp.itemIndex = parseInt(fun.getTargetIndex($event.target));
      try {
        tmp.btnObject =
          vm.mainObject.tdList[fun.getTargetIndex($event.target, 'eo-attr-td-index')].btnList[
            fun.getTargetIndex($event.target, 'eo-attr-btn-index')
          ] || '';
      } catch (GET_ERR) {
        tmp.btnObject = {};
      }
      if (!tmp.btnObject.isUnWantToStopPropagation) {
        $event.stopPropagation();
      }
      if (tmp.point === 'btn-funItem') {
        tmp.btnObject = tmp.btnObject.funArr[fun.getTargetIndex($event.target, 'eo-attr-btn-fun-index')];
      }
      if (tmp.btnObject.fun) {
        const inputArg = {
          item: vm.list[tmp.itemIndex],
          $index: tmp.itemIndex,
        };
        if (/^(fbtn-)/.test(tmp.point)) {
          inputArg.callback = vm.fun.watchFormLastChange;
        }
        switch (typeof tmp.btnObject.param) {
          case 'string': {
            eval(`tmp.btnObject.fun(${tmp.btnObject.param})`);
            return;
          }
          default: {
            tmp.btnObject.fun(Object.assign(inputArg, tmp.btnObject.param));
            return;
          }
        }
      }
      switch (tmp.point) {
        case 'btn-delete':
        case 'cbtn-delete': {
          fun.deleteItem(tmp.itemIndex);
          break;
        }
        case 'btn-addChild': {
          fun.addChildItem({
            item: vm.list[tmp.itemIndex],
            $index: tmp.itemIndex,
          });
          break;
        }
        case 'btn-insert': {
          fun.insertItem({
            item: vm.list[tmp.itemIndex],
            $index: tmp.itemIndex,
          });
          break;
        }
      }
    } else {
      $event.stopPropagation();
      if (data.checkboxClickAffectTotalItem && vm.data.checkboxTdObject.isOperating) {
        tmp.point = 'input-checkbox';
      } else if (data.radioClickAffectTotalItem) {
        tmp.point = 'input-radio';
      }
      switch (tmp.point) {
        case 'input-checkbox': {
          let tmpTdIndex;
          if (typeof data.checkboxTdIndex === 'string') {
            tmpTdIndex = data.checkboxTdIndex;
          } else {
            tmpTdIndex = fun.getTargetIndex($event.target, 'eo-attr-td-index');
          }
          fun.clickCheckbox(vm.mainObject.tdList[tmpTdIndex], fun.getTargetIndex($event.target), inputPartIndex);
          break;
        }
        case 'relational-checkbox': {
          fun.clickCheckbox(
            vm.mainObject.tdList[data.relationalCheckboxTdIndex],
            fun.getTargetIndex($event.target),
            inputPartIndex
          );
          break;
        }
        case 'input-radio': {
          tmp.tdObject = vm.mainObject.tdList[data.radioTdIndex];
          tmp.itemIndex = fun.getTargetIndex($event.target);
          if (tmp.tdObject.disabledModelKey && vm.list[tmp.itemIndex][tmp.tdObject.disabledModelKey]) {
            return;
          }
          if (tmp.tdObject.modelKey) {
            if (
              (data.radioOriginalIndex || 0).toString() === tmp.itemIndex &&
              tmp.tdObject.isCanBeCancle &&
              vm.list[data.radioOriginalIndex][tmp.tdObject.modelKey]
            ) {
              vm.list[tmp.itemIndex][tmp.tdObject.modelKey] = !vm.list[tmp.itemIndex][tmp.tdObject.modelKey];
              data.radioOriginalIndex = 0;
            } else {
              if (vm.list[data.radioOriginalIndex] && vm.list[data.radioOriginalIndex][tmp.tdObject.modelKey])
                vm.list[data.radioOriginalIndex][tmp.tdObject.modelKey] = false;
              else {
                for (const key in vm.list) {
                  const tmpItem = vm.list[key];
                  if (tmpItem[tmp.tdObject.modelKey]) {
                    tmpItem[tmp.tdObject.modelKey] = false;
                    break;
                  }
                }
              }
              vm.list[tmp.itemIndex][tmp.tdObject.modelKey] = true;
              data.radioOriginalIndex = tmp.itemIndex;
            }
          } else {
            const tmpItemActiveKeyValue = vm.list[tmp.itemIndex][tmp.tdObject.activeKey];
            if (tmpItemActiveKeyValue === null) return;
            vm.data.checkboxTdObject.indexAddress = {};
            vm.data.checkboxTdObject.query = [];
            if ((data.radioOriginalIndex || 0).toString() === tmp.itemIndex && tmp.tdObject.isCanBeCancle) {
              data.radioOriginalIndex = 0;
            } else {
              vm.data.checkboxTdObject.query.push(tmpItemActiveKeyValue);
              vm.data.checkboxTdObject.indexAddress[tmpItemActiveKeyValue] = 1;
              data.radioOriginalIndex = tmp.itemIndex;
            }
          }
          break;
        }
      }
      if (!vm.data.checkboxTdObject.isOperating && vm.mainObject.baseFun.trClick) {
        tmp.itemIndex = parseInt(fun.getTargetIndex($event.target));
        vm.mainObject.baseFun.trClick({
          item: vm.list[tmp.itemIndex],
          $index: tmp.itemIndex,
        });
      }
    }
  };
  vm.fun.selectAll = function (inputTdIndex) {
    const tmpTdObj = vm.mainObject.tdList[inputTdIndex];
    const tmpBatchObj =
      tmpTdObj.type === 'checkbox' && tmpTdObj.isWantedToExposeObject ? vm.data.checkboxTdObject : tmpTdObj;
    const tmpAuthority = tmpTdObj.authority;
    if (tmpAuthority && !vm.authorityObject[tmpAuthority]) return;
    const tmp = {
      modelKey: tmpTdObj.modelKey,
      activeKey: tmpTdObj.activeKey,
    };
    tmpBatchObj.selectAll = !tmpBatchObj.selectAll;
    switch (tmpTdObj.type) {
      case 'relationalCheckbox': {
        if (tmpTdObj.checkIsValidToRelateAll(tmpBatchObj.selectAll)) {
          vm.fun.selectAll(data.checkboxTdIndex);
        }
      }
    }
    if (vm.mainObject.baseFun && vm.mainObject.baseFun.selectAll) {
      vm.mainObject.baseFun.selectAll(vm.data.checkboxTdObject.selectAll);
      return;
    }
    if (tmp.modelKey) {
      if (!tmpBatchObj.selectAll) {
        if (vm.list.length === 1 && vm.mainObject.setting.isStaticFirstIndex) {
          tmpBatchObj.selectAll = true;
          return;
        }
      }
      let tmpIsHadDisabledKeyLength = 0;
      for (const key in vm.list) {
        if (
          (vm.mainObject.setting.isStaticFirstIndex && key === '0') ||
          (vm.mainObject.setting.disabledSelectModelKey &&
            vm.list[key][vm.mainObject.setting.disabledSelectModelKey] === vm.mainObject.setting.disabledSelectVal)
        ) {
          tmpIsHadDisabledKeyLength++;
          continue;
        }
        if (
          tmpTdObj.checkIsValidItem &&
          !tmpTdObj.checkIsValidItem({
            item: vm.list[key],
          })
        )
          continue;
        let tmpValue = tmpBatchObj.selectAll;
        if (tmpTdObj.modelValueArr) {
          tmpValue = tmpBatchObj.selectAll ? tmpTdObj.modelValueArr[1] : tmpTdObj.modelValueArr[0];
        }
        vm.list[key][tmp.modelKey] = tmpValue;
      }
      data.queryLength = tmpBatchObj.selectAll ? (vm.list || []).length : 0;
      if (tmpTdObj.type === 'relationalCheckbox') return;
      if (vm.mainObject.baseFun.clickCheckbox) {
        vm.mainObject.baseFun.clickCheckbox(`${tmpBatchObj.selectAll ? 'plus' : 'minus'}-all`);
      }
    } else {
      const tmpIndexAddress = vm.data.checkboxTdObject.indexAddress;
      const tmpOldListLength = vm.data.checkboxTdObject.query.length;
      if (!vm.data.checkboxTdObject.selectAll) {
        let tmpQuery = [];
        if (vm.mainObject.setting && vm.mainObject.setting.isScrollLoad) {
          tmpQuery = vm.otherObject.allQuery;
        } else {
          tmpQuery = vm.list;
        }
        for (let i = 0; i < vm.data.checkboxTdObject.query.length; ) {
          const activeID = vm.data.checkboxTdObject.query[i];
          if (
            vm.mainObject.baseFun.checkIsValidItem &&
            !vm.mainObject.baseFun.checkIsValidItem({
              item: tmpQuery[
                tmpQuery.findIndex((listItem) => {
                  return listItem[tmp.activeKey] === activeID;
                })
              ],
              indexAddress: tmpIndexAddress,
              isSelectAll: true,
            })
          ) {
            i++;
            continue;
          }
          delete vm.data.checkboxTdObject.indexAddress[activeID];
          vm.data.checkboxTdObject.query.splice(i, 1);
        }
        if (vm.mainObject.baseFun.cancelToSelectAll) {
          vm.mainObject.baseFun.cancelToSelectAll();
        } else if (vm.mainObject.baseFun.clickCheckbox) {
          vm.mainObject.baseFun.clickCheckbox('minus-all', {
            oldLength: tmpOldListLength,
          });
        }
      } else {
        vm.data.checkboxTdObject.query.splice(0, vm.data.checkboxTdObject.query.length);
        if (vm.mainObject.setting.disabledSelectModelKey) {
          for (const key in vm.list) {
            if (
              vm.list[key][vm.mainObject.setting.disabledSelectModelKey] !== vm.mainObject.setting.disabledSelectVal
            ) {
              vm.data.checkboxTdObject.query.push(vm.list[key][tmp.activeKey]);
              vm.data.checkboxTdObject.indexAddress[vm.list[key][tmp.activeKey]] = tmpTdObj.hasOwnProperty(
                'activeValue'
              )
                ? tmpTdObj.activeValue
                : parseInt(key) + 1;
            }
          }
        } else {
          let tmpQuery = [];
          if (vm.mainObject.setting && vm.mainObject.setting.isScrollLoad) {
            tmpQuery = vm.otherObject.allQuery;
          } else {
            tmpQuery = vm.list;
          }
          for (const key in tmpQuery) {
            if (
              tmpQuery[key][tmp.activeKey] === null ||
              (vm.mainObject.baseFun.checkIsValidItem &&
                !vm.mainObject.baseFun.checkIsValidItem({
                  item: tmpQuery[key],
                  indexAddress: tmpIndexAddress,
                  isSelectAll: true,
                }))
            )
              continue;
            vm.data.checkboxTdObject.query.push(tmpQuery[key][tmp.activeKey]);
            vm.data.checkboxTdObject.indexAddress[tmpQuery[key][tmp.activeKey]] = tmpTdObj.hasOwnProperty('activeValue')
              ? tmpTdObj.activeValue
              : parseInt(key) + 1;
          }
        }
        if (vm.mainObject.baseFun.clickCheckbox) {
          vm.mainObject.baseFun.clickCheckbox('plus-all', {
            oldLength: tmpOldListLength,
            currentLenght: vm.data.checkboxTdObject.query.length,
          });
        }
      }
      if (vm.mainObject.baseFun.teardownWhenCheckboxIsClick) {
        vm.mainObject.baseFun.teardownWhenCheckboxIsClick(vm.data.checkboxTdObject, vm.list, {
          mark: vm.mark,
        });
      }
    }
  };
  fun.getLastItemIndex = function (inputIndex, inputArray) {
    let key = inputIndex + 1;
    while (key < inputArray.length) {
      if ((inputArray[inputIndex].listDepth || 0) >= (inputArray[key].listDepth || 0)) {
        return key;
      }
      key++;
    }
    return key;
  };
  fun.checkIsLastItem = function (inputIndex, inputArray) {
    let key = inputIndex + 1;
    while (key < inputArray.length) {
      if (inputArray[inputIndex].listDepth === inputArray[key].listDepth) {
        return false;
      } else if (inputArray[inputIndex].listDepth > inputArray[key].listDepth) {
        return key;
      }
      key++;
    }
    return key;
  };
  // 监听 列表项 change触发事件
  vm.fun.watchFormLastChange = function (inputArg, callback) {
    if (!(vm.mainObject.setting && vm.mainObject.setting.munalAddRow) && !inputArg.item.cancleAutomaticAddRow) {
      if (vm.data.isDepth) {
        if (!(vm.mainObject.setting.munalHideOperateColumn && inputArg.$index === 0)) {
          // 判断子集是否和ArrItem结构，是的话更新Item名字
          if (fun.checkCurChildListIsArrItems(inputArg.$index, vm.list)) {
            fun.updateItemsByParentIdx(inputArg.$index, vm.list);
          }
          // ArrItem 不再新增同级子项
          if (!inputArg.item.isArrItem) {
            const tmpIndex = fun.checkIsLastItem(inputArg.$index, vm.list);
            if (
              tmpIndex !== false &&
              (!vm.mainObject.setting.illegalAutomaticAddRowModelKey ||
                (vm.mainObject.setting.illegalAutomaticAddRowModelKey &&
                  !inputArg.item.hasOwnProperty(vm.mainObject.setting.illegalAutomaticAddRowModelKey)))
            ) {
              vm.list.splice(
                tmpIndex,
                0,
                Object.assign(
                  {},
                  {
                    listDepth: inputArg.item.listDepth,
                  },
                  vm.mainObject.itemStructure
                )
              );
            }
          }
        }
      } else if (inputArg.$index === vm.list.length - 1) {
        vm.list.splice(
          inputArg.$index + 1,
          0,
          Object.assign(
            {},
            {
              listDepth: inputArg.item.listDepth,
            },
            vm.mainObject.itemStructure
          )
        );
      }
    }
    if (vm.mainObject.baseFun && vm.mainObject.baseFun.watchFormLastChange) {
      vm.mainObject.baseFun.watchFormLastChange(inputArg);
    }
    if (callback) {
      callback(inputArg);
    }
  };
  $scope.importFile = function (inputArg, inputEvent) {
    inputArg.$index = this.$parent.$index;
    inputArg.item = vm.list[inputArg.$index];
    vm.mainObject.baseFun.importFile(inputArg);
    // if (inputEvent) inputEvent.value = '';
    ($scope.$root && $scope.$root.$$phase) || $scope.$apply();
  };
  /**
   * @desc 过滤列表函数
   */
  vm.fun.filterCallback = (inputMark, inputFilterActiveObj) => {
    vm.filterActiveObj[inputMark] = angular.copy(inputFilterActiveObj);
    vm.mainObject.baseFun.filter(vm.filterActiveObj, vm.list);
  };
  vm.fun.shrinkList = function ($event) {
    $event.stopPropagation();
    const tmp = {};
    tmp.targetDom = fun.getTargetEvent($event.target);
    tmp.itemIndex = fun.getTargetIndex($event.target);
    vm.list[tmp.itemIndex].isShrink = !vm.list[tmp.itemIndex].isShrink;
    fun.operateLevel(
      vm.list[tmp.itemIndex].isShrink ? 'shrink' : 'spreed',
      vm.list[tmp.itemIndex].listDepth,
      parseInt(tmp.itemIndex) + 1
    );
  };
  vm.fun.range = function (inputLength, inputObject) {
    inputLength = inputLength || 1;
    if (
      !vm.list[inputObject.$index + 1] ||
      (vm.list[inputObject.$index + 1].listDepth || 0) <= (inputObject.item.listDepth || 0)
    )
      inputLength--;
    return new Array(inputLength);
  };
  vm.fun.sortMouseDown = function ($event, inputIndex) {
    if (vm.mainObject.setting.unsortableVar && vm.otherObject && vm.otherObject[vm.mainObject.setting.unsortableVar])
      return;
    data.mouseEventElem = angular.element($event.target);
    data.mouseEventElem.bind('mousemove', () => {
      vm.data.movePart = inputIndex;
    });
  };
  vm.fun.mouseUp = function () {
    if (data.mouseEventElem) data.mouseEventElem.unbind('mousemove');
    data.movePart = vm.data.movePart;
    vm.data.movePart = null;
  };
  vm.fun.sortCallback = (inputMark) => {
    vm.mainObject.baseFun.automaticSort(inputMark, vm.list, (callback) => {
      if (callback) {
        vm.list = callback;
      }
    });
  };
  fun.operateLevel = function (type, inputDepth, inputIndex) {
    let tmpShrinkArr = [];
    for (let itemIndex = inputIndex; itemIndex < vm.list.length; itemIndex++) {
      if (inputDepth >= vm.list[itemIndex].listDepth) break;
      switch (type) {
        case 'shrink': {
          vm.list[itemIndex].isHide = true;
          break;
        }
        case 'spreed': {
          const tmpParentShrinkObject = vm.list[(tmpShrinkArr[0] || {}).index || inputIndex - 1 || 0];
          if (vm.list[itemIndex].listDepth <= tmpParentShrinkObject.listDepth) {
            const tmpNewShrinkArr = angular.copy(tmpShrinkArr);
            for (const shrinkIndexObj of tmpShrinkArr) {
              if (shrinkIndexObj.depth < vm.list[itemIndex].listDepth) break;
              tmpNewShrinkArr.shift();
            }
            tmpShrinkArr = tmpNewShrinkArr;
            if (vm.list[itemIndex].listDepth === tmpParentShrinkObject.listDepth) {
              itemIndex--;
              continue;
            }
            vm.list[itemIndex].isHide = false;
          } else if (!tmpParentShrinkObject.isShrink) {
            vm.list[itemIndex].isHide = false;
          }
          if (vm.list[itemIndex].isShrink) {
            tmpShrinkArr.unshift({
              index: itemIndex,
              depth: vm.list[itemIndex].listDepth,
              key: vm.list[itemIndex].paramKey,
            });
          }
          break;
        }
      }
    }
  };
  fun.parseFloatBtnGroupHtml = function (inputWhich, inputIndex, inputArray, inputExpression) {
    let tmpOutputHtml = '';
    if (inputArray) {
      tmpOutputHtml += `<div class="float-btngroup-tbd float-btngroup-${inputWhich}-tbd" ${inputExpression || ''}>`;
      for (const btnKey in inputArray) {
        const btnVal = inputArray[btnKey];
        tmpOutputHtml += `<button type="button" class="fbtn-${btnVal.operateName} float-btn-lbt ${
          btnVal.class || ''
        }" ${btnVal.itemExpression || ''} eo-attr-btn-index="${btnKey}" eo-attr-td-index="${inputIndex}">${
          btnVal.key || btnVal.html
        }</button>`;
      }
      tmpOutputHtml += '</div>';
    }
    return tmpOutputHtml;
  };
  /**
   * @TODOS ListDepth
   */
  fun.initItemHtml = function (inputVal, inputKey) {
    let tmpHtml = '';
    let tmpThHtml = '';
    let tmpSortAndFilterHtml = '';
    let tmpDragThHtml = '';
    let tmpFilterItemExpression;
    let tmpThFilterItemExpression;
    inputVal.blockDefinedClass = inputVal.class || '';
    if (vm.mainObject.setting.draggable || inputVal.mark) {
      inputVal.draggableMainObject = Object.assign(
        {},
        vm.mainObject.setting.draggableMainObject,
        CONFIG.draggableMainObject,
        {
          mark: inputVal.mark,
        }
      );
      let addWidthExpression = [];
      switch (inputVal.type) {
        case 'text':
        case 'depthText':
        case 'depthHtml':
        case 'html': {
          addWidthExpression = ['itemExpression'];
          break;
        }
        case 'autoCompleteAndFile':
        case 'checkbox':
        case 'select': {
          addWidthExpression = ['thItemExpression', 'itemExpression'];
          break;
        }
        case 'depthInput': {
          addWidthExpression = ['thItemExpression', 'tdItemExpression'];
          break;
        }
        case 'input':
        case 'autoComplete': {
          addWidthExpression = ['tdItemExpression'];
          break;
        }
      }
      addWidthExpression.forEach((expressionName) => {
        inputVal[expressionName] = inputVal[expressionName] || '';
        inputVal[expressionName] += `${
          vm.mainObject.setting.draggable ? `ng-style="{width:$ctrl.data.dragCacheObj['${inputVal.mark}']}"` : ''
        }`;
      });
      if (!inputVal.undivide && inputVal.mark) {
        tmpDragThHtml = `<span class="divide_line_lbcc ccr" drag-Change-Spacing-Common-Directive other-obj="$ctrl.data.dragCacheObj" main-object='$ctrl.mainObject.tdList[${inputKey}].draggableMainObject' affect-Class="th_drag_${inputKey}_lbcc">&nbsp;</span>`;
      }
      inputVal.blockDefinedClass += `${inputVal.mark ? ` th_drag_${inputKey}_lbcc po_re` : ''}`;
    }
    if (!vm.mainObject.setting.hideFilter && !inputVal.static && inputVal.thKey && !/^</.test(inputVal.thKey)) {
      const tmpVal = inputVal.mark || inputVal.modelKey || inputKey;
      vm.data.TAB_BLOCK_LIST_ARR.push({
        key: inputVal.thKey,
        value: tmpVal,
      });
      if (data.isAlreadyInitFilter && !inputVal.hide) {
        vm.data.bodyTabBlockObj.query.push(tmpVal);
        vm.data.bodyTabBlockObj.indexAddress[tmpVal] = 1;
      }
      if (inputVal.tdItemExpression && inputVal.tdItemExpression.indexOf('ng-if') > -1) {
        if (/(ng-if=")([^"]+)(")/.test(inputVal.thItemExpression)) {
          inputVal.thItemExpression = inputVal.thItemExpression.replace(
            /(ng-if=")([^"]+)(")/,
            `$1$2&&$ctrl.data.bodyTabBlockObj.indexAddress['${tmpVal}']$3`
          );
        } else {
          inputVal.thItemExpression = `${
            inputVal.thItemExpression || ''
          }ng-if="$ctrl.data.bodyTabBlockObj.indexAddress['${tmpVal}']"`;
        }
        inputVal.tdItemExpression = inputVal.tdItemExpression.replace(
          /(ng-if=")([^"]+)(")/,
          `$1$2&&$ctrl.data.bodyTabBlockObj.indexAddress['${tmpVal}']$3`
        );
      } else if (
        ['checkbox', 'text', 'html'].indexOf(inputVal.type) > -1 &&
        inputVal.itemExpression &&
        inputVal.itemExpression.indexOf('ng-if') > -1
      ) {
        if (/(ng-if=")([^"]+)(")/.test(inputVal.thItemExpression)) {
          inputVal.thItemExpression = inputVal.thItemExpression.replace(
            /(ng-if=")([^"]+)(")/,
            `$1$2&&$ctrl.data.bodyTabBlockObj.indexAddress['${tmpVal}']$3`
          );
        } else {
          inputVal.thItemExpression = `${
            inputVal.thItemExpression || ''
          }ng-if="$ctrl.data.bodyTabBlockObj.indexAddress['${tmpVal}']"`;
        }
        inputVal.itemExpression = inputVal.itemExpression.replace(
          /(ng-if=")([^"]+)(")/,
          `$1$2&&$ctrl.data.bodyTabBlockObj.indexAddress['${tmpVal}']$3`
        );
      } else {
        tmpFilterItemExpression = `ng-if="$ctrl.data.bodyTabBlockObj.indexAddress['${tmpVal}']"`;
      }
    }
    if (inputVal.sortAndFilterConf) {
      tmpSortAndFilterHtml = `${
        inputVal.sortAndFilterConf
          ? `<sort-And-Filter-List-Default-Component class="po_ab eo_to_right_0 mr5" main-obj="$ctrl.mainObject.tdList[${inputKey}].sortAndFilterConf" filter-fun="$ctrl.fun.filterCallback('${
              inputVal.filterKey || inputVal.mark
            }',arg)" sort-fun="$ctrl.fun.sortCallback(arg)"></sort-And-Filter-List-Default-Component>`
          : ''
      }`;
    }
    if (inputVal.undivide) {
      inputVal.blockDefinedClass += ' undivide_line_lbcc';
    }
    switch (inputVal.type) {
      case 'depthText': {
        vm.data.isDepth = true;
        tmpThHtml += `<div class="plr5 {{class}}" $_filter_expression>${inputVal.thKey}</div>`;
        tmpHtml +=
          `${
            '<div class="td-tbd text-td-tbd plr5 {{class}}" $_filter_expression>' +
            '<div class="depth-td-tbd" ng-style="{\'padding-left\':(15*item.listDepth+($ctrl.data.shrinkBtnLength?25:0))+\'px\'}" ng-init="item.listDepthArray=$ctrl.fun.range(item.listDepth+1,{item:item,$index:$outerIndex})">' +
            '<button type="button" class="btn-shrink iconfont" ng-click="$ctrl.fun.shrinkList($event)" ng-class="{\'icon-pinleizengjia\':item.isShrink,\'icon-pinleijianshao\':!item.isShrink}" ng-if="$ctrl.list[$index+1].listDepth>item.listDepth"></button>' +
            '<span class="divide-td-tbd" ng-class="{\'first-divide-td-tbd\':item.listDepth==$index}" ng-repeat="key in item.listDepthArray track by $index" ng-style="{\'left\':(15*$index+30)+\'px\'}" ng-hide="item.isShrink&&item.listDepth==$index"></span>' +
            '<span>{{item.'
          }${inputVal.modelKey}}}</span>` +
          '</div>' +
          '</div>';
        break;
      }
      case 'depthHtml': {
        vm.data.isDepth = true;
        tmpThHtml += `<div class="plr5 {{class}}" ${inputVal.itemExpression || ''} $_filter_expression>${
          inputVal.thKey
        }${tmpDragThHtml}</div>`;
        tmpHtml +=
          `${
            `<div class="td-tbd text-td-tbd plr5 {{class}}" ${
              vm.mainObject.setting.showTextTitle ? `title="{{item.${inputVal.modelKey}}}"` : ''
            }  ${inputVal.itemExpression || ''} $_filter_expression>` +
            '<div class="depth-td-tbd"  ng-style="{\'padding-left\':(15*item.listDepth+($ctrl.data.shrinkBtnLength?25:0))+\'px\'}" ng-init="item.listDepthArray=$ctrl.fun.range(item.listDepth+1,{item:item,$index:$outerIndex})">' +
            '<button type="button" class="btn-shrink iconfont" ng-click="$ctrl.fun.shrinkList($event)" ng-class="{\'icon-pinleizengjia\':item.isShrink,\'icon-pinleijianshao\':!item.isShrink}" ng-if="$ctrl.list[$index+1].listDepth>item.listDepth"></button>' +
            '<span class="divide-td-tbd" ng-class="{\'first-divide-td-tbd\':item.listDepth==$index}" ng-repeat="key in item.listDepthArray track by $index" ng-style="{\'left\':(15*$index+30)+\'px\'}" ng-hide="item.isShrink&&item.listDepth==$index"></span>'
          }${inputVal.html}</div>` + '</div>';
        break;
      }
      case 'depthInput': {
        vm.data.isEditTable = true;
        vm.data.isDepth = true;
        tmpThHtml += `<div class="plr5 po_re {{class}}" ${inputVal.thItemExpression || ''} $_filter_expression>${
          inputVal.thKey
        }${tmpDragThHtml}</div>`;
        tmpHtml +=
          `<div class="td-tbd va-top-td-tbd depth-td-tdb plr5 {{class}}" $_filter_expression ${
            inputVal.tdItemExpression || ''
          } >` +
          `<div class="depth-td-tbd" ${inputVal.directiveExpression || ''}
            ng-style="{'padding-left':(15*item.listDepth+($ctrl.data.shrinkBtnLength?25:0))+'px'}">` +
          '<button type="button" class="btn-shrink iconfont" ng-click="$ctrl.fun.shrinkList($event)" ng-class="{\'icon-pinleizengjia\':item.isShrink,\'icon-pinleijianshao\':!item.isShrink}" ng-if="$ctrl.list[$index+1].listDepth>item.listDepth"></button>' +
          '<span class="divide-td-tbd" ng-class="{\'first-divide-td-tbd\':item.listDepth==$index}" ng-repeat="key in $ctrl.fun.range(item.listDepth+1,{item:item,$index:$outerIndex}) track by $index" ng-style="{\'left\':(15*$index+30)+\'px\'}" ng-hide="item.isShrink&&item.listDepth==$index"></span>' +
          `<input autocomplete="off" ${inputVal.itemExpression || ''} type="text" class="eo-input" ng-model="item.${
            inputVal.modelKey
          }" ng-change="$ctrl.fun.watchFormLastChange({item:item,$index:$index})" {{placeholder}}>` +
          `<p class="eo-error-tips">${
            inputVal.errorTipHtml ? inputVal.errorTipHtml : inputVal.errorTip || `请填写${inputVal.thKey}`
          }</p>` +
          `</div>${fun.parseFloatBtnGroupHtml(
            'input',
            inputKey,
            inputVal.btnList,
            " ng-style=\"{'left':(5+15*item.listDepth+($ctrl.data.shrinkBtnLength?25:0))+'px','width':'calc(100% - '+(20+15*item.listDepth+($ctrl.data.shrinkBtnLength?25:0))+'px)'}\""
          )}</div>`;
        break;
      }
      case 'thHtml': {
        tmpThHtml += `<div class="plr5 {{class}}" ${inputVal.itemExpression || ''} >${inputVal.thHtml}</div>`;
        tmpHtml += `<div class="td-tbd text-td-tbd plr5 {{class}}" ${inputVal.itemExpression || ''} ${
          inputVal.title ? `title="${inputVal.title}"` : `title="{{item.${inputVal.modelKey}}}"`
        }>{{item.${inputVal.modelKey}}}</div>`;
        break;
      }
      case 'html': {
        // 正则匹配 hover 时需要展示的 title
        //   const commonTitleReg = /^\{\{item.*\}\}$/;
        //   let extractTitle = '';
        //   const tmpHtml = inputVal.html;
        //   console.log(commonTitleReg.test(inputVal.html), inputVal.html);
        //   if (commonTitleReg.test(inputVal.html)) {
        //     extractTitle = inputVal.html;
        //   } else {
        //     extractTitle = '';
        //   }

        tmpThHtml += `<div class="plr5 {{class}}"  ${inputVal.itemExpression || ''} $_filter_expression>${
          inputVal.thKey
        }
                    ${tmpDragThHtml}${tmpSortAndFilterHtml}
                    </div>`;
        if (typeof inputVal.html === 'string') {
          tmpHtml += `<div class="td-tbd text-td-tbd plr5 {{class}}" $_filter_expression ${
            inputVal.itemExpression || ''
          } ${inputVal.title ? `title="${inputVal.title}"` : ''}>${inputVal.html.replace(
            /eoPlaceholderIndex/g,
            inputKey
          )}</div>`;
        } else if (inputVal.html) {
          tmpHtml = [];
          for (const key in inputVal.html) {
            tmpHtml.push(`<div class="td-tbd text-td-tbd plr5 {{class}}">${inputVal.html[key]}</div>`);
          }
        }

        break;
      }
      case 'text': {
        tmpThHtml += `<div class="plr5 {{class}}"  $_filter_expression ${inputVal.itemExpression || ''} >${
          inputVal.thKey || ''
        }${tmpDragThHtml}</div>`;
        if (typeof inputVal.modelKey === 'string') {
          tmpHtml += `<div ${
            vm.mainObject.setting.showTextTitle ? `title="{{item.${inputVal.modelKey}}}"` : ''
          }  class="td-tbd text-td-tbd plr5 {{class}}" $_filter_expression ${inputVal.itemExpression || ''} ${
            inputVal.title ? `title="${inputVal.title}"` : `title="{{item.${inputVal.modelKey}}}"`
          }>{{item.${inputVal.modelKey}}}</div>`;
        } else if (inputVal.modelKey) {
          tmpHtml = [];
          for (const key in inputVal.modelKey) {
            tmpHtml.push(
              `<div ${
                vm.mainObject.setting.showTextTitle ? `title="{{item.${inputVal.modelKey[key]}}}"` : ''
              } class="td-tbd text-td-tbd plr5 {{class}}" ${inputVal.itemExpression || ''}>{{item.${
                inputVal.modelKey[key]
              }}}</div>`
            );
          }
        }
        break;
      }
      case 'sort': {
        vm.data.sort = true;
        vm.data.sortAuthorityVar = inputVal.authority || '';
        tmpThHtml += `<div ${inputVal.itemExpression || ''} class="sort-handle-th po_re ${inputVal.class || ''}" ${
          inputVal.authority ? `ng-if="$ctrl.authorityObject.${inputVal.authority}"` : ''
        }><span>${inputVal.thKey || ''}</span>${tmpSortAndFilterHtml || ''}</div>`;
        tmpHtml += `<div ${inputVal.itemExpression || ''}   class="sort-handle-td  ${inputVal.class || ''}" ${
          inputVal.authority ? `ng-if="$ctrl.authorityObject.${inputVal.authority}"` : ''
        }><div class="dp_ib" sv-group-handle  ${
          inputVal.itemHandleExpression || ''
        }  ><span class="iconfont icon-unfold-more" sv-handle ${
          inputVal.isWantToPrepareWhenSort ? 'ng-mousedown="$ctrl.fun.sortMouseDown($event,$partIndex)"' : ''
        }></span></div></div>`;
        break;
      }
      case 'radio': {
        data.radioClickAffectTotalItem = inputVal.radioClickAffectTotalItem || false;
        data.radioOriginalIndex = vm.mainObject.setting.radioOriginalType || 0;
        data.radioTdIndex = inputKey;
        if (inputVal.isWantedToExposeObject) {
          // 是否希望绑定/暴露内置变量
          vm.data.checkboxTdObject = vm.activeObject = Object.assign({}, vm.data.checkboxTdObject, vm.activeObject);
        }
        tmpThHtml += `<div class="checkbox-th {{class}}">${inputVal.thKey}</div>`;
        tmpHtml += `<div class="checkbox-td td-tbd va-top-td-tbd {{class}}" ${
          inputVal.itemExpression || ''
        } ><span class="${
          inputVal.itemDisabledExpression ? `{{${inputVal.itemDisabledExpression}}}` : 'input-radio'
        } eo-checkbox iconfont ${inputVal.thKey ? 'inline_cth' : 'block_cth'}" eo-attr-td-index="${inputKey}" ${
          tmpAuthorityHtml || ''
        }>${
          inputVal.modelKey
            ? `{{item.${inputVal.modelKey}?"&#xeb14;":""}}`
            : `{{$ctrl.data.checkboxTdObject.indexAddress[item.${inputVal.activeKey}]?"&#xeb14;":""}}`
        }</span></div>`;
        // tmpHtml += '<div class="checkbox-td td-tbd va-top-td-tbd {{class}}"><span class="input-radio eo-checkbox iconfont ' + (inputVal.thKey ? 'inline_cth' : 'block_cth') + '" eo-attr-td-index="' + inputKey + '">{{item.' + inputVal.modelKey + '?"&#xeb14;":""}}</span></div>';
        break;
      }
      case 'relationalCheckbox': {
        // 关系型checkbox
        data.relationalCheckboxTdIndex = inputKey;
        // $rootScope.global.$watch.push($scope.$watch('$ctrl.list', fun.watchRelationalCheckboxChange, true));
        $scope.$watch('$ctrl.list', fun.watchRelationalCheckboxChange, true);
        const tmpAuthorityHtml = inputVal.authority
          ? `ng-class="{'disable-checkbox':!$ctrl.authorityObject.${inputVal.authority}}" `
          : '';
        tmpThHtml += `<div class="checkbox-th {{class}}" ${
          inputVal.thItemExpression || ''
        }  ><span class="eo-checkbox iconfont ${
          inputVal.thKey ? 'inline_cth' : 'block_cth'
        }" ng-click="$ctrl.fun.selectAll(${inputKey})" ${
          tmpAuthorityHtml || ''
        }>{{$ctrl.mainObject.tdList[${inputKey}].selectAll?"&#xeb14;":"&nbsp;"}}</span>${
          inputVal.thKey ? `<span class="desc-cth">${inputVal.thKey}</span>` : ''
        }</div>`;
        tmpHtml += `<div class="checkbox-td td-tbd va-top-td-tbd {{class}}" ${
          inputVal.itemExpression || ''
        } ><span class="${
          inputVal.itemDisabledExpression ? `{{${inputVal.itemDisabledExpression}}}` : 'relational-checkbox'
        } eo-checkbox iconfont ${inputVal.thKey ? 'inline_cth' : 'block_cth'}" eo-attr-td-index="${inputKey}" ${
          tmpAuthorityHtml || ''
        }>{{item.${inputVal.modelKey}?"&#xeb14;":""}}</span></div>`;
        break;
      }
      case 'checkbox': {
        data.checkboxClickAffectTotalItem = inputVal.checkboxClickAffectTotalItem || false;
        if (data.checkboxTdIndex !== undefined) {
          switch (typeof data.checkboxTdIndex) {
            case 'string': {
              data.checkboxTdIndex = [data.checkboxTdIndex, inputKey];
              break;
            }
            default: {
              data.checkboxTdIndex.push(inputKey);
              break;
            }
          }
        } else {
          data.checkboxTdIndex = inputKey;
        }
        if (inputVal.wantToWatchListLength) {
          // $rootScope.global.$watch.push($scope.$watch('$ctrl.list.length', fun.watchCheckboxChange, true));
          $scope.$watch('$ctrl.list.length', fun.watchCheckboxChange, true);
        }
        if (inputVal.modelKey) {
          // $rootScope.global.$watch.push($scope.$watch('$ctrl.list', fun.watchCheckboxChange, true));
          $scope.$watch('$ctrl.list', fun.watchCheckboxChange, true);
        }
        let tmpSelectAllStr;
        if (inputVal.isWantedToExposeObject) {
          // 是否希望绑定/暴露内置变量
          // $rootScope.global.$watch.push($scope.$watch('$ctrl.data.checkboxTdObject.isOperating', fun.watchCheckboxChange));
          $scope.$watch('$ctrl.data.checkboxTdObject.isOperating', fun.watchCheckboxChange);
          vm.data.checkboxTdObject = vm.activeObject = Object.assign({}, vm.data.checkboxTdObject, vm.activeObject);
          tmpSelectAllStr = '{{$ctrl.data.checkboxTdObject.selectAll?"&#xeb14;":"&nbsp;"}}';
        } else {
          tmpSelectAllStr = `{{$ctrl.mainObject.tdList[${inputKey}].selectAll?"&#xeb14;":"&nbsp;"}}`;
        }
        vm.data.checkboxTdObject.isOperating = vm.data.checkboxTdObject.hasOwnProperty('isOperating')
          ? vm.data.checkboxTdObject.isOperating
          : true;
        var tmpAuthorityHtml =
          inputVal.authority || inputVal.itemDisabledExpression
            ? `ng-class="${
                inputVal.itemDisabledExpression && inputVal.itemDisabledExpression.indexOf('input-checkbox') > -1
                  ? inputVal.itemDisabledExpression
                  : `{'disable-checkbox':${inputVal.authority ? `!$ctrl.authorityObject.${inputVal.authority}||` : ''}${
                      inputVal.itemDisabledExpression
                    }}`
              }"`
            : '';
        tmpThHtml += `<div class="checkbox-th {{class}}" $_filter_expression ${inputVal.thItemExpression || ''}>${
          inputVal.hideSelectAll
            ? ''
            : `<span class="eo-checkbox iconfont ${
                inputVal.thKey ? 'inline_cth' : 'block_cth'
              }" ng-click="$ctrl.fun.selectAll(${inputKey})" ${tmpAuthorityHtml || ''}>${tmpSelectAllStr}</span>`
        }${
          inputVal.thKey
            ? `<span class="desc-cth ${inputVal.hideSelectAll ? 'hide_select_all_desc_cth' : ''}">${
                inputVal.thKey
              }</span>`
            : ''
        }${tmpDragThHtml}</div>`;
        tmpHtml += `<div class="checkbox-td td-tbd va-top-td-tbd {{class}}" $_filter_expression ${
          inputVal.itemExpression || ''
        }>
                    <span ${inputVal.checkboxExpression}
                     class="${
                       inputVal.itemDisabledExpression ? `{{${inputVal.itemDisabledExpression}}}` : 'input-checkbox'
                     } eo-checkbox iconfont ${inputVal.thKey ? 'inline_cth' : 'block_cth'}"
                        eo-attr-td-index="${inputKey}" ${tmpAuthorityHtml || ''}>${
          inputVal.modelKey
            ? `{{${
                inputVal.modelValueArr
                  ? `item.${inputVal.modelKey}===${
                      typeof inputVal.modelValueArr[1] === 'string'
                        ? `"${inputVal.modelValueArr[1]}"`
                        : inputVal.modelValueArr[1]
                    }`
                  : `item.${inputVal.modelKey}`
              }?"&#xeb14;":""}}`
            : `{{$ctrl.data.checkboxTdObject.indexAddress[item.${inputVal.activeKey}]?"&#xeb14;":""}}`
        }</span></div>`;
        break;
      }
      case 'cbtn':
      case 'btn': {
        if (inputVal.isDropMenu) {
          if (inputVal.defaultConf) {
            inputVal.thKey = `<button ng-if="!$ctrl.otherObject.isXml&&!$ctrl.otherObject.isHsf" class="btn_more_safldc" type="button" eo-drop-elem text-arr='${JSON.stringify(
              [
                {
                  key: '在顶部插入参数',
                  opr: 'insert_top',
                },
                {
                  key: '在底部插入参数',
                  opr: 'insert_bottom',
                },
                {
                  key: '清空',
                  opr: 'clear',
                },
              ]
            )}' fn-click="$ctrl.fun.moreItemClick(target,itemEvent)"><span class="iconfont icon-caidan"></span></button>`;
          } else {
            inputVal.thKey = '&nbsp;';
          }
        }
        tmpThHtml += `<div ${inputVal.itemExpression || ''}   class="{{class}} plr5" ${
          inputVal.authority ? `ng-if="$ctrl.authorityObject.${inputVal.authority}"` : ''
        }>${inputVal.thKey || vm.listBlockVarible.operate}</div>`;
        tmpHtml += `<div ${inputVal.itemExpression || ''} class="${
          inputVal.isDropMenu ? 'drop_menu_opr_td_tbd' : 'operate-td-tbd'
        } va-top-td-tbd td-tbd {{class}} plr5" ${
          inputVal.authority ? `ng-if="$ctrl.authorityObject.${inputVal.authority}"` : ''
        }><div class="f_row" ng-hide="$last&&!$ctrl.mainObject.setting.munalHideOperateColumn&&$ctrl.data.isEditTable">`;
        for (const btnKey in inputVal.btnList) {
          const btnVal = inputVal.btnList[btnKey];
          switch (btnVal.type) {
            case 'more': {
              vm.data.moreBtnObj[`${inputKey}_${btnKey}`] = [];
              for (const btnFunKey in btnVal.funArr) {
                const btnFunVal = btnVal.funArr[btnFunKey];
                const tmpItem = {
                  key: btnFunVal.key,
                  btnKey,
                  tdKey: inputKey,
                  btnFunKey,
                  expression: btnFunVal.itemExpression,
                  opr: btnFunVal.operateName,
                };
                vm.data.moreBtnObj[`${inputKey}_${btnKey}`].push(tmpItem);
              }
              tmpHtml +=
                `<div class="more-btn-container" ${btnVal.itemExpression || ''} ${
                  btnVal.authority ? `ng-if="$ctrl.authorityObject.${btnVal.authority}"` : ''
                } eo-attr-btn-index="${btnKey}" eo-attr-td-index="${inputKey}">` +
                `<button type="button" ${
                  inputVal.isDropMenu
                    ? `other-obj="{target:item${
                        inputVal.dropOtherObjExpression ? `,${inputVal.dropOtherObjExpression}` : ''
                      }}"`
                    : ''
                } eo-drop-elem text-arr="$ctrl.data.moreBtnObj['${inputKey}_${btnKey}']" fn-click="$ctrl.fun.moreItemClick(target,itemEvent,$index,$partIndex)" class="${
                  inputVal.isDropMenu ? 'btn_more_safldc' : `more-btn eo-operate-btn ${btnVal.class || ''}`
                }" ${btnVal.btnItemExpression || ''}>${
                  inputVal.isDropMenu
                    ? '<span class="iconfont icon-caidan"></span>'
                    : `<span>${btnVal.key || btnVal.html}</span><span class="iconfont icon-chevron-down"></span>`
                }</button></div>`;
              break;
            }
            case 'html': {
              tmpHtml += `<div ${btnVal.class ? `class="${btnVal.class}"` : ''} ${btnVal.itemExpression || ''} >${
                btnVal.html
              }</div>`;
              break;
            }
            default: {
              tmpHtml += `<button type="button" ${
                btnVal.authority ? `ng-if="$ctrl.authorityObject.${btnVal.authority}"` : ''
              } class="${inputVal.type === 'cbtn' ? 'c' : ''}btn-${btnVal.operateName} eo-operate-btn ${
                btnVal.class || ''
              }" ${btnVal.itemExpression || ''} eo-attr-btn-index="${btnKey}" eo-attr-td-index="${inputKey}">${
                btnVal.key || btnVal.html
              }</button>`;
              break;
            }
          }
        }
        tmpHtml += '</div></div>';
        break;
      }
      case 'selectMulti': {
        vm.data.isEditTable = true;
        tmpThHtml += `<div class="plr5 {{class}}" ${inputVal.thItemExpression || ''}>${inputVal.thKey}</div>`;
        tmpHtml += `<div class="td-tbd plr5 va-top-td-tbd {{class}}" ${
          inputVal.itemExpression || ''
        }><select-multi-common-component  model-arr="item.${
          inputVal.modelKey
        }" main-object="$ctrl.mainObject.tdList[${inputKey}].selectMultiObject" list="$ctrl.mainObject.tdList[${inputKey}].selectQuery"></select-multi-common-component></div>`;
        break;
      }
      case 'select': {
        vm.data.isEditTable = true;
        if (vm.mainObject.setting && vm.mainObject.setting.draggableWithSelect) {
          inputVal.mainObj = inputVal.mainObj || {
            isNeedToResetPosition: true,
          };
        }
        tmpThHtml += `<div class="plr5 {{class}}" $_filter_expression ${inputVal.tdItemExpression || ''} ${
          inputVal.thItemExpression || ''
        }>${inputVal.thKey}${tmpDragThHtml}</div>`;
        tmpHtml += `<div class="td-tbd plr5 va-top-td-tbd select_conatiner_lbcc {{class}}" $_filter_expression ${
          inputVal.itemExpression || ''
        } ${inputVal.tdItemExpression || ''}>${inputVal.leftHtml || ''}<select-default-common-component ${
          inputVal.mainObj ? `main-object="$ctrl.mainObject.tdList[${inputKey}].mainObj"` : ''
        } output="item" ${
          vm.mainObject.setting.readonly ? 'disabled=true' : inputVal.disabled ? `disabled="${inputVal.disabled}"` : ''
        }${inputVal.multiple ? 'multiple=true' : ''} input="{index:$index,query:${
          (inputVal.selectQueryExpression || '').replace('eoPlaceholderIndex', inputKey) ||
          `$ctrl.mainObject.tdList[${inputKey}].selectQuery`
        },key:'${inputVal.key || 'key'}', value:'${inputVal.value || 'value'}'${
          inputVal.initialData ? `,initialData:${inputVal.initialData}` : ''
        }}" model-key="${
          inputVal.modelKey
        }" input-change-fun="$ctrl.fun.watchFormLastChange({item:item,$index:$index},$ctrl.mainObject.tdList[${inputKey}].fun)" required=true></select-default-common-component></div>`;
        break;
      }
      case 'input': {
        vm.data.isEditTable = true;
        tmpThHtml += `<div  class="plr5 {{class}}" $_filter_expression ${inputVal.tdItemExpression || ''}>${
          inputVal.thKey
        } ${tmpDragThHtml}</div>`;
        tmpHtml +=
          `<div  class="td-tbd input-tbd va-top-td-tbd plr5 {{class}}" $_filter_expression ${
            inputVal.directiveExpression || ''
          } ${inputVal.tdItemExpression || ''} >` +
          `<input ng-trim="${
            inputVal.trim || true
          }" ng-readonly="$ctrl.mainObject.setting.readonly" autocomplete="off" ${
            inputVal.maxlength ? `maxlength="${inputVal.maxlen}"` : ''
          } type="${inputVal.inputType || 'text'}" ${inputVal.itemExpression || ''}  class="eo-input" ng-model="item.${
            inputVal.modelKey
          }" ng-change="${
            inputVal.changeFun
              ? `$ctrl.mainObject.tdList[${inputKey}].changeFun({item:item,$index:$index},$ctrl.fun.watchFormLastChange)"`
              : '$ctrl.fun.watchFormLastChange({item:item,$index:$index})"'
          } {{placeholder}} ${
            inputVal.title ? `title="${inputVal.title}"` : `title="{{item.${inputVal.modelKey}}}"`
          }>` +
          `<p class="eo-error-tips">${
            inputVal.errorTipHtml
              ? inputVal.errorTipHtml
              : inputVal.errorTip || `请填写${inputVal.thKey.indexOf('</') > -1 ? '内容' : inputVal.thKey}`
          }</p>${fun.parseFloatBtnGroupHtml('input', inputKey, inputVal.btnList)}</div>`;
        break;
      }
      case 'autoComplete': {
        vm.data.isEditTable = true;
        if (vm.mainObject.setting && vm.mainObject.setting.draggableWithSelect) {
          inputVal.setting = inputVal.setting || {
            isNeedToResetPosition: true,
          };
        }
        tmpThHtml += `<div class="plr5 {{class}}" ${inputVal.tdItemExpression || ''} $_filter_expression>${
          inputVal.thKey
        } ${tmpDragThHtml}</div>`;
        tmpHtml += `${
          `<div class="td-tbd acp-tbd va-top-td-tbd plr5 {{class}} select_conatiner_lbcc" $_filter_expression ${
            inputVal.tdItemExpression || ''
          } ${inputVal.itemExpression || ''} ${inputVal.directiveExpression || ''}>` +
          `<auto-complete-component ${inputVal.required ? `required="${inputVal.required}"` : ''} ${
            inputVal.setting ? `setting="$ctrl.mainObject.tdList[${inputKey}].setting"` : ''
          } ${inputVal.readonly ? `read-only="${inputVal.readonly}"` : ''} model="item" key-name="${
            inputVal.modelKey
          }" array="${
            typeof inputVal.selectQuery === 'string'
              ? inputVal.selectQuery
              : `$ctrl.mainObject.tdList[${inputKey}].selectQuery`
          }" input-change-fun="$ctrl.fun.watchFormLastChange({item:item,$index:$index},$ctrl.mainObject.tdList[${inputKey}].fun)" {{placeholder}} ${
            inputVal.blurFun
              ? ` input-blur-fun="$ctrl.mainObject.tdList[${inputKey}].blurFun({item:item,$index:$index})"`
              : ''
          } ${
            inputVal.title ? `title="${inputVal.title}"` : `title="{{item.${inputVal.modelKey}}}"`
          }></auto-complete-component>` +
          `<p class="eo-error-tips">${
            inputVal.errorTipHtml ? inputVal.errorTipHtml : inputVal.errorTip || `请填写${inputVal.thKey}`
          }</p>`
        }${fun.parseFloatBtnGroupHtml('acp', inputKey, inputVal.btnList)}</div>`;
        break;
      }
      case 'autoCompleteAndFile': {
        vm.data.isEditTable = true;
        let tmpFileInputHtml = '';
        const tmpFilePlaceholder = inputVal.filePlaceholder || '请选择文件';
        const tmpFileBtnText = inputVal.fileBtnText || '选择文件';
        if (vm.mainObject.setting && vm.mainObject.setting.draggableWithSelect) {
          inputVal.setting = inputVal.setting || {
            isNeedToResetPosition: true,
          };
        }
        if (inputVal.munalDefineFileFun) {
          tmpFileInputHtml =
            `<input ng-trim="${true}" autocomplete="off" class="eo-input text-input" type="text" ng-model="item.${
              inputVal.modelKey
            }" disabled="true" placeholder="${tmpFilePlaceholder}">` +
            `<button type="button" class="file-btn-lbt" ng-click="importFile({item:item})">${tmpFileBtnText}</button>`;
        } else {
          tmpFileInputHtml =
            `<input ng-trim="${true}" autocomplete="off" class="eo-input text-input" type="text" ng-model="item.${
              inputVal.modelKey
            }" disabled="true" placeholder="${tmpFilePlaceholder}">` +
            '<input autocomplete="off" type="file" class="file-input" onchange="angular.element(this).scope().importFile({file:this.files},this)" multiple="multiple">' +
            `<button type="button" class="file-btn-lbt">${tmpFileBtnText}</button>`;
        }
        tmpThHtml += `<div class="plr5 {{class}}" $_filter_expression ${inputVal.thItemExpression || ''}>${
          inputVal.thKey
        } ${tmpDragThHtml}</div>`;
        tmpHtml +=
          `<div class="td-tbd plr5  va-top-td-tbd {{class}} ${
            inputVal.btnList ? 'acp-and-file-tbd_re' : 'acp-and-file-tbd'
          }" $_filter_expression ${inputVal.itemExpression || ''} ${
            inputVal.directiveExpression ? `${inputVal.directiveExpression}` : ''
          } ng-switch="item.${inputVal.switchVar}">` +
          `<div class="file-div" ng-switch-when="${inputVal.swicthFile}">${tmpFileInputHtml}</div>` +
          `<div ng-switch-default><auto-complete-component title="{{item.${inputVal.modelKey}}}" ${
            inputVal.setting ? `setting="$ctrl.mainObject.tdList[${inputKey}].setting"` : ''
          }  model="item" read-only="${inputVal.readonly}" key-name="${inputVal.modelKey}" array="${
            typeof inputVal.selectQuery === 'string'
              ? inputVal.selectQuery
              : `$ctrl.mainObject.tdList[${inputKey}].selectQuery`
          }" input-change-fun="$ctrl.fun.watchFormLastChange({item:item,$index:$index,list:$ctrl.list},$ctrl.mainObject.tdList[${inputKey}].fun)"  {{placeholder}}></auto-complete-component>${fun.parseFloatBtnGroupHtml(
            'acp',
            inputKey,
            inputVal.btnList
          )}</div></div>`;
        break;
      }
      default:
        break;
    }
    return {
      thHtml: tmpThHtml.replace('$_filter_expression', tmpFilterItemExpression || ''),
      tdHtml: tmpHtml.replace('$_filter_expression', tmpFilterItemExpression || ''),
    };
  };
  fun.initHtml = function () {
    vm.data.TAB_BLOCK_LIST_ARR = [];
    const tmp = {
      html: '',
      thHtml: '',
    };
    let tmpStaticHtml = '<div class="tr-tbd {{trClass}}" {{trDirective}} {{trNgClass}} >';
    try {
      tmpStaticHtml = tmpStaticHtml
        .replace('{{trClass}}', vm.mainObject.setting.trClass || '')
        .replace('{{trNgClass}}', vm.mainObject.setting.trNgClass || '')
        .replace('{{trDirective}}', vm.mainObject.setting.trDirective || '');
    } catch (REPLACE_ERR) {
      console.error(REPLACE_ERR);
    }
    for (const key in vm.mainObject.tdList) {
      const val = vm.mainObject.tdList[key];
      const tmpHtmlObject = fun.initItemHtml(val, key);
      // console.log(val, key);
      tmp.thHtml += tmpHtmlObject.thHtml.replace('{{class}}', val.blockDefinedClass || '');
      tmpStaticHtml += tmpHtmlObject.tdHtml
        .replace('{{class}}', val.blockDefinedClass || '')
        .replace('{{placeholder}}', val.placeholder ? `placeholder="${val.placeholder.trim()}"` : '');
    }
    tmp.html = `${
      vm.mainObject.setting.isForm
        ? `<ng-form name="ListBlockCommonComponentForm" ${vm.mainObject.setting.tbodyExpression || ''}>`
        : `<div get-Dom-Length-Common-Directive ${
            vm.mainObject.setting.tbodyExpression || ''
          } bind-Class="btn-shrink" model="$ctrl.data.shrinkBtnLength">`
    }${
      vm.mainObject.setting.blankTips
        ? `<div class="eo-none-tr tac" ng-show="$ctrl.list.length===0">${vm.mainObject.setting.blankTips}</div>`
        : ''
    } <div class="tr_container_tbd" ${
      vm.mainObject.setting.blankTips ? 'ng-show="$ctrl.list"' : ''
    } ng-repeat="($outerIndex,item) in ${
      vm.mainObject.setting && vm.mainObject.setting.dataType === 'object'
        ? '$ctrl.list'
        : `$ctrl.list.slice(0,${vm.data.MAX_OMIT_LIST_LENTH}*$ctrl.data.listPartIndex)`
    } track by $index"
                ${vm.data.isDepth ? `ng-hide="item.isHide" ng-if="!item.isHide"` : ''}
                sv-group-element="$ctrl.data.sortForm" eo-attr-index="{{$index}}" eo-attr-depth="{{item.listDepth}}"  {{trExpression}}>`;
    try {
      tmp.html = tmp.html.replace('{{trExpression}}', vm.mainObject.setting.trExpression || '');
    } catch (REPLACE_ERR) {
      console.error(REPLACE_ERR);
    }
    if (vm.mainObject.setting.draggable && !vm.mainObject.setting.hideLastDragTh) {
      tmp.thHtml += '<div ></div>';
      tmpStaticHtml += '<div class="td-tbd"></div>';
    }
    tmp.html += `${(vm.mainObject.extraTrHtml || '') + tmpStaticHtml}</div></div>${
      vm.mainObject.setting.isForm ? '</ng-form>' : '</div>'
    }`;
    vm.data.thHtml = tmp.thHtml;
    vm.data.html = tmp.html;
  };
  privateFun.init = () => {
    if (vm.mainObject && vm.mainObject.tdList) {
      vm.mainObject.setting = vm.mainObject.setting || {};
      vm.mainObject.baseFun = vm.mainObject.baseFun || {};
      if (vm.mainObject.setting.draggable) {
        try {
          const tmpOriginDragCacheObj = {};
          vm.mainObject.tdList.forEach((val) => {
            if (val.mark) {
              tmpOriginDragCacheObj[val.mark] =
                (typeof val.width === 'string' ? val.width : `${val.width}px`) || '150px';
            }
          });
          vm.data.dragCacheObj = Object.assign(
            {},
            tmpOriginDragCacheObj,
            JSON.parse(
              window.localStorage.getItem(
                vm.mainObject.setting.dragCacheVar ||
                  `${window.location.pathname.toUpperCase().replace(/\./g, '_')}_LIST_DRAG_VAR`
              )
            ) || {}
          );
          for (const key in vm.data.dragCacheObj) {
            if (vm.data.dragCacheObj[key] === '0px') {
              vm.data.dragCacheObj[key] = tmpOriginDragCacheObj[key];
            }
          }
        } catch (JSON_PARSE_ERROR) {
          console.error(JSON_PARSE_ERROR);
        }
      }
      fun.initHtml();
    }
  };
  vm.$onInit = function () {
    if (
      vm.mainObject.setting &&
      (vm.mainObject.setting.dragCacheVar || vm.mainObject.setting.filterStorageVar) &&
      !vm.mainObject.setting.disableToSetFilter
    ) {
      vm.data.filterStorageKey =
        vm.mainObject.setting.filterStorageVar ||
        (vm.mainObject.setting.dragCacheVar || '').replace('DRAG_VAR', 'FILTER_TAB_BLOCK_LIST') ||
        `${window.location.pathname.toUpperCase().replace(/\./g, '_')}_FILTER_TAB_BLOCK_LIST`;
      try {
        vm.data.bodyTabBlockObj.indexAddress = Object.assign(
          {},
          JSON.parse(window.localStorage.getItem(vm.data.filterStorageKey) || undefined),
          vm.data.bodyTabBlockObj.indexAddress
        );
        data.isAlreadyInitFilter = false;
      } catch (JSON_ERR) {}
    } else {
      vm.mainObject.setting = Object.assign(
        {},
        {
          hideFilter: true,
        },
        vm.mainObject.setting
      );
    }
    if (vm.mainObject.setting && vm.mainObject.setting.isChangeColumn) {
      // $rootScope.global.$watch.push($scope.$watch('$ctrl.mainObject.tdList', privateFun.init));
      $scope.$watch('$ctrl.mainObject.tdList', privateFun.init);
    } else if (vm.mainObject.setting && vm.mainObject.setting.isWatchTdListLength) {
      // $rootScope.global.$watch.push($scope.$watch('$ctrl.mainObject.tdList.length', privateFun.init));
      $scope.$watch('$ctrl.mainObject.tdList.length', privateFun.init);
    } else {
      privateFun.init();
    }
    // $rootScope.global.$watch.push($scope.$watch('(!$ctrl.data.sort)||($ctrl.data.sortAuthorityVar&&!$ctrl.authorityObject[$ctrl.data.sortAuthorityVar])||($ctrl.mainObject.setting.unsortableVar&&$ctrl.otherObject[$ctrl.mainObject.setting.unsortableVar])', () => {
    //     vm.data.isSortDisabled = (!vm.data.sort) || (vm.data.sortAuthorityVar && !vm.authorityObject[vm.data.sortAuthorityVar]) || (vm.mainObject.setting.unsortableVar && vm.otherObject[vm.mainObject.setting.unsortableVar]);
    // }));
    $scope.$watch(
      '(!$ctrl.data.sort)||($ctrl.data.sortAuthorityVar&&!$ctrl.authorityObject[$ctrl.data.sortAuthorityVar])||($ctrl.mainObject.setting.unsortableVar&&$ctrl.otherObject[$ctrl.mainObject.setting.unsortableVar])',
      () => {
        vm.data.isSortDisabled =
          !vm.data.sort ||
          (vm.data.sortAuthorityVar && !vm.authorityObject[vm.data.sortAuthorityVar]) ||
          (vm.mainObject.setting.unsortableVar && vm.otherObject[vm.mainObject.setting.unsortableVar]);
      }
    );
  };
  vm.fun.copy = () => {
    if (vm.mainObject.baseFun.copy) {
      return vm.mainObject.baseFun.copy(vm.list, vm.otherObject);
    }
  };
  vm.fun.import = () => {};
  fun.watchRelationalCheckboxChange = function () {
    if ((vm.list || []).length <= 0) return;
    const tmpModelItem = vm.mainObject.tdList[data.relationalCheckboxTdIndex];
    const tmpModelKey = tmpModelItem.modelKey;
    data.queryLength = 0;
    for (const key in vm.list) {
      if (vm.list[key][tmpModelKey]) {
        data.queryLength++;
      }
    }
    if ((vm.list || []).length === data.queryLength) {
      tmpModelItem.selectAll = true;
    } else {
      tmpModelItem.selectAll = false;
    }
  };
  /**
   * @desc 循环重置checkbox modelKey选中状态
   */
  fun.resetCheckbox = (inputTarget) => {
    const tmpModelKey = vm.mainObject.tdList[inputTarget].modelKey;
    const tmpActiveKey = vm.mainObject.tdList[inputTarget].activeKey;
    data.queryLength = 0;
    let listCanBeSelectLen = 0;
    if (tmpModelKey) {
      for (const key in vm.list) {
        let hasSelected = false;
        if (vm.mainObject.tdList[inputTarget].modelValueArr) {
          hasSelected =
            vm.list[key] && vm.list[key][tmpModelKey] === vm.mainObject.tdList[inputTarget].modelValueArr[1];
        } else {
          hasSelected = vm.list[key] && vm.list[key][tmpModelKey];
        }
        let tmpIsValid = true;
        if (vm.mainObject.tdList[inputTarget].checkIsValidItem) {
          if (
            !vm.mainObject.tdList[inputTarget].checkIsValidItem({
              item: vm.list[key],
            })
          ) {
            tmpIsValid = false;
          } else {
            listCanBeSelectLen++;
          }
        }
        if (hasSelected && tmpIsValid) {
          data.queryLength++;
        }
      }
      if (!vm.mainObject.tdList[inputTarget].checkIsValidItem) {
        listCanBeSelectLen = (vm.list || []).length;
      }
      if (listCanBeSelectLen === data.queryLength && listCanBeSelectLen != 0) {
        vm.mainObject.tdList[inputTarget].selectAll = true;
      } else {
        vm.mainObject.tdList[inputTarget].selectAll = false;
      }
    } else {
      let tmpFoucsLength = 0;
      data.queryLength = (vm.list || []).length;
      vm.data.checkboxTdObject.query = [];
      for (const key in vm.data.checkboxTdObject.indexAddress) {
        vm.data.checkboxTdObject.query.push(vm.mainObject.setting.checkboxKeyIsNum ? parseInt(key) : key);
      }
      for (const val of vm.list) {
        if (vm.data.checkboxTdObject.indexAddress[val[tmpActiveKey]]) tmpFoucsLength++;
      }
      if (tmpFoucsLength >= data.queryLength) {
        vm.data.checkboxTdObject.selectAll = true;
      } else {
        vm.data.checkboxTdObject.selectAll = false;
      }
    }
  };
  fun.watchCheckboxChange = function () {
    // vm.data.shrinkBtnLength=true;
    if ((vm.list || []).length <= 0) return;
    if (vm.data.checkboxTdObject.isOperating) {
      switch (typeof data.checkboxTdIndex) {
        case 'string': {
          fun.resetCheckbox(data.checkboxTdIndex);
          break;
        }
        default: {
          data.checkboxTdIndex.map((val) => {
            fun.resetCheckbox(val);
          });
          break;
        }
      }
    }
    if (vm.mainObject.baseFun && vm.mainObject.baseFun.watchCheckboxChange) {
      vm.mainObject.baseFun.watchCheckboxChange();
    }
  };
  $scope.$on('$destroy', () => {
    $scope.$destroy();
    $element.remove();
    vm = null;
    indexController = null;
  });
}
