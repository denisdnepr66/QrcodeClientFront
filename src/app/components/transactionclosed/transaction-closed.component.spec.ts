import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionClosedComponent } from './transaction-closed.component';

describe('TransactionClosedComponent', () => {
  let component: TransactionClosedComponent;
  let fixture: ComponentFixture<TransactionClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionClosedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
