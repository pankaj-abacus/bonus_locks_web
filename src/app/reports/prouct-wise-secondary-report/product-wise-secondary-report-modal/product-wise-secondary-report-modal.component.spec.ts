import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWiseSecondaryReportModalComponent } from './product-wise-secondary-report-modal.component';

describe('ProductWiseSecondaryReportModalComponent', () => {
  let component: ProductWiseSecondaryReportModalComponent;
  let fixture: ComponentFixture<ProductWiseSecondaryReportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductWiseSecondaryReportModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWiseSecondaryReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
