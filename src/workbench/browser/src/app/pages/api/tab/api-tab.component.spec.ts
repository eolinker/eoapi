import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../shared/services/message';

import { ApiTabComponent } from './api-tab.component';
import { ApiTabStorageService } from '../api-tab.service';

describe('ApiTabComponent', () => {
  let component: ApiTabComponent;
  let fixture: ComponentFixture<ApiTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ApiTabStorageService,
        MessageService,
        { provide: Router, useValue: { url: '' } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { uuid: 1 } } } },
      ],
      declarations: [ApiTabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
