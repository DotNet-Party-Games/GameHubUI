import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardListItemComponent } from './leaderboard-list-item.component';

describe('LeaderboardListItemComponent', () => {
  let component: LeaderboardListItemComponent;
  let fixture: ComponentFixture<LeaderboardListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderboardListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
