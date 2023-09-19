import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareAssignQtyComponent } from './spare-assign-qty.component';

describe('SpareAssignQtyComponent', () => {
  let component: SpareAssignQtyComponent;
  let fixture: ComponentFixture<SpareAssignQtyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpareAssignQtyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareAssignQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
