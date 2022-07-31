import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  OnDestroy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { EoMonacoEditorComponent } from 'eo/workbench/browser/src/app/shared/components/monaco-editor/monaco-editor.component';

import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import type { TreeNode, FlatNode } from './constant';

@Component({
  selector: 'eo-api-script',
  templateUrl: './api-script.component.html',
  styleUrls: ['./api-script.component.scss'],
})
export class ApiScriptComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() code = '';
  @Input() treeData = [];
  @Input() completions = [];
  @Output() codeChange: EventEmitter<any> = new EventEmitter();
  @ViewChild(EoMonacoEditorComponent, { static: false }) eoEditor?: EoMonacoEditorComponent;
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;

  selectListSelection = new SelectionModel<FlatNode>(true);

  dataSource: NzTreeNodeOptions[] = [];
  expandedKeys = [0];

  private resizeObserver: ResizeObserver;
  private readonly el: HTMLElement;

  constructor(elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }
  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.eoEditor?.rerenderEditor();
    });
    this.resizeObserver.observe(this.el);
  }

  nzClick($event) {
    const { node } = $event;
    if (node.isLeaf) {
      // * insert code
      return;
    }
    // *  expand node
    if (this.expandedKeys.includes(node.key)) {
      this.expandedKeys = this.expandedKeys.filter((it) => it !== node.key);
      node.isExpanded = false;
      return;
    }
    this.expandedKeys = [...this.expandedKeys, node.key];
  }
  ngOnInit(): void {
    this.dataSource = this.treeData.map(({ name, children, ...it }, index) => ({
      title: name,
      key: index,
      name,
      children: children.map(({ caption, ...child }, i) => ({
        title: child.name,
        key: caption + i,
        caption,
        ...child,
        isLeaf: true,
      })),
      ...it,
    }));
  }

  handleChange(code) {
    this.codeChange.emit(code);
  }

  insertCode = (event) => {
    console.log('isertCode', event);
    const { value } = event.origin;
    this.eoEditor.handleInsert(value);
  };

  getCode = () => this.code;
}
