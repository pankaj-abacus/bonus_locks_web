import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareOutgoingComponent } from './spare-outgoing.component';

describe('SpareOutgoingComponent', () => {
  let component: SpareOutgoingComponent;
  let fixture: ComponentFixture<SpareOutgoingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpareOutgoingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareOutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
