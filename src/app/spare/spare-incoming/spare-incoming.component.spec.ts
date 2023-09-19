import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpareIncomingComponent } from './spare-incoming.component';

describe('SpareIncomingComponent', () => {
  let component: SpareIncomingComponent;
  let fixture: ComponentFixture<SpareIncomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpareIncomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpareIncomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
