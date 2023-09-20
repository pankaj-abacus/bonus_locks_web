import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnStockComponent } from './return-stock.component';

describe('ReturnStockComponent', () => {
  let component: ReturnStockComponent;
  let fixture: ComponentFixture<ReturnStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
