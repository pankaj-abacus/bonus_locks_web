import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMasterBoxDispatchDetailComponent } from './view-master-box-dispatch-detail.component';

describe('ViewMasterBoxDispatchDetailComponent', () => {
  let component: ViewMasterBoxDispatchDetailComponent;
  let fixture: ComponentFixture<ViewMasterBoxDispatchDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMasterBoxDispatchDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMasterBoxDispatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
