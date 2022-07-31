import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../../../shared/services/modal.service';
import { ApiDetailUtilService } from '../api-detail-util.service';

import { ApiDetailRestComponent } from './api-detail-rest.component';

describe('ApiDetailRestComponent', () => {
  let component: ApiDetailRestComponent;
  let fixture: ComponentFixture<ApiDetailRestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[ApiDetailUtilService,{provide:ModalService,useValue:{}}],
      declarations: [ ApiDetailRestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDetailRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
