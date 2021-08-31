import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameboardSetupComponent } from './gameboard-setup.component';

describe('GameboardSetupComponent', () => {
  let component: GameboardSetupComponent;
  let fixture: ComponentFixture<GameboardSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameboardSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameboardSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
