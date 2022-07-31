import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'eo-split-x',
  template: `<div
    class="absolute top-0 flex flex-col justify-center bottom-[70px] w-[6px] z-[10] cursor-col-resize line"
    [ngStyle]="{ right: width + 'px' }"
    (mousedown)="handleMouseDown($event)"
  >
    <i></i><i></i><i></i><i></i>
  </div>`,
  styleUrls: ['./split-x.component.scss'],
})
export class SplitXComponent implements OnInit {
  @Input() init = [200, 250, 500];
  @Output() x = new EventEmitter();
  isListen = false;
  baseWith = 0;
  min = 0;
  max = 0;
  start = 0;
  width = 0;
  constructor() {}
  ngOnInit() {
    const [min, baseWith, max] = this.init;
    this.min = min;
    this.baseWith = baseWith;
    this.width = baseWith;
    this.max = max;
    document.addEventListener('mousemove', (e) => {
      if (!this.isListen) {
        return;
      }
      const move = e.clientX;
      const width = move >= this.baseWith ? this.baseWith - (move - this.start) : this.baseWith + (this.start - move);
      this.width = this.countMinMax(width, [this.min, this.max]);
      this.x.emit(this.width);
    });
    document.addEventListener('mouseup', (e) => {
      if (!this.isListen) {
        return;
      }
      this.isListen = false;
      this.baseWith = this.width;
      document.documentElement.style.userSelect = '';
    });
  }
  countMinMax(current, range) {
    const [min, max] = range;
    if (current < min) {
      return min;
    }
    if (current > max) {
      return max;
    }
    return current;
  }
  handleMouseDown(e) {
    this.isListen = true;
    this.start = e.clientX;
    document.documentElement.style.userSelect = 'none';
  }
}
