import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../../../shared/services/modal.service';
import { ApiDetailUtilService } from '../api-detail-util.service';

import { ApiDetailQueryComponent } from './api-detail-query.component';

describe('ApiDetailQueryComponent', () => {
  let component: ApiDetailQueryComponent;
  let fixture: ComponentFixture<ApiDetailQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[ApiDetailUtilService,{provide:ModalService,useValue:{}}],
      declarations: [ ApiDetailQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDetailQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
