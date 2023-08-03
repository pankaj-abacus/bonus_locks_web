import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMasterBoxComponent } from './generate-master-box.component';

describe('GenerateMasterBoxComponent', () => {
  let component: GenerateMasterBoxComponent;
  let fixture: ComponentFixture<GenerateMasterBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateMasterBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateMasterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
