import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintAddComponent } from './complaint-add.component';

describe('ComplaintAddComponent', () => {
  let component: ComplaintAddComponent;
  let fixture: ComponentFixture<ComplaintAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
