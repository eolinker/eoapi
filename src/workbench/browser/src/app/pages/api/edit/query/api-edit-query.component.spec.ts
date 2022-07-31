import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ModalService } from '../../../../shared/services/modal.service';
import { ApiEditUtilService } from '../api-edit-util.service';

import { ApiEditQueryComponent } from './api-edit-query.component';

describe('ApiEditQueryComponent', () => {
  let component: ApiEditQueryComponent;
  let fixture: ComponentFixture<ApiEditQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[NzModalModule],
      providers:[ApiEditUtilService,ModalService],
      declarations: [ ApiEditQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEditQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
