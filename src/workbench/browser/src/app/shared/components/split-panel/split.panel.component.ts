import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';

type EventListener = HTMLElement['removeEventListener'] | HTMLElement['addEventListener'];
@Component({
  selector: 'eo-split-panel',
  templateUrl: './split.panel.component.html',
  styleUrls: ['./split.panel.component.scss'],
})
export class SplitPanelComponent implements OnInit, OnDestroy {
  @Input() direction: 'column' | 'row' = 'column';
  @Input() topStyle;
  @Input() bottomStyle;
  @Input() hideSeparator = false;

  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;

  maxRightWidth: number;

  @ViewChild('scalable') scalableRef: ElementRef;
  @ViewChild('bottomRef') bottomRef: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  // 拖拽中
  onDrag = (e: MouseEvent) => {
    const scalableEl = this.scalableRef.nativeElement;
    const bottomEl = this.bottomRef.nativeElement;
    if (scalableEl) {
      if (this.direction === 'column') {
        scalableEl.style.height = `${this.startHeight + e.clientY - this.startY}px`;
        bottomEl.style.height = `calc(100% - 12px - ${scalableEl.style.height})`;
      } else {
        scalableEl.style.width = `${this.startWidth + e.clientX - this.startX}px`;
        bottomEl.style.width = `calc(100% - 12px - ${scalableEl.style.width})`;
      }
    }
  };

  // 拖拽结束
  dragEnd = () => {
    document.documentElement.style.userSelect = 'unset';
    this.handleEventListener('remove');
  };

  // 鼠标按下
  startDrag = (e: MouseEvent) => {
    this.startY = e.clientY;
    this.startX = e.clientX;
    const scalableEl = this.scalableRef.nativeElement;

    if (scalableEl) {
      this.startWidth = parseInt(window.getComputedStyle(scalableEl).width, 10);
      this.startHeight = parseInt(window.getComputedStyle(scalableEl).height, 10);
    }

    document.documentElement.style.userSelect = 'none';
    this.handleEventListener('add');
  };

  handleEventListener = (type: 'add' | 'remove') => {
    const eventListener = document.documentElement[`${type}EventListener`] as EventListener;
    eventListener('mousemove', this.onDrag);
    eventListener('mouseup', this.dragEnd);
  };
}
