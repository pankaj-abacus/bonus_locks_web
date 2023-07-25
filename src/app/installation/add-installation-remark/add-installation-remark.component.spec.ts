import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInstallationRemarkComponent } from './add-installation-remark.component';

describe('AddInstallationRemarkComponent', () => {
  let component: AddInstallationRemarkComponent;
  let fixture: ComponentFixture<AddInstallationRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInstallationRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInstallationRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
