import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../../../shared/services/modal.service';
import { ApiDetailUtilService } from '../api-detail-util.service';

import { ApiDetailHeaderComponent } from './api-detail-header.component';

describe('ApiDetailHeaderComponent', () => {
  let component: ApiDetailHeaderComponent;
  let fixture: ComponentFixture<ApiDetailHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[ApiDetailUtilService,{provide:ModalService,useValue:{}}],
      declarations: [ ApiDetailHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
