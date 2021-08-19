import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamewindowComponent } from './gamewindow.component';

describe('GamewindowComponent', () => {
  let component: GamewindowComponent;
  let fixture: ComponentFixture<GamewindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamewindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamewindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
