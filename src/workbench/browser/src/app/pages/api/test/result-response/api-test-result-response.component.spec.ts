import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiTestUtilService } from '../api-test-util.service';
import { ApiTestResultResponseComponent } from './api-test-result-response.component';
import { ByteToStringPipe } from './get-size.pipe';

describe ('ApiTestResultResponseComponent', () => {
  let component: ApiTestResultResponseComponent;
  let fixture: ComponentFixture<ApiTestResultResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [ApiTestUtilService],
      declarations: [ApiTestResultResponseComponent, ByteToStringPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiTestResultResponseComponent);
    component = fixture.componentInstance;
    component.model = { responseType: 'text', responseLength: 1024, statusCode: 200,testDeny:200 };
    component.ngOnChanges({
      model: {},
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have dom with Size,StatusCode,Time', () => {
    expect(fixture.nativeElement.querySelector('#statusCode').textContent).toEqual('200');
    expect(fixture.nativeElement.querySelector('#size').textContent).toContain('1.00KB');
    expect(fixture.nativeElement.querySelector('#time').textContent).toContain('200ms');
  });
});
