import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsnotTMComponent } from './isnot-tm.component';

describe('IsnotTMComponent', () => {
  let component: IsnotTMComponent;
  let fixture: ComponentFixture<IsnotTMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsnotTMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsnotTMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
