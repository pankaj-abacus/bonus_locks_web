import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceInvoiceDetailComponent } from './service-invoice-detail.component';

describe('ServiceInvoiceDetailComponent', () => {
  let component: ServiceInvoiceDetailComponent;
  let fixture: ComponentFixture<ServiceInvoiceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceInvoiceDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceInvoiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
