import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineerAssignModelComponent } from './engineer-assign-model.component';

describe('EngineerAssignModelComponent', () => {
  let component: EngineerAssignModelComponent;
  let fixture: ComponentFixture<EngineerAssignModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineerAssignModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineerAssignModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
