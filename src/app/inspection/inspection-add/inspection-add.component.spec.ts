import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionAddComponent } from './inspection-add.component';

describe('InspectionAddComponent', () => {
  let component: InspectionAddComponent;
  let fixture: ComponentFixture<InspectionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
