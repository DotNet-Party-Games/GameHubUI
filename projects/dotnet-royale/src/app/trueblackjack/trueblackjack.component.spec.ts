import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueblackjackComponent } from './trueblackjack.component';

describe('TrueblackjackComponent', () => {
  let component: TrueblackjackComponent;
  let fixture: ComponentFixture<TrueblackjackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrueblackjackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrueblackjackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
