import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnDataComponent } from './return-data.component';

describe('ReturnDataComponent', () => {
  let component: ReturnDataComponent;
  let fixture: ComponentFixture<ReturnDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
