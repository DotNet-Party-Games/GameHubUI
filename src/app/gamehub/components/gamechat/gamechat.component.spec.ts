import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamechatComponent } from './gamechat.component';

describe('GamechatComponent', () => {
  let component: GamechatComponent;
  let fixture: ComponentFixture<GamechatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamechatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamechatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
