import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiTestUtilService } from '../api-test-util.service';

import { ApiTestRestComponent } from './api-test-rest.component';

describe('ApiTestRestComponent', () => {
  let component: ApiTestRestComponent;
  let fixture: ComponentFixture<ApiTestRestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ApiTestUtilService],
      declarations: [ApiTestRestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestRestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
